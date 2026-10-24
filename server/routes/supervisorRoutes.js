const express = require('express');
const router = express.Router();
const Supervisor = require('../models/Supervisor');
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');
const { protectSupervisor } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const upload = require('../middleware/upload');
const { generateJoiningLetter } = require('../utils/pdfGenerator');
const { getOtpEmailTemplate, getEmployeeWelcomeTemplate } = require('../utils/emailTemplates');

// ==========================================
// AUTHENTICATION
// ==========================================

// @route   POST /api/supervisor/login
// @desc    Auth supervisor & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const supervisor = await Supervisor.findOne({ email: email.trim().toLowerCase() }).populate('companyId');

    if (supervisor && (await supervisor.matchPassword(password))) {
      res.json({
        _id: supervisor._id,
        supervisorId: supervisor.supervisorId,
        email: supervisor.email,
        name: supervisor.name,
        role: supervisor.role,
        companyId: supervisor.companyId?._id || supervisor.companyId || null,
        companyCode: supervisor.companyCode || supervisor.companyId?.companyCode || '',
        companyName: supervisor.companyId?.companyName || '',
        token: generateToken(supervisor._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/supervisor/me
// @desc    Get logged in supervisor profile and company
// @access  Private (Supervisor)
router.get('/me', protectSupervisor, async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.supervisor._id)
      .select('-password')
      .populate('companyId');

    if (supervisor) {
      res.json(supervisor);
    } else {
      res.status(404).json({ message: 'Supervisor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ==========================================
// SUPERVISOR COMPANY & WAGE PARTICULAR RATES
// ==========================================

// @route   GET /api/supervisor/company
// @desc    Get company and wage particulars grid assigned to this supervisor
// @access  Private (Supervisor)
router.get('/company', protectSupervisor, async (req, res) => {
  try {
    let company = null;
    if (req.supervisor.companyId) {
      company = await Company.findById(req.supervisor.companyId);
    }

    if (!company) {
      company = await Company.findOne({
        $or: [
          { supervisors: req.supervisor._id },
          { companyCode: req.supervisor.companyCode },
        ],
      });
    }

    if (!company) {
      // Return a default template company so UI does not break
      return res.json({
        companyName: 'General Workforce Partner',
        companyCode: 'CORP-GEN',
        wageParticulars: {
          unskilled: { basicWage: 450, hraDa: 100, overtimeRatePerHour: 80, monthlyWage: 14300 },
          skilled: { basicWage: 650, hraDa: 150, overtimeRatePerHour: 120, monthlyWage: 20800 },
          highlySkilled: { basicWage: 850, hraDa: 200, overtimeRatePerHour: 160, monthlyWage: 27300 },
          superSkilled: { basicWage: 1100, hraDa: 250, overtimeRatePerHour: 200, monthlyWage: 35100 },
          customTiers: [],
        },
      });
    }

    res.json(company);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// SUPERVISOR DASHBOARD STATS
// ==========================================
router.get('/stats', protectSupervisor, async (req, res) => {
  try {
    const employees = await Employee.find({ supervisorId: req.supervisor._id });
    const totalEmployees = employees.length;

    const skillCounts = {
      Unskilled: 0,
      Skilled: 0,
      'Highly Skilled': 0,
      'Super Skilled': 0,
      'User-Defined': 0,
    };

    employees.forEach((emp) => {
      const level = emp.skillLevel || (emp.skillType === 'Skilled' ? 'Skilled' : 'Unskilled');
      if (skillCounts[level] !== undefined) {
        skillCounts[level]++;
      } else {
        skillCounts['User-Defined']++;
      }
    });

    res.json({
      totalEmployees,
      skillCounts,
      companyCode: req.supervisor.companyCode || 'ASSIGNED',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// WORKER REGISTRATION WITH WAGE ALLOTMENT
// ==========================================

// @route   POST /api/supervisor/employees
// @desc    Register new worker with skill-wise salary calculation and Cloudinary documents
// @access  Private (Supervisor)
router.post(
  '/employees',
  protectSupervisor,
  upload.fields([
    { name: 'aadhaar', maxCount: 1 },
    { name: 'pan', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        email,
        employeeId,
        phoneNumber,
        address,
        dob,
        gender,
        qualifications,
        institutions,
        passingYear,
        skillType,
        skillLevel,
        skills,
        experienceYears,
        previousRoles,
        previousSalary,
        // Allotted Salary Particulars
        tierName,
        basicWage,
        hraDa,
        overtimeRatePerHour,
        monthlyWage,
        grossSalary,
        netSalary,
        calculationNotes,
      } = req.body;

      if (!name || !email || !employeeId) {
        return res.status(400).json({ message: 'Name, Email, and Employee ID are required' });
      }

      const employeeExists = await Employee.findOne({ $or: [{ email }, { employeeId }] });
      if (employeeExists) {
        return res.status(400).json({ message: 'Worker with this email or ID already registered' });
      }

      // Generate random password
      const generateRandomPassword = () => {
        const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
        let pass = '';
        for (let i = 0; i < 10; i++) {
          pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return pass;
      };
      const plainPassword = generateRandomPassword();

      // Cloudinary document URLs
      let aadhaarUrl = '';
      let panUrl = '';
      let profilePhotoUrl = '';

      if (req.files) {
        if (req.files.aadhaar) aadhaarUrl = req.files.aadhaar[0].path;
        if (req.files.pan) panUrl = req.files.pan[0].path;
        if (req.files.profilePhoto) profilePhotoUrl = req.files.profilePhoto[0].path;
      }

      // Parse skills
      let parsedSkills = [];
      if (skills) {
        try {
          parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
        } catch (e) {
          parsedSkills = typeof skills === 'string' ? skills.split(',').map((s) => s.trim()) : skills;
        }
      }

      // Find company
      let company = null;
      if (req.supervisor.companyId) {
        company = await Company.findById(req.supervisor.companyId);
      }
      if (!company) {
        company = await Company.findOne({
          $or: [
            { supervisors: req.supervisor._id },
            { companyCode: req.supervisor.companyCode },
          ],
        });
      }

      const companyId = company ? company._id : null;
      const companyCode = company ? company.companyCode : (req.supervisor.companyCode || 'DEFAULT');
      const companyName = company ? company.companyName : 'The Infinity Roles';

      // Determine Skill Level & Salary Particulars
      const determinedSkillLevel = skillLevel || (skillType === 'Skilled' ? 'Skilled' : 'Unskilled');
      const numericBasic = Number(basicWage) || 0;
      const numericHraDa = Number(hraDa) || 0;
      const numericOt = Number(overtimeRatePerHour) || 0;
      const numericMonthly = Number(monthlyWage) || (numericBasic + numericHraDa) * 26;

      const employee = await Employee.create({
        name,
        email,
        employeeId,
        phoneNumber,
        address,
        dob,
        gender,
        qualifications,
        institutions,
        passingYear,
        skillType: determinedSkillLevel === 'Unskilled' ? 'Unskilled' : 'Skilled',
        skillLevel: determinedSkillLevel,
        skills: parsedSkills,
        experienceYears: experienceYears ? Number(experienceYears) : 0,
        previousRoles,
        previousSalary: previousSalary ? Number(previousSalary) : 0,
        password: plainPassword,
        aadhaarUrl,
        panUrl,
        profilePhotoUrl,
        supervisorId: req.supervisor._id,
        companyId,
        companyCode,
        wageParticulars: {
          tierName: tierName || `${determinedSkillLevel} Worker`,
          basicWage: numericBasic,
          hraDa: numericHraDa,
          overtimeRatePerHour: numericOt,
          monthlyWage: numericMonthly,
          grossSalary: Number(grossSalary) || numericMonthly,
          netSalary: Number(netSalary) || numericMonthly,
          calculationNotes: calculationNotes || `Salary allotted under Company Code ${companyCode}`,
        },
      });

      // Generate joining letter PDF with salary breakdown
      const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/employee/login`;
      try {
        const pdfBuffer = await generateJoiningLetter({
          name: employee.name,
          employeeId: employee.employeeId,
          email: employee.email,
          phoneNumber: employee.phoneNumber,
          companyName,
          companyCode,
          skillLevel: determinedSkillLevel,
          basicWage: numericBasic,
          hraDa: numericHraDa,
          overtimeRatePerHour: numericOt,
          monthlyWage: numericMonthly,
        });

        await sendEmail({
          email: employee.email,
          subject: `Appointment & Joining Letter - ${companyName}`,
          message: `Dear ${employee.name}, your worker registration is confirmed. Please find your joining letter attached.`,
          html: getEmployeeWelcomeTemplate({
            name: employee.name,
            employeeId: employee.employeeId,
            email: employee.email,
            password: plainPassword,
            companyName,
            companyCode,
            skillLevel: determinedSkillLevel,
            monthlyWage: numericMonthly,
            loginUrl,
          }),
          attachments: [
            {
              filename: `${employee.name.replace(/\s+/g, '_')}_Joining_Letter.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        });
      } catch (mailErr) {
        console.error('Failed to dispatch joining letter email:', mailErr);
      }

      res.status(201).json({
        _id: employee._id,
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        companyCode: employee.companyCode,
        skillLevel: employee.skillLevel,
        wageParticulars: employee.wageParticulars,
      });
    } catch (error) {
      console.error('Error creating worker:', error);
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  }
);

// @route   GET /api/supervisor/employees
// @desc    Get all employees for logged in supervisor
// @access  Private (Supervisor)
router.get('/employees', protectSupervisor, async (req, res) => {
  try {
    const employees = await Employee.find({ supervisorId: req.supervisor._id })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/supervisor/employees/:id
// @desc    Update employee details and wage particulars
// @access  Private (Supervisor)
router.put('/employees/:id', protectSupervisor, async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, supervisorId: req.supervisor._id });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found or not authorized' });
    }

    const {
      name,
      email,
      phoneNumber,
      address,
      skillLevel,
      wageParticulars,
    } = req.body;

    if (name) employee.name = name;
    if (email) employee.email = email;
    if (phoneNumber !== undefined) employee.phoneNumber = phoneNumber;
    if (address !== undefined) employee.address = address;
    if (skillLevel) {
      employee.skillLevel = skillLevel;
      employee.skillType = skillLevel === 'Unskilled' ? 'Unskilled' : 'Skilled';
    }

    if (wageParticulars) {
      employee.wageParticulars = {
        ...employee.wageParticulars.toObject(),
        ...wageParticulars,
      };
    }

    const updated = await employee.save();
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   DELETE /api/supervisor/employees/:id
// @desc    Delete employee
// @access  Private (Supervisor)
router.delete('/employees/:id', protectSupervisor, async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, supervisorId: req.supervisor._id });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found or not authorized' });
    }

    await employee.deleteOne();
    res.json({ message: 'Employee removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// SUPERVISOR OTP PASSWORD RESET
// ==========================================

// @route   POST /api/supervisor/forgotpassword
// @desc    Send 6-digit OTP to Supervisor email
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const supervisor = await Supervisor.findOne({ email: req.body.email?.trim().toLowerCase() });

    if (!supervisor) {
      return res.status(404).json({ message: 'There is no supervisor with that email' });
    }

    const otp = supervisor.getResetOtp();
    // Also save token for backward compatibility
    supervisor.getResetPasswordToken();
    await supervisor.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: supervisor.email,
        subject: 'Your Password Reset OTP - Supervisor Portal',
        html: getOtpEmailTemplate({
          recipientName: supervisor.name,
          otp,
          role: 'Supervisor',
          expiresMinutes: 10,
        }),
      });

      res.status(200).json({ message: '6-digit OTP sent to your registered email' });
    } catch (err) {
      supervisor.resetOtp = undefined;
      supervisor.resetOtpExpire = undefined;
      await supervisor.save({ validateBeforeSave: false });
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/supervisor/verify-otp
// @desc    Verify 6-digit OTP for supervisor
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const supervisor = await Supervisor.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!supervisor) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/supervisor/resetpassword-otp
// @desc    Reset password using 6-digit OTP
// @access  Public
router.post('/resetpassword-otp', async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const supervisor = await Supervisor.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!supervisor) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    supervisor.password = password;
    supervisor.resetOtp = undefined;
    supervisor.resetOtpExpire = undefined;
    supervisor.resetPasswordToken = undefined;
    supervisor.resetPasswordExpire = undefined;
    await supervisor.save();

    res.json({ message: 'Password reset successfully. Please login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Backward-compatible token reset
router.put('/resetpassword/:resettoken', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const supervisor = await Supervisor.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!supervisor) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    supervisor.password = req.body.password;
    supervisor.resetPasswordToken = undefined;
    supervisor.resetPasswordExpire = undefined;
    await supervisor.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;

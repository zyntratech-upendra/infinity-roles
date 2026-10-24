const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Supervisor = require('../models/Supervisor');
const Consultant = require('../models/Consultant');
const Employee = require('../models/Employee');
const Company = require('../models/Company');
const generateToken = require('../utils/generateToken');
const { protectAdmin } = require('../middleware/authMiddleware');
const { companyUpload } = require('../middleware/upload');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { getOtpEmailTemplate, getSupervisorWelcomeTemplate } = require('../utils/emailTemplates');

// @route   POST /api/admin/login
// @desc    Auth admin & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      res.json({
        _id: admin._id,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/admin/me
// @desc    Get logged in admin profile
// @access  Private (Admin)
router.get('/me', protectAdmin, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select('-password');
    if (admin) {
      res.json(admin);
    } else {
      res.status(404).json({ message: 'Admin not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/admin/supervisors
// @desc    Create a supervisor and send login info
// @access  Private (Admin)
router.post('/supervisors', protectAdmin, async (req, res) => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    
    // Check if user already exists
    const supervisorExists = await Supervisor.findOne({ email });
    if (supervisorExists) {
      return res.status(400).json({ message: 'Supervisor already exists' });
    }

    // Generate random password
    const password = Math.random().toString(36).slice(-8);
    
    // Generate supervisorId
    
    // Generate supervisorId
    const supervisorId = 'SUP-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const supervisor = await Supervisor.create({
      name,
      email,
      password,
      phoneNumber,
      address,
      supervisorId,
    });

    if (supervisor) {
      // Send email
      const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-bottom: 1px solid #eaeaea;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">The Infinity Roles</h1>
        </div>
        <div style="padding: 40px 20px; text-align: center; background-color: #ffffff;">
          <h2 style="color: #111827; margin-top: 0; font-size: 20px;">Welcome, Supervisor!</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 30px;">
            You have been added as a Supervisor to The Infinity Roles portal. Here are your login credentials.
          </p>
          <div style="border: 2px dashed #4f46e5; border-radius: 8px; padding: 20px; margin: 0 auto; max-width: 400px;">
            <p style="color: #6b7280; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-top: 0;">YOUR LOGIN CREDENTIALS</p>
            <p style="font-size: 18px; margin: 10px 0; color: #111827;"><strong>Email:</strong> ${email}</p>
            <p style="font-size: 18px; margin: 10px 0; color: #111827;"><strong>Password:</strong> ${password}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; margin-bottom: 20px;">
            Please log in to the application to proceed. We recommend changing your password immediately after logging in.
          </p>
          <a href="http://localhost:5173/supervisor/login" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Log In to Your Account</a>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            The Infinity Roles © 2026 | <a href="mailto:support@infinityroles.com" style="color: #4f46e5; text-decoration: none;">support@infinityroles.com</a>
          </p>
        </div>
      </div>
      `;

      await sendEmail({
        email: supervisor.email,
        subject: 'Welcome to The Infinity Roles - Your Supervisor Account',
        html: htmlTemplate,
      });

      res.status(201).json({
        _id: supervisor._id,
        supervisorId: supervisor.supervisorId,
        name: supervisor.name,
        email: supervisor.email,
        phoneNumber: supervisor.phoneNumber,
        address: supervisor.address,
        role: supervisor.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid supervisor data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/admin/supervisors
// @desc    Get all supervisors
// @access  Private (Admin)
router.get('/supervisors', protectAdmin, async (req, res) => {
  try {
    const supervisors = await Supervisor.find({}).select('-password');
    res.json(supervisors);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/admin/consultants
// @desc    Create a consultant and send login info
// @access  Private (Admin)
router.post('/consultants', protectAdmin, async (req, res) => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    
    // Check if user already exists
    const consultantExists = await Consultant.findOne({ email });
    if (consultantExists) {
      return res.status(400).json({ message: 'Consultant already exists' });
    }

    // Generate random password
    const password = Math.random().toString(36).slice(-8);

    // Generate consultantId
    const consultantId = 'CON-' + Math.random().toString(36).substr(2, 6).toUpperCase();

    const consultant = await Consultant.create({
      name,
      email,
      phoneNumber,
      address,
      consultantId,
      password,
    });

    if (consultant) {
      // Send email
      const htmlTemplate = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-bottom: 1px solid #eaeaea;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">The Infinity Roles</h1>
        </div>
        <div style="padding: 40px 20px; text-align: center; background-color: #ffffff;">
          <h2 style="color: #111827; margin-top: 0; font-size: 20px;">Welcome, Consultant!</h2>
          <p style="color: #6b7280; font-size: 16px; margin-bottom: 30px;">
            You have been added as a Consultant to The Infinity Roles portal. Here are your login credentials.
          </p>
          <div style="border: 2px dashed #4f46e5; border-radius: 8px; padding: 20px; margin: 0 auto; max-width: 400px;">
            <p style="color: #6b7280; font-size: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin-top: 0;">YOUR LOGIN CREDENTIALS</p>
            <p style="font-size: 18px; margin: 10px 0; color: #111827;"><strong>Email:</strong> ${email}</p>
            <p style="font-size: 18px; margin: 10px 0; color: #111827;"><strong>Password:</strong> ${password}</p>
          </div>
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; margin-bottom: 20px;">
            Please log in to the application to proceed. We recommend changing your password immediately after logging in.
          </p>
          <a href="http://localhost:5173/consultant/login" style="display: inline-block; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Log In to Your Account</a>
        </div>
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #eaeaea;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            The Infinity Roles © 2026 | <a href="mailto:support@infinityroles.com" style="color: #4f46e5; text-decoration: none;">support@infinityroles.com</a>
          </p>
        </div>
      </div>
      `;

      await sendEmail({
        email: consultant.email,
        subject: 'Welcome to The Infinity Roles - Your Consultant Account',
        html: htmlTemplate,
      });

      res.status(201).json({
        _id: consultant._id,
        consultantId: consultant.consultantId,
        name: consultant.name,
        email: consultant.email,
        phoneNumber: consultant.phoneNumber,
        address: consultant.address,
        role: consultant.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid consultant data' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/admin/consultants
// @desc    Get all consultants
// @access  Private (Admin)
router.get('/consultants', protectAdmin, async (req, res) => {
  try {
    const consultants = await Consultant.find({}).select('-password');
    res.json(consultants);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/admin/supervisors/:id
// @desc    Update a supervisor
// @access  Private (Admin)
router.put('/supervisors/:id', protectAdmin, async (req, res) => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    const supervisor = await Supervisor.findById(req.params.id);

    if (supervisor) {
      supervisor.name = name || supervisor.name;
      supervisor.email = email || supervisor.email;
      supervisor.phoneNumber = phoneNumber || supervisor.phoneNumber;
      supervisor.address = address || supervisor.address;
      
      const updatedSupervisor = await supervisor.save();

      res.json({
        _id: updatedSupervisor._id,
        supervisorId: updatedSupervisor.supervisorId,
        name: updatedSupervisor.name,
        email: updatedSupervisor.email,
        phoneNumber: updatedSupervisor.phoneNumber,
        address: updatedSupervisor.address,
        role: updatedSupervisor.role,
      });
    } else {
      res.status(404).json({ message: 'Supervisor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   DELETE /api/admin/supervisors/:id
// @desc    Delete a supervisor
// @access  Private (Admin)
router.delete('/supervisors/:id', protectAdmin, async (req, res) => {
  try {
    const supervisor = await Supervisor.findByIdAndDelete(req.params.id);
    if (supervisor) {
      res.json({ message: 'Supervisor removed' });
    } else {
      res.status(404).json({ message: 'Supervisor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/admin/forgotpassword
// @desc    Forgot Password
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: req.body.email });

    if (!admin) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = admin.getResetPasswordToken();

    await admin.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/reset-password/${resetToken}`;

    const message = `You requested a password reset. Please go to: ${resetUrl}`;

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">The Infinity <span style="color: #06b6d4;">Roles</span></h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
          <h2 style="color: #1f2937; margin-top: 0; text-align: center;">Reset Your Password</h2>
          <p style="color: #4b5563; line-height: 1.6;">Hello,</p>
          <p style="color: #4b5563; line-height: 1.6;">We received a request to reset the password for your The Infinity Roles Admin account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; box-shadow: 0 4px 6px rgba(79, 70, 229, 0.2);">Reset Password</a>
          </div>
          <p style="color: #4b5563; line-height: 1.6; font-size: 14px;">If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 25px 0;" />
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">The Infinity Roles &copy; 2026. All rights reserved.</p>
        </div>
      </div>
    `;

    try {
      await sendEmail({
        email: admin.email,
        subject: 'Reset Your The Infinity Roles Password',
        message,
        html: htmlTemplate,
      });

      res.status(200).json({ message: 'Email sent' });
    } catch (err) {
      console.error(err);
      admin.resetPasswordToken = undefined;
      admin.resetPasswordExpire = undefined;

      await admin.save({ validateBeforeSave: false });

      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/admin/resetpassword/:resettoken
// @desc    Reset Password
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    admin.password = req.body.password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.status(200).json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/admin/stats
// @desc    Get system stats for dashboard
// @access  Private (Admin)
router.get('/stats', protectAdmin, async (req, res) => {
  try {
    const [companies, supervisors, consultants, employees] = await Promise.all([
      Company.countDocuments().catch(() => 0),
      Supervisor.countDocuments().catch(() => 0),
      Consultant.countDocuments().catch(() => 0),
      Employee.countDocuments().catch(() => 0),
    ]);

    const skillBreakdown = await Employee.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$skillLevel', '$skillType'] },
          count: { $sum: 1 },
        },
      },
    ]).catch(() => []);

    res.json({
      companies,
      supervisors,
      consultants,
      employees,
      totalUsers: supervisors + consultants + employees,
      skillBreakdown,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users across roles (Supervisors, Consultants, Employees)
// @access  Private (Admin)
router.get('/users', protectAdmin, async (req, res) => {
  try {
    const supervisors = await Supervisor.find({}).select('-password');
    const consultants = await Consultant.find({}).select('-password');
    const employees = await Employee.find({}).select('-password');

    const formattedSupervisors = supervisors.map(s => ({
      _id: s._id,
      name: s.name,
      email: s.email,
      phone: s.phoneNumber || '-',
      role: 'Supervisor',
      identifier: s.supervisorId || '-',
      createdAt: s.createdAt
    }));

    const formattedConsultants = consultants.map(c => ({
      _id: c._id,
      name: c.name,
      email: c.email,
      phone: c.phoneNumber || '-',
      role: 'Consultant',
      identifier: c.consultantId || '-',
      createdAt: c.createdAt
    }));

    const formattedEmployees = employees.map(e => ({
      _id: e._id,
      name: e.name,
      email: e.email,
      phone: e.phoneNumber || '-',
      role: 'Employee',
      identifier: e.employeeId || '-',
      createdAt: e.createdAt
    }));

    const allUsers = [...formattedSupervisors, ...formattedConsultants, ...formattedEmployees];
    res.json(allUsers);
  } catch (error) {
    console.error('Error in /api/admin/users:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/admin/consultants/:id
// @desc    Update a consultant
// @access  Private (Admin)
router.put('/consultants/:id', protectAdmin, async (req, res) => {
  try {
    const { name, email, phoneNumber, address } = req.body;
    const consultant = await Consultant.findById(req.params.id);

    if (consultant) {
      consultant.name = name || consultant.name;
      consultant.email = email || consultant.email;
      consultant.phoneNumber = phoneNumber || consultant.phoneNumber;
      consultant.address = address || consultant.address;
      
      const updatedConsultant = await consultant.save();

      res.json({
        _id: updatedConsultant._id,
        consultantId: updatedConsultant.consultantId,
        name: updatedConsultant.name,
        email: updatedConsultant.email,
        phoneNumber: updatedConsultant.phoneNumber,
        address: updatedConsultant.address,
        role: updatedConsultant.role,
      });
    } else {
      res.status(404).json({ message: 'Consultant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   DELETE /api/admin/consultants/:id
// @desc    Delete a consultant
// @access  Private (Admin)
router.delete('/consultants/:id', protectAdmin, async (req, res) => {
  try {
    const consultant = await Consultant.findByIdAndDelete(req.params.id);
    if (consultant) {
      res.json({ message: 'Consultant removed' });
    } else {
      res.status(404).json({ message: 'Consultant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});



// ==========================================
// COMPANY MANAGEMENT (CRUD)
// ==========================================

// @route   GET /api/admin/companies
// @desc    Get all registered companies
// @access  Private (Admin)
router.get('/companies', protectAdmin, async (req, res) => {
  try {
    const companies = await Company.find({})
      .populate('supervisors', 'name email supervisorId phoneNumber')
      .sort({ createdAt: -1 });

    // Attach worker counts per company
    const counts = await Employee.aggregate([
      { $match: { companyId: { $ne: null } } },
      { $group: { _id: '$companyId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    counts.forEach((c) => {
      countMap[c._id.toString()] = c.count;
    });

    const companiesWithCount = companies.map((comp) => {
      const obj = comp.toObject();
      obj.workerCount = countMap[comp._id.toString()] || 0;
      return obj;
    });

    res.json(companiesWithCount);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/admin/companies/:id
// @desc    Get single company by ID with its workforce
// @access  Private (Admin)
router.get('/companies/:id', protectAdmin, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id).populate('supervisors', 'name email supervisorId phoneNumber');
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const employees = await Employee.find({ companyId: company._id }).select('-password').sort({ createdAt: -1 });

    res.json({ company, employees });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/admin/companies
// @desc    Register a new company with wage structure and supervisor assignment
// @access  Private (Admin)
router.post('/companies', protectAdmin, companyUpload.single('logo'), async (req, res) => {
  try {
    const {
      companyName,
      companyCode,
      registrationNumber,
      email,
      phoneNumber,
      address,
      city,
      state,
      pincode,
      industry,
      supervisors,
      wageParticulars,
      newSupervisorName,
      newSupervisorEmail,
      newSupervisorPhone,
    } = req.body;

    if (!companyName || !companyCode || !email) {
      return res.status(400).json({ message: 'Company Name, Unique Code, and Email are required' });
    }

    // Check unique code
    const existing = await Company.findOne({ companyCode: companyCode.toUpperCase().trim() });
    if (existing) {
      return res.status(400).json({ message: `Company Code "${companyCode}" already exists. Please choose another code.` });
    }

    // Parse wageParticulars if provided as JSON string (FormData)
    let parsedWage = {};
    if (wageParticulars) {
      try {
        parsedWage = typeof wageParticulars === 'string' ? JSON.parse(wageParticulars) : wageParticulars;
      } catch (e) {
        console.error('Error parsing wageParticulars JSON:', e);
      }
    }

    // Parse supervisor IDs
    let supervisorIds = [];
    if (supervisors) {
      try {
        supervisorIds = typeof supervisors === 'string' ? JSON.parse(supervisors) : supervisors;
      } catch (e) {
        if (typeof supervisors === 'string') supervisorIds = supervisors.split(',').map((s) => s.trim()).filter(Boolean);
      }
    }

    // Handle Cloudinary logo URL
    let logoUrl = '';
    if (req.file && req.file.path) {
      logoUrl = req.file.path;
    } else if (req.body.logoUrl) {
      logoUrl = req.body.logoUrl;
    }

    // If admin is adding a brand new supervisor on the fly during company registration:
    if (newSupervisorEmail && newSupervisorName) {
      const supExists = await Supervisor.findOne({ email: newSupervisorEmail.trim().toLowerCase() });
      if (!supExists) {
        const plainPassword = Math.random().toString(36).slice(-8);
        const supervisorId = 'SUP-' + Math.random().toString(36).substr(2, 6).toUpperCase();

        const newSup = await Supervisor.create({
          name: newSupervisorName.trim(),
          email: newSupervisorEmail.trim().toLowerCase(),
          phoneNumber: newSupervisorPhone || '',
          password: plainPassword,
          supervisorId,
          companyCode: companyCode.toUpperCase().trim(),
        });

        supervisorIds.push(newSup._id);

        // Send login credentials email with company context
        try {
          const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/supervisor/login`;
          await sendEmail({
            email: newSup.email,
            subject: `Welcome to ${companyName} - Your Supervisor Account`,
            html: getSupervisorWelcomeTemplate({
              name: newSup.name,
              email: newSup.email,
              password: plainPassword,
              companyName,
              companyCode: companyCode.toUpperCase().trim(),
              loginUrl,
            }),
          });
        } catch (mailErr) {
          console.error('Failed to send supervisor welcome email:', mailErr);
        }
      }
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Company@123', salt);

    const company = await Company.create({
      companyName: companyName.trim(),
      companyCode: companyCode.toUpperCase().trim(),
      registrationNumber: registrationNumber || '',
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      industry: industry || 'Manufacturing & Staffing',
      logoUrl,
      password: hashedPassword,
      supervisors: supervisorIds,
      wageParticulars: {
        unskilled: parsedWage.unskilled || { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
        skilled: parsedWage.skilled || { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
        highlySkilled: parsedWage.highlySkilled || { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
        superSkilled: parsedWage.superSkilled || { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
        customTiers: parsedWage.customTiers || [],
      },
      createdBy: req.admin._id,
    });

    // Update supervisors to link this company
    if (supervisorIds.length > 0) {
      await Supervisor.updateMany(
        { _id: { $in: supervisorIds } },
        { $set: { companyId: company._id, companyCode: company.companyCode } }
      );
    }

    const populated = await Company.findById(company._id).populate('supervisors', 'name email supervisorId phoneNumber');
    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating company:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/admin/companies/:id
// @desc    Update company details, supervisors, and wage particulars
// @access  Private (Admin)
router.put('/companies/:id', protectAdmin, companyUpload.single('logo'), async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const {
      companyName,
      registrationNumber,
      email,
      phoneNumber,
      address,
      city,
      state,
      pincode,
      industry,
      status,
      supervisors,
      wageParticulars,
    } = req.body;

    if (companyName) company.companyName = companyName.trim();
    if (registrationNumber !== undefined) company.registrationNumber = registrationNumber;
    if (email) company.email = email.trim().toLowerCase();
    if (phoneNumber !== undefined) company.phoneNumber = phoneNumber;
    if (address !== undefined) company.address = address;
    if (city !== undefined) company.city = city;
    if (state !== undefined) company.state = state;
    if (pincode !== undefined) company.pincode = pincode;
    if (industry !== undefined) company.industry = industry;
    if (status !== undefined) company.status = status;

    if (req.file && req.file.path) {
      company.logoUrl = req.file.path;
    } else if (req.body.logoUrl) {
      company.logoUrl = req.body.logoUrl;
    }

    if (wageParticulars) {
      try {
        const parsed = typeof wageParticulars === 'string' ? JSON.parse(wageParticulars) : wageParticulars;
        company.wageParticulars = {
          ...company.wageParticulars.toObject(),
          ...parsed,
        };
      } catch (e) {
        console.error('Error parsing updated wage particulars:', e);
      }
    }

    if (supervisors !== undefined) {
      let supervisorIds = [];
      try {
        supervisorIds = typeof supervisors === 'string' ? JSON.parse(supervisors) : supervisors;
      } catch (e) {
        if (typeof supervisors === 'string') supervisorIds = supervisors.split(',').map((s) => s.trim()).filter(Boolean);
      }
      company.supervisors = supervisorIds;

      // Update supervisors' company linkage
      await Supervisor.updateMany(
        { _id: { $in: supervisorIds } },
        { $set: { companyId: company._id, companyCode: company.companyCode } }
      );
    }

    await company.save();
    const updated = await Company.findById(company._id).populate('supervisors', 'name email supervisorId phoneNumber');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   DELETE /api/admin/companies/:id
// @desc    Delete company
// @access  Private (Admin)
router.delete('/companies/:id', protectAdmin, async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Unlink supervisors
    await Supervisor.updateMany(
      { companyId: company._id },
      { $unset: { companyId: '', companyCode: '' } }
    );

    // Unlink employees
    await Employee.updateMany(
      { companyId: company._id },
      { $unset: { companyId: '', companyCode: '' } }
    );

    await Company.findByIdAndDelete(req.params.id);
    res.json({ message: 'Company and workforce links removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// ADMIN OTP PASSWORD RESET
// ==========================================

// @route   POST /api/admin/forgotpassword
// @desc    Send 6-digit OTP to Admin email
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOne({ email: email.trim().toLowerCase() });
    if (!admin) {
      return res.status(404).json({ message: 'No admin found with that email address' });
    }

    const otp = admin.getResetOtp();
    await admin.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: admin.email,
        subject: 'Your Password Reset OTP - The Infinity Roles Admin',
        html: getOtpEmailTemplate({
          recipientName: 'Administrator',
          otp,
          role: 'Admin',
          expiresMinutes: 10,
        }),
      });
      res.status(200).json({ message: '6-digit OTP sent to your registered email' });
    } catch (mailErr) {
      admin.resetOtp = undefined;
      admin.resetOtpExpire = undefined;
      await admin.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Failed to send OTP email' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/admin/verify-otp
// @desc    Verify 6-digit OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/admin/resetpassword-otp
// @desc    Reset password after OTP verification
// @access  Public
router.post('/resetpassword-otp', async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const admin = await Admin.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!admin) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    admin.password = password;
    admin.resetOtp = undefined;
    admin.resetOtpExpire = undefined;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.json({ message: 'Password reset successfully. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;

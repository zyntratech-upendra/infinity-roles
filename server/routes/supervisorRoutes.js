const express = require('express');
const router = express.Router();
const Supervisor = require('../models/Supervisor');
const Employee = require('../models/Employee');
const generateToken = require('../utils/generateToken');
const { protectSupervisor } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const upload = require('../middleware/upload');
const { generateJoiningLetter } = require('../utils/pdfGenerator');

// @route   POST /api/supervisor/login
// @desc    Auth supervisor & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const supervisor = await Supervisor.findOne({ email });

    if (supervisor && (await supervisor.matchPassword(password))) {
      res.json({
        _id: supervisor._id,
        supervisorId: supervisor.supervisorId,
        email: supervisor.email,
        name: supervisor.name,
        role: supervisor.role,
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
// @desc    Get logged in supervisor profile
// @access  Private (Supervisor)
router.get('/me', protectSupervisor, async (req, res) => {
  try {
    const supervisor = await Supervisor.findById(req.supervisor._id).select('-password');
    if (supervisor) {
      res.json(supervisor);
    } else {
      res.status(404).json({ message: 'Supervisor not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/supervisor/forgotpassword
// @desc    Forgot Password
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const supervisor = await Supervisor.findOne({ email: req.body.email });

    if (!supervisor) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = supervisor.getResetPasswordToken();

    await supervisor.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/supervisor/reset-password/${resetToken}`;

    const message = `You requested a password reset. Please go to: ${resetUrl}`;

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">The Infinity <span style="color: #06b6d4;">Roles</span></h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
          <h2 style="color: #1f2937; margin-top: 0; text-align: center;">Reset Your Password</h2>
          <p style="color: #4b5563; line-height: 1.6;">Hello,</p>
          <p style="color: #4b5563; line-height: 1.6;">We received a request to reset the password for your The Infinity Roles Supervisor account. Click the button below to set a new password:</p>
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
        email: supervisor.email,
        subject: 'Reset Your The Infinity Roles Password',
        message,
        html: htmlTemplate,
      });

      res.status(200).json({ message: 'Email sent' });
    } catch (err) {
      console.error(err);
      supervisor.resetPasswordToken = undefined;
      supervisor.resetPasswordExpire = undefined;

      await supervisor.save({ validateBeforeSave: false });

      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/supervisor/resetpassword/:resettoken
// @desc    Reset Password
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const supervisor = await Supervisor.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!supervisor) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Set new password
    supervisor.password = req.body.password;
    supervisor.resetPasswordToken = undefined;
    supervisor.resetPasswordExpire = undefined;
    await supervisor.save();

    res.status(200).json({
      message: 'Password reset successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/supervisor/employees
// @desc    Create new employee
// @access  Private (Supervisor)
router.post('/employees', protectSupervisor, upload.fields([{ name: 'aadhaar', maxCount: 1 }, { name: 'pan', maxCount: 1 }, { name: 'profilePhoto', maxCount: 1 }]), async (req, res) => {
  try {
    const { 
      name, email, employeeId, phoneNumber, address,
      dob, gender, qualifications, institutions, passingYear,
      skillType, skills, experienceYears, previousRoles, previousSalary
    } = req.body;

    const employeeExists = await Employee.findOne({ $or: [{ email }, { employeeId }] });
    if (employeeExists) {
      return res.status(400).json({ message: 'Employee with this email or ID already exists' });
    }

    const generateRandomPassword = () => {
      const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
      let password = '';
      for (let i = 0; i < 12; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };
    
    const plainPassword = generateRandomPassword();

    let aadhaarUrl = '';
    let panUrl = '';
    let profilePhotoUrl = '';

    if (req.files) {
      if (req.files.aadhaar) aadhaarUrl = req.files.aadhaar[0].path;
      if (req.files.pan) panUrl = req.files.pan[0].path;
      if (req.files.profilePhoto) profilePhotoUrl = req.files.profilePhoto[0].path;
    }

    // Parse skills array if it comes as a string (FormData limitation)
    let parsedSkills = [];
    if (skills) {
      try {
        parsedSkills = typeof skills === 'string' ? JSON.parse(skills) : skills;
      } catch (e) {
        parsedSkills = skills.split(',').map(s => s.trim());
      }
    }

    const employee = await Employee.create({
      name, email, employeeId, phoneNumber, address,
      dob, gender, qualifications, institutions, passingYear,
      skillType, skills: parsedSkills, experienceYears, previousRoles, previousSalary,
      password: plainPassword,
      aadhaarUrl, panUrl, profilePhotoUrl,
      supervisorId: req.supervisor._id
    });

    const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/employee/login`;
    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800;">The Infinity <span style="color: #06b6d4;">Roles</span></h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
          <h2 style="color: #1f2937; margin-top: 0; text-align: center;">Welcome to The Infinity Roles!</h2>
          <p style="color: #4b5563; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
          <p style="color: #4b5563; line-height: 1.6;">Your Employee account has been successfully created by your Supervisor. Please find your official Joining Letter attached to this email.</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #4f46e5;">
            <p style="margin: 0 0 10px 0; color: #374151;"><strong>Login Details:</strong></p>
            <p style="margin: 0; color: #4b5563;">Email: <strong>${email}</strong></p>
            <p style="margin: 5px 0 0 0; color: #4b5563;">Password: <strong>${plainPassword}</strong></p>
          </div>
          <div style="text-align: center; margin: 35px 0;">
            <a href="${loginUrl}" style="background-color: #4f46e5; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Login to Your Account</a>
          </div>
          <p style="color: #4b5563; line-height: 1.6; font-size: 14px;">We highly recommend resetting your password immediately after logging in for the first time.</p>
        </div>
      </div>
    `;

    try {
      const pdfBuffer = await generateJoiningLetter({ name, employeeId, email });
      
      await sendEmail({
        email: employee.email,
        subject: 'Welcome to The Infinity Roles - Account Created & Joining Letter',
        message: 'Your account has been created. Please find your joining letter attached.',
        html: htmlTemplate,
        attachments: [
          {
            filename: 'Joining_Letter.pdf',
            content: pdfBuffer,
            contentType: 'application/pdf'
          }
        ]
      });
    } catch (err) {
      console.error('Email failed to send for employee creation:', err);
    }

    res.status(201).json({
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      employeeId: employee.employeeId,
      supervisorId: employee.supervisorId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/supervisor/employees
// @desc    Get all employees for logged in supervisor
// @access  Private (Supervisor)
router.get('/employees', protectSupervisor, async (req, res) => {
  try {
    const employees = await Employee.find({ supervisorId: req.supervisor._id }).select('-password');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/supervisor/employees/:id
// @desc    Update employee details
// @access  Private (Supervisor)
router.put('/employees/:id', protectSupervisor, async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, supervisorId: req.supervisor._id });

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found or not authorized' });
    }

    employee.name = req.body.name || employee.name;
    employee.email = req.body.email || employee.email;
    employee.employeeId = req.body.employeeId || employee.employeeId;
    employee.phoneNumber = req.body.phoneNumber || employee.phoneNumber;
    employee.address = req.body.address || employee.address;

    const updatedEmployee = await employee.save();

    res.json({
      _id: updatedEmployee._id,
      name: updatedEmployee.name,
      email: updatedEmployee.email,
      employeeId: updatedEmployee.employeeId,
    });
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
    res.json({ message: 'Employee removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;

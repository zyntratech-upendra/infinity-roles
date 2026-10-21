const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Supervisor = require('../models/Supervisor');
const Consultant = require('../models/Consultant');
const Employee = require('../models/Employee');
const generateToken = require('../utils/generateToken');
const { protectAdmin } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

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
    const supervisorCount = await Supervisor.countDocuments().catch(() => 0);
    const consultantCount = await Consultant.countDocuments().catch(() => 0);
    const employeeCount = await Employee.countDocuments().catch(() => 0);

    res.json({
      supervisors: supervisorCount,
      consultants: consultantCount,
      employees: employeeCount,
      totalUsers: supervisorCount + consultantCount + employeeCount,
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

module.exports = router;

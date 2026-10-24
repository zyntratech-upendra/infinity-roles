const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const generateToken = require('../utils/generateToken');
const { protectEmployee } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { getOtpEmailTemplate } = require('../utils/emailTemplates');

// ==========================================
// AUTHENTICATION
// ==========================================

// @route   POST /api/employee/login
// @desc    Auth employee & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email: email.trim().toLowerCase() })
      .populate('companyId', 'companyName companyCode logoUrl')
      .populate('supervisorId', 'name supervisorId email phoneNumber');

    if (employee && (await employee.matchPassword(password))) {
      res.json({
        _id: employee._id,
        employeeId: employee.employeeId,
        email: employee.email,
        name: employee.name,
        role: employee.role,
        companyName: employee.companyId?.companyName || 'The Infinity Roles',
        companyCode: employee.companyCode || employee.companyId?.companyCode || '',
        skillLevel: employee.skillLevel || employee.skillType,
        wageParticulars: employee.wageParticulars,
        token: generateToken(employee._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/employee/me
// @desc    Get logged in employee profile, company info, and wage breakdown
// @access  Private (Employee)
router.get('/me', protectEmployee, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id)
      .select('-password')
      .populate('companyId', 'companyName companyCode email phoneNumber address logoUrl')
      .populate('supervisorId', 'name supervisorId email phoneNumber');

    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ==========================================
// OTP PASSWORD RESET
// ==========================================

// @route   POST /api/employee/forgotpassword
// @desc    Send 6-digit OTP
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.body.email?.trim().toLowerCase() });

    if (!employee) {
      return res.status(404).json({ message: 'There is no worker with that email' });
    }

    const otp = employee.getResetOtp();
    employee.getResetPasswordToken();
    await employee.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: employee.email,
        subject: 'Your Password Reset OTP - Employee Portal',
        html: getOtpEmailTemplate({
          recipientName: employee.name,
          otp,
          role: 'Employee',
          expiresMinutes: 10,
        }),
      });

      res.status(200).json({ message: '6-digit OTP sent to your registered email' });
    } catch (err) {
      employee.resetOtp = undefined;
      employee.resetOtpExpire = undefined;
      await employee.save({ validateBeforeSave: false });
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/employee/verify-otp
// @desc    Verify 6-digit OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const employee = await Employee.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!employee) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/employee/resetpassword-otp
// @desc    Reset password using 6-digit OTP
// @access  Public
router.post('/resetpassword-otp', async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const employee = await Employee.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!employee) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    employee.password = password;
    employee.resetOtp = undefined;
    employee.resetOtpExpire = undefined;
    employee.resetPasswordToken = undefined;
    employee.resetPasswordExpire = undefined;
    await employee.save();

    res.json({ message: 'Password reset successfully. Please login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Backward-compatible token reset
router.put('/resetpassword/:resettoken', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const employee = await Employee.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!employee) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    employee.password = req.body.password;
    employee.resetPasswordToken = undefined;
    employee.resetPasswordExpire = undefined;
    await employee.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;

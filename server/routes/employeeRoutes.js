const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');
const generateToken = require('../utils/generateToken');
const { protectEmployee } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @route   POST /api/employee/login
// @desc    Auth employee & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await Employee.findOne({ email });

    if (employee && (await employee.matchPassword(password))) {
      res.json({
        _id: employee._id,
        employeeId: employee.employeeId,
        email: employee.email,
        name: employee.name,
        role: employee.role,
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
// @desc    Get logged in employee profile
// @access  Private (Employee)
router.get('/me', protectEmployee, async (req, res) => {
  try {
    const employee = await Employee.findById(req.employee._id).select('-password');
    if (employee) {
      res.json(employee);
    } else {
      res.status(404).json({ message: 'Employee not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/employee/forgotpassword
// @desc    Forgot Password
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const employee = await Employee.findOne({ email: req.body.email });

    if (!employee) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = employee.getResetPasswordToken();
    await employee.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/employee/reset-password/${resetToken}`;

    const message = `You requested a password reset. Please go to: ${resetUrl}`;

    const htmlTemplate = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #4f46e5; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: 1px;">The Infinity <span style="color: #06b6d4;">Roles</span></h1>
        </div>
        <div style="background-color: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); border: 1px solid #f3f4f6;">
          <h2 style="color: #1f2937; margin-top: 0; text-align: center;">Reset Your Password</h2>
          <p style="color: #4b5563; line-height: 1.6;">Hello,</p>
          <p style="color: #4b5563; line-height: 1.6;">We received a request to reset the password for your The Infinity Roles Employee account. Click the button below to set a new password:</p>
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
        email: employee.email,
        subject: 'Reset Your The Infinity Roles Password',
        message,
        html: htmlTemplate,
      });
      res.status(200).json({ message: 'Email sent' });
    } catch (err) {
      console.error(err);
      employee.resetPasswordToken = undefined;
      employee.resetPasswordExpire = undefined;
      await employee.save({ validateBeforeSave: false });
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/employee/resetpassword/:resettoken
// @desc    Reset Password
// @access  Public
router.put('/resetpassword/:resettoken', async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

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

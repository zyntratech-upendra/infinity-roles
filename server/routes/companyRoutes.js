const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const Employee = require('../models/Employee');
const Supervisor = require('../models/Supervisor');
const generateToken = require('../utils/generateToken');
const { protectCompany } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { getOtpEmailTemplate } = require('../utils/emailTemplates');

// ==========================================
// AUTHENTICATION
// ==========================================

// @route   POST /api/company/login
// @desc    Auth client company via email or company code
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Company email or company code and password are required' });
    }

    const trimmed = identifier.trim();
    // Allow login by email, companyCode, OR companyName (case-insensitive)
    const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const company = await Company.findOne({
      $or: [
        { email: trimmed.toLowerCase() },
        { companyCode: trimmed.toUpperCase() },
        { companyName: { $regex: new RegExp(`^${escaped}$`, 'i') } }
      ]
    }).populate('supervisors', 'name email supervisorId phoneNumber');

    if (company && (await company.matchPassword(password))) {
      res.json({
        _id: company._id,
        companyName: company.companyName,
        companyCode: company.companyCode,
        email: company.email,
        role: 'Company',
        logoUrl: company.logoUrl,
        wageParticulars: company.wageParticulars,
        token: generateToken(company._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid company credentials or company code' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/company/me
// @desc    Get logged in company details, supervisors, and stats
// @access  Private (Company)
router.get('/me', protectCompany, async (req, res) => {
  try {
    const company = await Company.findById(req.company._id)
      .select('-password')
      .populate('supervisors', 'name email supervisorId phoneNumber');

    if (!company) {
      return res.status(404).json({ message: 'Company record not found' });
    }

    const workerCount = await Employee.countDocuments({ companyId: company._id });

    // Skill distribution for this company
    const skillStats = await Employee.aggregate([
      { $match: { companyId: company._id } },
      { $group: { _id: '$skillLevel', count: { $sum: 1 } } }
    ]);

    res.json({
      ...company.toObject(),
      workerCount,
      skillStats,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/company/workforce
// @desc    Get all workers enrolled under this company
// @access  Private (Company)
router.get('/workforce', protectCompany, async (req, res) => {
  try {
    const workers = await Employee.find({ companyId: req.company._id })
      .populate('supervisorId', 'name supervisorId email')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   PUT /api/company/wages
// @desc    Update and set worker wage grid for logged-in company
// @access  Private (Company)
router.put('/wages', protectCompany, async (req, res) => {
  try {
    const { wageParticulars } = req.body;
    if (!wageParticulars) {
      return res.status(400).json({ message: 'Wage particulars are required' });
    }

    const company = await Company.findById(req.company._id);
    if (!company) {
      return res.status(404).json({ message: 'Company organization not found' });
    }

    company.wageParticulars = wageParticulars;
    await company.save();

    res.json({
      message: 'Worker wage grid updated successfully',
      wageParticulars: company.wageParticulars
    });
  } catch (error) {
    console.error('Error updating company wages:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// OTP PASSWORD RESET
// ==========================================

// @route   POST /api/company/forgotpassword
// @desc    Send 6-digit OTP to Company email
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const { email } = req.body;
    const company = await Company.findOne({ email: email.trim().toLowerCase() });

    if (!company) {
      return res.status(404).json({ message: 'No registered company found with that email' });
    }

    const otp = company.getResetOtp();
    await company.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: company.email,
        subject: 'Company Portal Password Reset OTP - The Infinity Roles',
        html: getOtpEmailTemplate({
          recipientName: company.companyName,
          otp,
          role: 'Company',
          expiresMinutes: 10,
        }),
      });

      res.status(200).json({ message: '6-digit OTP code sent to company email' });
    } catch (err) {
      company.resetOtp = undefined;
      company.resetOtpExpire = undefined;
      await company.save({ validateBeforeSave: false });
      res.status(500).json({ message: 'Email could not be dispatched' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/company/verify-otp
// @desc    Verify 6-digit OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const company = await Company.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!company) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/company/resetpassword-otp
// @desc    Reset password after OTP verification
// @access  Public
router.post('/resetpassword-otp', async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const company = await Company.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!company) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    company.password = password;
    company.resetOtp = undefined;
    company.resetOtpExpire = undefined;
    company.resetPasswordToken = undefined;
    company.resetPasswordExpire = undefined;
    await company.save();

    res.json({ message: 'Password reset successfully. You can now login to the Company Portal.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;

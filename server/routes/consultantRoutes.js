const express = require('express');
const router = express.Router();
const Consultant = require('../models/Consultant');
const Company = require('../models/Company');
const Employee = require('../models/Employee');
const Supervisor = require('../models/Supervisor');
const generateToken = require('../utils/generateToken');
const { protectConsultant } = require('../middleware/authMiddleware');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');
const { getOtpEmailTemplate } = require('../utils/emailTemplates');

// ==========================================
// AUTHENTICATION
// ==========================================

// @route   POST /api/consultant/login
// @desc    Auth consultant & get token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const consultant = await Consultant.findOne({ email: email.trim().toLowerCase() });

    if (consultant && (await consultant.matchPassword(password))) {
      res.json({
        _id: consultant._id,
        consultantId: consultant.consultantId,
        email: consultant.email,
        name: consultant.name,
        role: consultant.role,
        token: generateToken(consultant._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/consultant/me
// @desc    Get logged in consultant profile
// @access  Private (Consultant)
router.get('/me', protectConsultant, async (req, res) => {
  try {
    const consultant = await Consultant.findById(req.consultant._id).select('-password');
    if (consultant) {
      res.json(consultant);
    } else {
      res.status(404).json({ message: 'Consultant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// ==========================================
// CONSULTANT AUDIT & ANALYTICS
// ==========================================

// @route   GET /api/consultant/stats
// @desc    Get audit overview statistics
// @access  Private (Consultant)
router.get('/stats', protectConsultant, async (req, res) => {
  try {
    const [companiesCount, workersCount, supervisorsCount] = await Promise.all([
      Company.countDocuments({ status: 'Active' }),
      Employee.countDocuments(),
      Supervisor.countDocuments(),
    ]);

    // Workers skill distribution
    const skillDistribution = await Employee.aggregate([
      {
        $group: {
          _id: { $ifNull: ['$skillLevel', '$skillType'] },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      companiesCount,
      workersCount,
      supervisorsCount,
      skillDistribution,
      auditCompliance: '99.4%',
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/consultant/companies
// @desc    View all companies and their wage structures for statutory audit
// @access  Private (Consultant)
router.get('/companies', protectConsultant, async (req, res) => {
  try {
    const companies = await Company.find({})
      .populate('supervisors', 'name email supervisorId')
      .sort({ createdAt: -1 });

    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   GET /api/consultant/workers
// @desc    View workforce records and salary allocations for audit
// @access  Private (Consultant)
router.get('/workers', protectConsultant, async (req, res) => {
  try {
    const workers = await Employee.find({})
      .populate('supervisorId', 'name supervisorId email')
      .populate('companyId', 'companyName companyCode')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ==========================================
// OTP PASSWORD RESET
// ==========================================

// @route   POST /api/consultant/forgotpassword
// @desc    Send 6-digit OTP
// @access  Public
router.post('/forgotpassword', async (req, res) => {
  try {
    const consultant = await Consultant.findOne({ email: req.body.email?.trim().toLowerCase() });

    if (!consultant) {
      return res.status(404).json({ message: 'There is no consultant with that email' });
    }

    const otp = consultant.getResetOtp();
    consultant.getResetPasswordToken();
    await consultant.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: consultant.email,
        subject: 'Your Password Reset OTP - Consultant Portal',
        html: getOtpEmailTemplate({
          recipientName: consultant.name,
          otp,
          role: 'Consultant',
          expiresMinutes: 10,
        }),
      });

      res.status(200).json({ message: '6-digit OTP sent to your registered email' });
    } catch (err) {
      consultant.resetOtp = undefined;
      consultant.resetOtpExpire = undefined;
      await consultant.save({ validateBeforeSave: false });
      res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/consultant/verify-otp
// @desc    Verify 6-digit OTP
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const consultant = await Consultant.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!consultant) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/consultant/resetpassword-otp
// @desc    Reset password using 6-digit OTP
// @access  Public
router.post('/resetpassword-otp', async (req, res) => {
  try {
    const { email, otp, password } = req.body;
    if (!email || !otp || !password) {
      return res.status(400).json({ message: 'Email, OTP, and new password are required' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp.trim()).digest('hex');
    const consultant = await Consultant.findOne({
      email: email.trim().toLowerCase(),
      resetOtp: hashedOtp,
      resetOtpExpire: { $gt: Date.now() },
    });

    if (!consultant) {
      return res.status(400).json({ message: 'Invalid or expired OTP code' });
    }

    consultant.password = password;
    consultant.resetOtp = undefined;
    consultant.resetOtpExpire = undefined;
    consultant.resetPasswordToken = undefined;
    consultant.resetPasswordExpire = undefined;
    await consultant.save();

    res.json({ message: 'Password reset successfully. Please login with your new password.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Backward-compatible token reset
router.put('/resetpassword/:resettoken', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const consultant = await Consultant.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!consultant) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    consultant.password = req.body.password;
    consultant.resetPasswordToken = undefined;
    consultant.resetPasswordExpire = undefined;
    await consultant.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;

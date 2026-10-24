const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const supervisorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
  },
  address: {
    type: String,
  },
  supervisorId: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: 'Supervisor',
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  companyCode: {
    type: String,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  resetOtp: String,
  resetOtpExpire: Date,
}, { timestamps: true });

// Hash password before saving
supervisorSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
supervisorSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
supervisorSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Generate 6-digit OTP
supervisorSchema.methods.getResetOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetOtp = crypto.createHash('sha256').update(otp).digest('hex');
  this.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

const Supervisor = mongoose.model('Supervisor', supervisorSchema);

module.exports = Supervisor;

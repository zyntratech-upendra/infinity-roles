const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const employeeSchema = new mongoose.Schema({
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
  employeeId: {
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
    default: 'Employee',
  },
  supervisorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supervisor',
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  },
  companyCode: {
    type: String,
  },
  dob: { type: Date },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  qualifications: { type: String },
  institutions: { type: String },
  passingYear: { type: String },
  skillType: { type: String }, // legacy field
  skillLevel: {
    type: String,
    enum: ['Unskilled', 'Skilled', 'Highly Skilled', 'Super Skilled', 'User-Defined'],
    default: 'Unskilled',
  },
  skills: { type: [String] },
  experienceYears: { type: Number },
  previousRoles: { type: String },
  previousSalary: { type: Number },
  // Allotted Wage / Salary Particulars
  wageParticulars: {
    tierName: { type: String },
    basicWage: { type: Number, default: 0 },
    hraDa: { type: Number, default: 0 },
    overtimeRatePerHour: { type: Number, default: 0 },
    monthlyWage: { type: Number, default: 0 },
    grossSalary: { type: Number, default: 0 },
    netSalary: { type: Number, default: 0 },
    calculationNotes: { type: String },
  },
  aadhaarUrl: { type: String },
  panUrl: { type: String },
  profilePhotoUrl: { type: String },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  resetOtp: String,
  resetOtpExpire: Date,
}, { timestamps: true });

// Hash password before saving
employeeSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
employeeSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
employeeSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Generate 6-digit OTP
employeeSchema.methods.getResetOtp = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetOtp = crypto.createHash('sha256').update(otp).digest('hex');
  this.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;

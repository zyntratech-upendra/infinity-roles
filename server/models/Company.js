const mongoose = require('mongoose');

const wageTierSchema = new mongoose.Schema({
  basicWage: {
    type: Number,
    default: 0,
  },
  hraDa: {
    type: Number,
    default: 0,
  },
  overtimeRatePerHour: {
    type: Number,
    default: 0,
  },
  monthlyWage: {
    type: Number,
    default: 0,
  },
}, { _id: false });

const customWageTierSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  basicWage: {
    type: Number,
    default: 0,
  },
  hraDa: {
    type: Number,
    default: 0,
  },
  overtimeRatePerHour: {
    type: Number,
    default: 0,
  },
  monthlyWage: {
    type: Number,
    default: 0,
  },
}, { _id: true });

const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
  },
  companyCode: {
    type: String,
    required: [true, 'Company code is required'],
    unique: true,
    uppercase: true,
    trim: true,
  },
  registrationNumber: {
    type: String, // CIN or GSTIN
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Official company email is required'],
    trim: true,
    lowercase: true,
  },
  phoneNumber: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  pincode: {
    type: String,
  },
  industry: {
    type: String,
    default: 'Manufacturing & Staffing',
  },
  logoUrl: {
    type: String,
    default: '',
  },
  // Multiple supervisors can be assigned to this company
  supervisors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supervisor',
  }],
  // Standard Wage particulars for Workers by Skill Tier
  wageParticulars: {
    unskilled: {
      type: wageTierSchema,
      default: () => ({ basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 }),
    },
    skilled: {
      type: wageTierSchema,
      default: () => ({ basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 }),
    },
    highlySkilled: {
      type: wageTierSchema,
      default: () => ({ basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 }),
    },
    superSkilled: {
      type: wageTierSchema,
      default: () => ({ basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 }),
    },
    // User-defined / Custom Wage Tiers
    customTiers: [customWageTierSchema],
  },
  password: {
    type: String,
    default: 'Company@123',
  },
  role: {
    type: String,
    default: 'Company',
  },
  resetOtp: String,
  resetOtpExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
  },
}, { timestamps: true });

// Hash password before saving
companySchema.pre('save', async function () {
  if (!this.password || this.password.startsWith('$2')) {
    return;
  }
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database (with plaintext fallback)
companySchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  const bcrypt = require('bcryptjs');

  // If password was stored in plaintext, check direct equality and auto-upgrade to bcrypt hash
  if (!this.password.startsWith('$2')) {
    if (enteredPassword === this.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        await this.save();
      } catch (e) {
        console.error('Error auto-hashing plaintext password:', e);
      }
      return true;
    }
    return false;
  }

  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate 6-digit OTP
companySchema.methods.getResetOtp = function () {
  const crypto = require('crypto');
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  this.resetOtp = crypto.createHash('sha256').update(otp).digest('hex');
  this.resetOtpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
  return otp;
};

const Company = mongoose.model('Company', companySchema);

module.exports = Company;


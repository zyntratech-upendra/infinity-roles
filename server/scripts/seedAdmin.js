const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/db');

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@infinityroles.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'; // In a real scenario, use a secure password

    const existingAdmin = await Admin.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('Admin user already exists. Seeding skipped.');
      process.exit(0);
    }

    const admin = new Admin({
      email: adminEmail,
      password: adminPassword, // The pre-save hook in the model will hash this
      role: 'Main Admin',
    });

    await admin.save();
    console.log('✅ Main Admin seeded successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();

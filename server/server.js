require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/adminRoutes');
const supervisorRoutes = require('./routes/supervisorRoutes');
const consultantRoutes = require('./routes/consultantRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route for testing
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to Infinity Roles API' });
});

// Admin API Routes
app.use('/api/admin', adminRoutes);

// Supervisor API Routes
app.use('/api/supervisor', supervisorRoutes);

// Consultant API Routes
app.use('/api/consultant', consultantRoutes);

// Employee API Routes
app.use('/api/employee', employeeRoutes);

const PORT = process.env.PORT || 5000;

// Start server (runs on Render and local, skips if running on Vercel Serverless)
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

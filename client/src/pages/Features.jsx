import React from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Users, 
  Globe, 
  TrendingUp, 
  Search, 
  Clock, 
  DollarSign, 
  FileText, 
  Camera, 
  MapPin, 
  Lock,
  Layers,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

const Features = () => {
  useSEO({
    title: 'Infinity Roles Features - Intelligent Workforce Platform',
    description: "Explore Infinity Roles' comprehensive suite: GPS-enabled attendance, live camera verification, role-based access control, automated payroll computation, and team analytics.",
    keywords: 'infinity roles features, role management, attendance tracking, payroll management, advanced analytics, role-based access'
  });

  const features = [
    { 
      icon: <Camera className="w-7 h-7 text-indigo-600" />, 
      title: 'Live Photo & Webcam Capture', 
      desc: 'Supervisors capture live webcam photos upon employee registration and daily shifts, guaranteeing zero proxy attendance.' 
    },
    { 
      icon: <MapPin className="w-7 h-7 text-cyan-600" />, 
      title: 'GPS Geofenced Punching', 
      desc: 'Verify shift check-ins with precise geofencing parameters, ensuring workers are on-site at assigned branches.' 
    },
    { 
      icon: <Layers className="w-7 h-7 text-purple-600" />, 
      title: 'Granular Role-Based Access (RBAC)', 
      desc: 'Dedicated distinct portals for Admins, Supervisors, Employees, and Consultants with zero permission cross-leakage.' 
    },
    { 
      icon: <DollarSign className="w-7 h-7 text-emerald-600" />, 
      title: 'Autonomous Payroll Calculation', 
      desc: 'Instantly calculate net wages based on attendance rates, overtimes, deductions, and generate formatted PDF payslips.' 
    },
    { 
      icon: <FileText className="w-7 h-7 text-indigo-600" />, 
      title: 'Joining Letters & Summary Print', 
      desc: 'Built-in official print templates for employee registration summaries, credentials, and formal joining documentation.' 
    },
    { 
      icon: <TrendingUp className="w-7 h-7 text-cyan-600" />, 
      title: 'Operational Heatmaps & Analytics', 
      desc: 'Real-time shift coverage reports, absenteeism tracking, and team productivity trends at a glance.' 
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-xs font-bold text-cyan-700 uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            Platform Capabilities
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 font-display mb-6 tracking-tight"
          >
            Engineered for <span className="text-gradient">Every Dimension of Work</span>
          </motion.h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg">
            Everything your organization needs to orchestrate staff, guarantee attendance veracity, and automate monthly payroll.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 relative group"
            >
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-display mb-3 group-hover:text-indigo-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA Card */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-950 p-10 sm:p-14 rounded-3xl text-white text-center shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl font-extrabold font-display mb-4">Ready to test Infinity Roles?</h2>
            <p className="text-slate-300 text-sm mb-8">
              Access the live portal demo and witness real-time attendance tracking and payroll automation in action.
            </p>
            <Link
              to="/supervisor/login"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-xl hover:shadow-indigo-500/50 hover:scale-105 transition-all"
            >
              <span>Access Supervisor Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Features;

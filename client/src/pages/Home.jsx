import React from 'react';
import HeroBanner from '../components/HeroBanner';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Briefcase, 
  Clock, 
  DollarSign, 
  FileText, 
  BarChart3, 
  UserPlus, 
  Settings, 
  Activity, 
  TrendingUp, 
  ArrowRight,
  Sparkles,
  Lock,
  CheckCircle2,
  Cpu,
  Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';

const Home = () => {
  useSEO({
    title: 'Intelligent Role & Workforce Management',
    description: 'Infinity Roles is an enterprise-grade workforce orchestration platform offering smart role hierarchy, real-time GPS & live-photo attendance, automated payroll, and actionable team analytics.',
    keywords: 'infinity roles, role management, workforce management, hr software, attendance tracking, automated payroll, staff scheduling'
  });

  const roles = [
    {
      name: 'Main Admin',
      roleTag: 'Platform Governance',
      loginUrl: '/admin/login',
      accentColor: 'indigo',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      features: [
        'Multi-company registration & lifecycle',
        'Enable / disable accounts with instant killswitch',
        'Global analytics & system audit logs',
        'Root security & permission controls',
        'Platform-wide diagnostics'
      ]
    },
    {
      name: 'Supervisor',
      roleTag: 'Team & Shift Orchestration',
      loginUrl: '/supervisor/login',
      accentColor: 'purple',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <Users className="w-6 h-6 text-purple-600" />,
      features: [
        'Oversee assigned employee shifts',
        'Live photo attendance & shift logging',
        'Real-time shift overrides & approvals',
        'Printable joining letters & summaries',
        'Daily & monthly productivity reports'
      ]
    },
    {
      name: 'Employee',
      roleTag: 'Self-Service & Records',
      loginUrl: '/employee/login',
      accentColor: 'cyan',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: <UserCheck className="w-6 h-6 text-cyan-600" />,
      features: [
        'Personal attendance timeline & history',
        'Instant payslip & salary slip downloads',
        'Digital credentials & contract viewer',
        'Profile & emergency contact updates',
        'Direct supervisor messaging channel'
      ]
    },
    {
      name: 'Consultant',
      roleTag: 'Audit & Engagements',
      loginUrl: '/consultant/login',
      accentColor: 'emerald',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <Briefcase className="w-6 h-6 text-emerald-600" />,
      features: [
        'Client engagement lifecycle tracking',
        'Timesheet reviews & project milestones',
        'Role-scoped compliance inspection',
        'Secure external report exports',
        'Advisory collaboration workspace'
      ]
    }
  ];

  const coreTools = [
    { 
      title: 'Real-Time Attendance & Geo-Stamp', 
      desc: 'GPS coordinates, live webcam snapshots, and timestamped verification prevent proxy punching and errors.', 
      icon: <Clock className="w-7 h-7 text-indigo-600" />,
      badge: 'Zero Fraud'
    },
    { 
      title: 'Automated Payroll Engine', 
      desc: 'Accurately computes net salaries, deductions, allowances, and generates compliant PDF payslips in one click.', 
      icon: <DollarSign className="w-7 h-7 text-cyan-600" />,
      badge: '1-Click Payout'
    },
    { 
      title: 'Secure Role Document Vault', 
      desc: 'Encrypted storage for employee verification, identity proofs, education certifications, and letters.', 
      icon: <FileText className="w-7 h-7 text-purple-600" />,
      badge: 'Encrypted'
    },
    { 
      title: 'Executive Intelligence & Radar', 
      desc: 'Predictive staffing alerts, attendance heatmaps, and department-level ROI analytics on interactive dashboards.', 
      icon: <BarChart3 className="w-7 h-7 text-emerald-600" />,
      badge: 'Live Insights'
    }
  ];

  const onboardingSteps = [
    { 
      step: '01',
      title: 'Define Roles & Structure', 
      desc: 'Map your company hierarchy into Infinity Roles with custom permissions for supervisors, consultants, and teams.', 
      icon: <UserPlus className="w-6 h-6 text-indigo-600" />
    },
    { 
      step: '02',
      title: 'Configure Attendance Rules', 
      desc: 'Set up shift schedules, grace periods, geofences, and camera verification modes with zero configuration friction.', 
      icon: <Settings className="w-6 h-6 text-purple-600" />
    },
    { 
      step: '03',
      title: 'Synchronize Daily Operations', 
      desc: 'Supervisors clock in teams with live photo capture while employees track their real-time hours on mobile or desktop.', 
      icon: <Activity className="w-6 h-6 text-cyan-600" />
    },
    { 
      step: '04',
      title: 'Scale with Predictive Insights', 
      desc: 'Leverage automated payslips and intelligence dashboards to cut administrative overhead by over 70%.', 
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen font-sans selection:bg-indigo-500 selection:text-white">
      <HeroBanner />

      {/* Role-Based Architecture Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-indigo-600" />
              Role Architecture
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display mb-4">
              Tailored Intelligence for <span className="text-gradient">Every Role</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Infinity Roles eliminates confusion with purposeful, strict access boundaries. Each stakeholder gets exactly what they need to excel.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            {roles.map((role, idx) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="group relative bg-white p-7 rounded-3xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300">
                      {role.icon}
                    </div>
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${role.badgeColor}`}>
                      {role.roleTag}
                    </span>
                  </div>

                  <h3 className="text-2xl font-extrabold text-slate-900 font-display mb-4">
                    {role.name}
                  </h3>

                  <ul className="space-y-3 mb-6">
                    {role.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-600 font-medium leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={role.loginUrl}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white font-bold text-xs transition-all duration-200 border border-slate-200 hover:border-indigo-600 group/btn"
                >
                  <span>Enter {role.name} Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities */}
      <section className="py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-100 text-xs font-bold text-cyan-700 uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
              Unified Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display mb-4">
              Engineered to Automate the <span className="text-gradient-cyan">Workforce Lifecycle</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              From GPS-verified punch-ins to tax calculations and encrypted records, run your workforce with zero friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreTools.map((tool, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50/60 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      {tool.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 font-display mb-2 group-hover:text-indigo-600 transition-colors">
                    {tool.title}
                  </h3>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    {tool.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Onboarding Journey Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-100 text-xs font-bold text-purple-700 uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5 text-purple-600" />
              Seamless Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-display mb-4">
              From Setup to Scale in Four Simple Steps
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">
              Empower your supervisors and teams in minutes with intuitive, zero-training interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {onboardingSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative bg-slate-50/70 p-7 rounded-3xl border border-slate-200/70 hover:bg-white hover:shadow-xl hover:border-indigo-200 transition-all duration-300 group"
              >
                <div className="text-4xl font-extrabold text-slate-200 font-display mb-4 group-hover:text-indigo-200 transition-colors">
                  {step.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display mb-2">{step.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact Executive Banner */}
      <section className="py-16 bg-slate-950 text-white relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-800">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 block">
                Ready to Upgrade Your Organization?
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold font-display leading-tight mb-4">
                Experience limitless control with Infinity Roles today.
              </h2>
              <p className="text-sm text-slate-300 font-normal">
                Join forward-thinking companies automating daily attendance, employee identity records, and error-free payroll.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Link
                to="/supervisor/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-cyan-500/40 transition-all text-center"
              >
                Access Supervisor Portal
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all text-center"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

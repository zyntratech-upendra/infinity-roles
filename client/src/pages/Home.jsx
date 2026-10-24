import React, { useState } from 'react';
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
  Layers,
  MapPin,
  Camera,
  Check,
  Building2,
  ChevronRight,
  Shield,
  FileSpreadsheet,
  CalendarCheck,
  Award,
  Zap,
  Globe2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import useSEO from '../hooks/useSEO';
import { AttendanceIllustration, PayrollIllustration } from '../components/Illustrations';

const Home = () => {
  useSEO({
    title: 'The Infinity Roles | Intelligent Role & Workforce Management',
    description: 'The Infinity Roles is an enterprise-grade workforce orchestration platform offering smart role hierarchy, real-time GPS & live-photo attendance, automated payroll, and actionable team analytics.',
    keywords: 'the infinity roles, infinity roles, role management, workforce management, hr software, attendance tracking, automated payroll, staff scheduling'
  });

  const [activeFeatureTab, setActiveFeatureTab] = useState('attendance');

  const roles = [
    {
      name: 'Main Admin',
      roleTag: 'Platform Governance',
      loginUrl: '/admin/login',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      features: [
        'Multi-company registration & enterprise root',
        'Global killswitch & account lockouts',
        'System audit trails & root diagnostics',
        'Role boundary enforcement & permissions'
      ]
    },
    {
      name: 'Supervisor',
      roleTag: 'Shift & Roster Orchestration',
      loginUrl: '/supervisor/login',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: <Users className="w-6 h-6 text-sky-600" />,
      features: [
        'Live photo capture attendance verification',
        'Shift schedules, late-mark rules & rosters',
        'Joining letter generation & employee onboarding',
        'Real-time team presence & shift approval'
      ]
    },
    {
      name: 'Employee',
      roleTag: 'Self-Service & Pay Slips',
      loginUrl: '/employee/login',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <UserCheck className="w-6 h-6 text-emerald-600" />,
      features: [
        'Personal punch history & timeline logs',
        'Instant payslip & tax breakdown downloads',
        'Verified credential badge & certificates',
        'Direct supervisor notification channels'
      ]
    },
    {
      name: 'Consultant',
      roleTag: 'External Audit & Milestones',
      loginUrl: '/consultant/login',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <Briefcase className="w-6 h-6 text-purple-600" />,
      features: [
        'Client contract engagement tracking',
        'Milestone deliverables & time inspections',
        'Compliance audits with external access rules',
        'Advisory collaboration reports'
      ]
    },
    {
      name: 'Company',
      roleTag: 'Workforce & Wage Transparency',
      loginUrl: '/company/login',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: <Building2 className="w-6 h-6 text-amber-600" />,
      features: [
        'Live workforce roster under company code',
        'Direct assigned supervisor contact registry',
        'Transparent skill-wise statutory wage scale',
        'Automated monthly estimated wage bill'
      ]
    }
  ];

  const features = [
    {
      id: 'attendance',
      title: 'Facial Snapshot & Geofenced Punch-In',
      tag: 'Zero Proxy',
      desc: 'Supervisors clock in their workforce using device camera validation alongside live GPS coordinates, creating an incontrovertible audit log.',
      points: [
        'Live camera facial snapshot verification',
        'Coordinates validated within designated perimeter',
        'Offline fallback caching with timestamp security'
      ],
      icon: <Camera className="w-6 h-6 text-indigo-600" />
    },
    {
      id: 'payroll',
      title: 'Automated 1-Click Payroll Pipeline',
      tag: 'Instant Calculation',
      desc: 'Connect shift punches directly into salary runs. Compute allowances, overtime, penalties, and taxes without opening spreadsheets.',
      points: [
        'Accurate hours and late-deduction formulas',
        'Dynamic allowances and bonuses calculation',
        'Compliant PDF payslip distribution'
      ],
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />
    },
    {
      id: 'hierarchy',
      title: 'Role-Based Access Boundaries (RBAC)',
      tag: 'Enterprise Security',
      desc: 'Admins govern companies; supervisors manage active shifts; employees access personal records. Zero cross-tenant leakage.',
      points: [
        'Fine-grained permission matrices',
        'Audit logging on every critical role action',
        'Granular credential revocation'
      ],
      icon: <Layers className="w-6 h-6 text-purple-600" />
    },
    {
      id: 'analytics',
      title: 'Executive Workforce Intelligence',
      tag: 'Real-Time Insights',
      desc: 'View organization-wide attendance heatmaps, department costs, and absenteeism trends on crisp light dashboards.',
      points: [
        'Live shift attendance percentage gauges',
        'Cost projection by department and role',
        'Automated monthly summary exports'
      ],
      icon: <BarChart3 className="w-6 h-6 text-sky-600" />
    }
  ];

  const workflowSteps = [
    {
      number: '01',
      title: 'Map Corporate Roles',
      desc: 'Create companies, define supervisors, and assign employees with role-scoped permissions.',
      icon: <UserPlus className="w-5 h-5 text-indigo-600" />
    },
    {
      number: '02',
      title: 'Set Attendance Rules',
      desc: 'Configure geofences, grace periods, live camera checks, and shift rosters.',
      icon: <Settings className="w-5 h-5 text-sky-600" />
    },
    {
      number: '03',
      title: 'Clock In & Sync Daily',
      desc: 'Supervisors verify teams on-site; employees verify their logged work sessions instantly.',
      icon: <CalendarCheck className="w-5 h-5 text-emerald-600" />
    },
    {
      number: '04',
      title: 'Compute & Disburse',
      desc: 'Generate audited payroll batches and download PDF payslips in a single click.',
      icon: <Award className="w-5 h-5 text-purple-600" />
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-slate-800">
      
      {/* 1. Hero Banner */}
      <HeroBanner />

      {/* 2. Interactive Feature Matrix with Clean Light Layout */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-indigo-600" />
              Platform Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mb-4">
              Engineered for Modern Organizations
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Every tool in The Infinity Roles is crafted to replace fragmented spreadsheets with synchronized, automated workflows.
            </p>
          </div>

          {/* Interactive Feature Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            {features.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFeatureTab(f.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  activeFeatureTab === f.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <span>{f.tag}</span>
              </button>
            ))}
          </div>

          {/* Dynamic Feature Preview Card (Clean, Light, Solid) */}
          {(() => {
            const currentF = features.find(f => f.id === activeFeatureTab) || features[0];
            return (
              <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-7">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6">
                      {currentF.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2 block">
                      {currentF.tag}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display mb-4">
                      {currentF.title}
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                      {currentF.desc}
                    </p>

                    <div className="space-y-3 mb-8">
                      {currentF.points.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-4">
                      <Link
                        to="/supervisor/login"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm transition"
                      >
                        <span>Experience This Feature</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <Link
                        to="/features"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                      >
                        Full Feature List
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 flex justify-center">
                    {currentF.id === 'payroll' ? (
                      <PayrollIllustration />
                    ) : (
                      <AttendanceIllustration />
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </section>

      {/* 3. Role-Based Architecture Cards (Clean Light Cards, Solid Borders) */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-xs font-bold text-sky-700 uppercase tracking-wider mb-3">
              <Layers className="w-3.5 h-3.5 text-sky-600" />
              Dedicated Portals
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mb-4">
              Tailored Access for Every Teammate
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              Strict role-based boundaries ensure everyone has exactly what they need—nothing more, nothing less.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {roles.map((role, idx) => (
              <motion.div
                key={role.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-300 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {role.icon}
                    </div>
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${role.badgeColor}`}>
                      {role.roleTag}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 font-display mb-3">
                    {role.name}
                  </h3>

                  <ul className="space-y-2.5 mb-6">
                    {role.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2 text-xs text-slate-600 font-medium leading-relaxed">
                        <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={role.loginUrl}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white font-bold text-xs transition-colors border border-slate-200 hover:border-indigo-600"
                >
                  <span>Enter {role.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Workflow Section - 4 Clear Sequential Steps */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-700 uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5 text-emerald-600" />
              Quick Onboarding
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display tracking-tight mb-4">
              From Setup to Scale in Four Steps
            </h2>
            <p className="text-base text-slate-600 leading-relaxed">
              No extensive training manuals or IT consultants required. Get your entire team operating on day one.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => (
              <div 
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl font-extrabold text-slate-300 font-display">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-display mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. Clean, Light Executive Call-To-Action (No dark background, no gradients) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-50 border-2 border-indigo-200 rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center lg:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 block">
                Enterprise Readiness
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 font-display leading-tight mb-3">
                Ready to organize your entire workforce?
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Join high-performing teams automating shift attendance, digital credentials, and error-free payroll.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              <Link
                to="/supervisor/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm transition text-center"
              >
                Launch Supervisor Portal
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 transition text-center"
              >
                Speak to Team
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;

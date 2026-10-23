import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Clock, 
  DollarSign, 
  Sparkles,
  Layers,
  ChevronRight,
  Briefcase,
  UserCheck,
  Check,
  MapPin,
  Camera,
  Play,
  Pause,
  DownloadCloud,
  BadgeCheck,
  Zap,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { HierarchyIllustration, AttendanceIllustration, PayrollIllustration } from './Illustrations';

const SLIDES = [
  {
    id: 'roles-orchestration',
    tag: 'ORGANIZATIONAL HIERARCHY',
    shortLabel: 'Role Matrix & RBAC',
    badgeText: 'Live Architecture V3',
    title: 'Precision Boundaries for',
    highlight: 'Every Role & Enterprise.',
    description: 'Eliminate chaotic permissions. Main Admins hold platform root, Supervisors orchestrate daily shifts, Employees access verified self-service records, and Consultants review milestones.',
    primaryBtn: { text: 'Explore Portals', link: '/supervisor/login' },
    secondaryBtn: { text: 'Inspect Role Matrix', link: '/features' },
    keyMetrics: [
      { label: 'Role Isolation', val: '100% Strict', sub: 'Zero privilege leaks' },
      { label: 'Multi-Tenant', val: 'Enterprise', sub: 'Scoped databases' },
      { label: 'Audit Trails', val: 'Real-Time', sub: 'Every action logged' }
    ],
    features: ['Multi-company governance', 'Granular permission sets', 'Instant root killswitch'],
    floatingTag1: '👑 Admin Root Governance',
    floatingTag2: '🛡️ Scoped RBAC Matrix'
  },
  {
    id: 'smart-attendance',
    tag: 'FACIAL SNAPSHOT & GEOFENCE',
    shortLabel: 'Geo-Camera Attendance',
    badgeText: 'Zero-Proxy Verification',
    title: 'Incontrovertible Proof with',
    highlight: 'Live Facial & GPS Punch.',
    description: 'Combat buddy punching and shift fraud. Our lightweight verification engine captures an encrypted live webcam selfie and matches GPS coordinates within meters of your workplace boundary.',
    primaryBtn: { text: 'Supervisor Clock-In', link: '/supervisor/login' },
    secondaryBtn: { text: 'Review Attendance Rules', link: '/features' },
    keyMetrics: [
      { label: 'Punch Accuracy', val: '100% Verified', sub: 'Dual photo & GPS' },
      { label: 'Geofence Radius', val: '±15 Meters', sub: 'Worksite boundary' },
      { label: 'Sync Latency', val: '< 0.4s', sub: 'Instant cloud push' }
    ],
    features: ['Real-time camera snapshot', 'Geotagged latitude & longitude', 'Instant punch roster'],
    floatingTag1: '📍 Geofence ±15m Active',
    floatingTag2: '📸 Facial Verified 09:00 AM'
  },
  {
    id: 'automated-payroll',
    tag: '1-CLICK COMPLIANT DISBURSEMENT',
    shortLabel: 'Automated Payroll Engine',
    badgeText: 'Error-Free Calculation',
    title: 'Shift Punches Converted to',
    highlight: 'Executive PDF Payslips.',
    description: 'Stop wasting days reconciling timesheets. Shift records automatically stream into payroll equations—accurately accounting for overtime, late marks, taxes, and generating audited pay slips.',
    primaryBtn: { text: 'Launch Payroll Engine', link: '/supervisor/login' },
    secondaryBtn: { text: 'Explore Payroll Workflow', link: '/about' },
    keyMetrics: [
      { label: 'Time Saved', val: '85% Faster', sub: 'No spreadsheets' },
      { label: 'Statutory Taxes', val: 'Automated', sub: 'Zero compliance slips' },
      { label: 'PDF Delivery', val: '1-Click', sub: 'Employee portal sync' }
    ],
    features: ['Automated deductions', '1-Click PDF generation', 'Full transparent audit trail'],
    floatingTag1: '💰 100% Tax Compliant',
    floatingTag2: '📄 1-Click Signed PDF'
  }
];

const HeroBanner = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const ROTATION_TIME = 6000; // 6 seconds auto-rotation

  useEffect(() => {
    if (isPaused) return;

    const tickInterval = 50;
    const step = (tickInterval / ROTATION_TIME) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveSlide((s) => (s + 1) % SLIDES.length);
          return 0;
        }
        return prev + step;
      });
    }, tickInterval);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handleSelectSlide = (idx) => {
    setActiveSlide(idx);
    setProgress(0);
  };

  const current = SLIDES[activeSlide];

  return (
    <div 
      className="relative overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-28 bg-slate-50 text-slate-900 border-b border-slate-200"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Light Blueprint Grid & Geometric Background Decorations (No Gradients) */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div 
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
        {/* Soft, solid-tinted architectural accents */}
        <div className="absolute -top-24 -left-20 w-96 h-96 rounded-full border border-indigo-100 bg-indigo-50/50" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 rounded-3xl rotate-12 border border-sky-100 bg-sky-50/40" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-64 rounded-full border border-slate-200 bg-white" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Slide Navigation Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
          
          {/* Animated Tab Switcher */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm w-full lg:w-auto">
            {SLIDES.map((s, idx) => {
              const isActive = activeSlide === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => handleSelectSlide(idx)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-2 ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-white' : 'bg-indigo-600'}`} />
                  <span>{s.shortLabel}</span>

                  {/* Progress bar inside active tab */}
                  {isActive && !isPaused && (
                    <motion.div 
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-indigo-300 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Live Runtime Status */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>LIVE CLOUD RUNTIME</span>
            </div>
            <span className="hidden sm:inline font-mono text-[11px] text-slate-400">
              {isPaused ? 'Auto-rotation paused' : 'Auto-advancing 6s'}
            </span>
          </div>
        </div>

        {/* 2-Column Hero Grid: Left Content & Right Illustrations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Headlines, Explanations, Interactive Badges, & CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
              >
                {/* Category Pill Tag */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-bold text-indigo-700 mb-5">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>{current.tag}</span>
                </div>

                {/* Main Dynamic Headline */}
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12] font-display mb-6">
                  {current.title} <br />
                  <span className="text-indigo-600">
                    {current.highlight}
                  </span>
                </h1>

                {/* Subtitle / Paragraph */}
                <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-normal leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0">
                  {current.description}
                </p>

                {/* 3 Metric Pills with Real Data */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-8 text-left max-w-xl mx-auto lg:mx-0">
                  {current.keyMetrics.map((m, mIdx) => (
                    <div key={mIdx} className="bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{m.label}</div>
                      <div className="text-base sm:text-lg font-extrabold text-slate-900 font-display mt-0.5">{m.val}</div>
                      <div className="text-[10px] text-slate-500 font-medium truncate">{m.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Feature Bullets */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                  {current.features.map((feat, fIdx) => (
                    <div key={fIdx} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Call to Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                  <Link
                    to={current.primaryBtn.link}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
                  >
                    <span>{current.primaryBtn.text}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={current.secondaryBtn.link}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-300 shadow-2xs transition-all active:scale-95"
                  >
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>{current.secondaryBtn.text}</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Column: High-Craft Master SVG Vector Illustration (In Place of Boxed Cards) */}
          <div className="lg:col-span-6 w-full relative flex items-center justify-center">
            
            {/* Floating Live Badge Top Right */}
            <motion.div 
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 right-2 sm:right-6 z-20 bg-white border border-slate-200 px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-2 text-xs font-bold text-slate-700"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{current.floatingTag1}</span>
            </motion.div>

            {/* Dynamic Master Illustration with Smooth 3D Entrance */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.94, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex items-center justify-center relative p-2"
              >
                {current.id === 'roles-orchestration' && (
                  <HierarchyIllustration />
                )}
                {current.id === 'smart-attendance' && (
                  <AttendanceIllustration />
                )}
                {current.id === 'automated-payroll' && (
                  <PayrollIllustration />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Bottom Floating Feature Pill */}
            <motion.div 
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 left-2 sm:left-6 z-20 bg-white border border-slate-200 px-4 py-2 rounded-2xl shadow-md flex items-center gap-2.5 text-xs text-slate-700"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
              <span className="font-bold">{current.floatingTag2}</span>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500 font-medium">100% Real-Time</span>
            </motion.div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default HeroBanner;

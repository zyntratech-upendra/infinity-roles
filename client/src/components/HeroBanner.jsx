import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  Clock, 
  DollarSign, 
  Zap,
  Layers,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Play
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SLIDES = [
  {
    id: 'slide-1',
    badge: 'INFINITY ROLES 3.0 • WORKFORCE INTELLIGENCE',
    titleLine1: 'Infinite Possibilities.',
    titleHighlight: 'Every Role Synchronized.',
    description: 'The next-generation workforce platform uniting Admins, Supervisors, Consultants, and Employees. Real-time geo-attendance, automated payroll pipelines, and seamless hierarchy management in one unified space.',
    primaryBtn: { text: 'Launch Role Portal', link: '/supervisor/login' },
    secondaryBtn: { text: 'Explore Role Matrix', link: '/features' },
    accentGradient: 'from-indigo-600 via-purple-600 to-cyan-500',
    bgGlow1: 'bg-indigo-500/15',
    bgGlow2: 'bg-cyan-500/15',
    pattern: 'mesh'
  },
  {
    id: 'slide-2',
    badge: 'SMART ATTENDANCE & BIOMETRICS',
    titleLine1: 'Zero Proxy Attendance.',
    titleHighlight: 'Live GPS & Camera Verified.',
    description: 'Empower supervisors with instant facial capture and live geofencing. Prevent time theft, monitor field rosters with 100% precision, and inspect daily punch records effortlessly.',
    primaryBtn: { text: 'View Attendance Engine', link: '/supervisor/login' },
    secondaryBtn: { text: 'Review Security Controls', link: '/features' },
    accentGradient: 'from-cyan-500 via-blue-600 to-indigo-600',
    bgGlow1: 'bg-cyan-500/20',
    bgGlow2: 'bg-blue-600/15',
    pattern: 'radial'
  },
  {
    id: 'slide-3',
    badge: 'AUTOMATED COMPLIANCE & PAYROLL',
    titleLine1: 'Effortless Salary Batches.',
    titleHighlight: '1-Click Compliant Payouts.',
    description: 'Calculate net pays, tax withholdings, dynamic allowances, and generate executive PDF payslips in seconds with our high-throughput automated payroll pipeline.',
    primaryBtn: { text: 'Explore Payroll Workflow', link: '/supervisor/login' },
    secondaryBtn: { text: 'See System Overview', link: '/features' },
    accentGradient: 'from-emerald-500 via-teal-500 to-indigo-600',
    bgGlow1: 'bg-emerald-500/15',
    bgGlow2: 'bg-indigo-500/15',
    pattern: 'mesh'
  }
];

const HeroBanner = () => {
  const [activeTab, setActiveTab] = useState('supervisor');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-play carousel every 6 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const slide = SLIDES[currentSlide];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  };

  return (
    <div 
      className="relative overflow-hidden pt-28 pb-20 lg:pt-36 lg:pb-28 min-h-[720px] transition-colors duration-1000 bg-slate-950 text-slate-100"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Dynamic Animated Carousel Background Layers */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 pointer-events-none select-none z-0"
        >
          {/* Subtle Dynamic Gradients & Glass Glows */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/90 to-slate-950" />
          
          {/* Decorative Subtle Grid Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.12]" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.4) 1px, transparent 0)', 
              backgroundSize: '36px 36px' 
            }}
          />

          {/* Fluid Color Orbs */}
          <div className={`absolute top-10 left-1/4 w-[540px] h-[540px] ${slide.bgGlow1} rounded-full blur-[130px] transition-all duration-1000 animate-pulse`} />
          <div className={`absolute top-28 right-1/4 w-[460px] h-[460px] ${slide.bgGlow2} rounded-full blur-[120px] transition-all duration-1000`} />
          <div className="absolute -bottom-20 left-1/3 w-[600px] h-[300px] bg-indigo-900/20 rounded-full blur-[140px]" />
        </motion.div>
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Content Column (7 cols) - Re-animates smoothly on slide transition */}
          <div className="lg:col-span-7 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              >
                {/* Version & Feature Pill */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 shadow-lg shadow-black/20 mb-6 text-xs font-semibold text-cyan-300 backdrop-blur-md">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
                  </span>
                  <span className="tracking-wide font-mono text-[11px]">{slide.badge}</span>
                </div>

                {/* Dynamic Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.12] font-display mb-6">
                  {slide.titleLine1} <br />
                  <span className={`bg-gradient-to-r ${slide.accentGradient} bg-clip-text text-transparent`}>
                    {slide.titleHighlight}
                  </span>
                </h1>
                
                {/* Dynamic Subcopy */}
                <p className="max-w-2xl mx-auto lg:mx-0 text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
                  {slide.description}
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10">
                  <Link 
                    to={slide.primaryBtn.link}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all border border-indigo-400/30"
                  >
                    <span>{slide.primaryBtn.text}</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <Link 
                    to={slide.secondaryBtn.link}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 border border-slate-700 text-slate-200 font-bold text-sm shadow-sm hover:bg-slate-800 hover:border-slate-600 hover:text-white transition-all backdrop-blur-md"
                  >
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>{slide.secondaryBtn.text}</span>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Carousel Navigation Indicators & Arrows */}
            <div className="flex items-center justify-center lg:justify-start gap-4 pt-2 mb-8">
              <div className="flex items-center gap-2 bg-slate-900/60 p-1.5 rounded-full border border-slate-800 backdrop-blur-sm">
                <button
                  onClick={handlePrev}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-1">
                  {SLIDES.map((s, idx) => (
                    <button
                      key={s.id}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentSlide === idx 
                          ? 'w-7 bg-gradient-to-r from-indigo-400 to-cyan-400' 
                          : 'w-2 bg-slate-700 hover:bg-slate-600'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNext}
                  className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                0{currentSlide + 1} / 0{SLIDES.length}
              </span>
            </div>

            {/* Micro Trust Stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800 max-w-lg mx-auto lg:mx-0">
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-white font-display">99.9%</div>
                <div className="text-xs font-semibold text-slate-400">Live Uptime</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-indigo-400 font-display">4 Roles</div>
                <div className="text-xs font-semibold text-slate-400">Unified Stack</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-extrabold text-cyan-400 font-display">Instant</div>
                <div className="text-xs font-semibold text-slate-400">Payroll Calculation</div>
              </div>
            </div>
          </div>

          {/* Right Showcase Column (5 cols) */}
          <motion.div 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Ambient Card Glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition duration-1000"></div>

            {/* Main Interactive Card */}
            <div className="relative bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl text-slate-100 overflow-hidden backdrop-blur-xl">
              {/* Card Topbar */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs font-semibold text-slate-400 ml-2 font-mono">live.infinityroles.cloud</span>
                </div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-bold text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Sync
                </span>
              </div>

              {/* Role Toggle Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl mt-4 border border-slate-800">
                {[
                  { id: 'admin', label: '👑 Admin' },
                  { id: 'supervisor', label: '🛡️ Supervisor' },
                  { id: 'employee', label: '👤 Employee' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Role View Preview */}
              <div className="mt-5 space-y-4">
                {activeTab === 'supervisor' && (
                  <>
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shift Roster Progress</span>
                        <span className="text-xs font-bold text-cyan-400">92% Checked In</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-full rounded-full w-[92%] transition-all duration-500" />
                      </div>
                      <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
                        <span>46 Present</span>
                        <span>4 On Leave</span>
                        <span>0 Unaccounted</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-800/40">
                        <div className="flex items-center gap-2 text-indigo-400 mb-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-[11px] font-bold">Shift Hours</span>
                        </div>
                        <div className="text-lg font-bold text-white font-display">368.5 hrs</div>
                        <span className="text-[10px] text-slate-400">+12% vs last cycle</span>
                      </div>
                      <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40">
                        <div className="flex items-center gap-2 text-cyan-400 mb-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="text-[11px] font-bold">Payroll Batch</span>
                        </div>
                        <div className="text-lg font-bold text-white font-display">Automated</div>
                        <span className="text-[10px] text-emerald-400">Verified & Ready</span>
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'admin' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-xs font-bold text-slate-400 mb-1">Organization Root Control</div>
                      <div className="text-sm font-semibold text-white">4 Active Entities • 1,280 Total Roles</div>
                    </div>
                    <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-800/40 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-purple-400" />
                        <div>
                          <div className="text-xs font-bold text-white">Multi-Tenant RBAC</div>
                          <div className="text-[10px] text-purple-200">Zero privilege escalations</div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-purple-300">Strict</span>
                    </div>
                  </div>
                )}

                {activeTab === 'employee' && (
                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-slate-400">Personal Attendance Record</div>
                        <div className="text-sm font-bold text-white">100% On-Time Streak (14 Days)</div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold">Good Standing</span>
                    </div>
                    <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/40 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Latest Pay Slip</span>
                      <span className="text-xs font-bold text-cyan-300">Download PDF →</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Floating Verified Check-In Pill */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="mt-4 p-3 rounded-xl bg-slate-950/95 border border-indigo-500/30 shadow-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Live Attendance Stamp</div>
                    <div className="text-[10px] text-slate-400">EMP-042 • Live Camera & GPS Verified</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  Just now
                </span>
              </motion.div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

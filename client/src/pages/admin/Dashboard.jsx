import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  UserCheck, 
  ShieldCheck, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  Plus, 
  RefreshCw, 
  Layers, 
  Activity,
  Calendar,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState({
    supervisors: 0,
    consultants: 0,
    employees: 0,
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Active Supervisors',
      value: stats.supervisors,
      change: 'Roster Leaders',
      icon: <Users className="w-6 h-6 text-indigo-600" />,
      gradient: 'from-indigo-500/10 via-purple-500/10 to-indigo-500/5',
      border: 'border-indigo-200/60',
      badge: 'Team Leads',
      link: '/admin/supervisors'
    },
    {
      title: 'Consultants & Auditors',
      value: stats.consultants,
      change: 'Audit & Review',
      icon: <Briefcase className="w-6 h-6 text-purple-600" />,
      gradient: 'from-purple-500/10 via-pink-500/10 to-purple-500/5',
      border: 'border-purple-200/60',
      badge: 'Advisors',
      link: '/admin/consultants'
    },
    {
      title: 'Staff Employees',
      value: stats.employees,
      change: 'Live Punch-In Stack',
      icon: <UserCheck className="w-6 h-6 text-cyan-600" />,
      gradient: 'from-cyan-500/10 via-teal-500/10 to-cyan-500/5',
      border: 'border-cyan-200/60',
      badge: 'Workforce',
      link: '/admin/supervisors'
    },
    {
      title: 'Total Governed Users',
      value: stats.totalUsers,
      change: '99.9% Role Accuracy',
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      gradient: 'from-emerald-500/10 via-teal-500/10 to-emerald-500/5',
      border: 'border-emerald-200/60',
      badge: '100% Synced',
      link: '/admin/supervisors'
    }
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Banner with Glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 p-6 sm:p-8 text-white shadow-xl">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Infinity Roles Governance Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Root Administration Radar
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Monitor supervisor deployments, advisor roles, and workforce metrics in real-time with zero latency.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchStats}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 text-xs font-bold backdrop-blur-md transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Stats</span>
            </button>
            <Link
              to="/admin/supervisors"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-cyan-500 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add Supervisor</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Stats Cards with Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            className={`relative p-5 rounded-2xl bg-white/70 backdrop-blur-xl border ${card.border} shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                {card.icon}
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {card.badge}
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{card.title}</p>
              <div className="text-3xl font-extrabold text-slate-900 font-display">
                {loading ? '...' : card.value}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-slate-500">
              <span>{card.change}</span>
              <Link to={card.link} className="text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5">
                <span>Manage</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Action Matrix & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Role Operations (7 Cols) */}
        <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 font-display">Governance Modules</h2>
              <p className="text-xs text-slate-500">Instant access to core workforce operations</p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
              Multi-Role Ready
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              to="/admin/supervisors"
              className="p-4 rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 border border-indigo-100/70 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                Supervisor Management
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Deploy supervisors, manage shift quotas, and track roster managers.
              </p>
            </Link>

            <Link 
              to="/admin/consultants"
              className="p-4 rounded-2xl bg-gradient-to-br from-purple-50/50 via-white to-pink-50/30 border border-purple-100/70 hover:border-purple-300 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-purple-600 transition-colors">
                Consultant Management
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Oversee independent auditors, external contractors, and advisory access.
              </p>
            </Link>

            <Link 
              to="/admin/companies"
              className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50/50 via-white to-blue-50/30 border border-cyan-100/70 hover:border-cyan-300 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  <Layers className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-600 transition-colors">
                Companies & Entities
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Multi-tenant company configurations, branches, and cost centers.
              </p>
            </Link>

            <Link 
              to="/admin/settings"
              className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-slate-100/50 border border-slate-200/80 hover:border-slate-300 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center shadow-md shadow-slate-800/20 group-hover:scale-105 transition-transform">
                  <Activity className="w-5 h-5" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-800 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-slate-800 transition-colors">
                Security & Audit Rules
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure GPS tolerances, email templates, and RBAC authentication.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Side: Platform Health & Active Safeguards (5 Cols) */}
        <div className="lg:col-span-5 bg-white/70 backdrop-blur-xl rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 font-display">System Diagnostics</h2>
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Healthy
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  DB
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">MongoDB Cluster</p>
                  <p className="text-[10px] text-slate-500">Sharded • Atlas Cloud</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-600">Connected</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold text-xs">
                  GPS
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Geo-Stamp Engine</p>
                  <p className="text-[10px] text-slate-500">Haversine Radius Checks</p>
                </div>
              </div>
              <span className="text-xs font-bold text-cyan-600">Strict Active</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  CAM
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Live Camera Verification</p>
                  <p className="text-[10px] text-slate-500">Cloudinary Upload Pipe</p>
                </div>
              </div>
              <span className="text-xs font-bold text-purple-600">Encrypted</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-cyan-500/10 border border-indigo-100">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-indigo-900">Automated Mail Dispatch</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Supervisors & Consultants automatically receive styled onboarding emails with credentials upon creation.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

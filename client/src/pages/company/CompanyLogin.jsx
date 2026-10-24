import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Building2, Lock, Loader2, LogIn, Eye, EyeOff, ShieldCheck, KeyRound, Sparkles, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import useSEO from '../../hooks/useSEO';
import InfinityLogo from '../../components/InfinityLogo';

const CompanyLogin = () => {
  useSEO({
    title: 'Client Company Portal Login',
    description: 'Infinity Roles Client Company Portal. Access your organization dashboard to inspect workforce rosters, view assigned supervisors, and track wage structures.',
    keywords: 'company portal login, client organization, infinity roles company, workforce roster, supervisor allocation'
  });

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedPass, setCopiedPass] = useState(false);
  const navigate = useNavigate();

  const handleCopyPassword = () => {
    navigator.clipboard.writeText('Company@123');
    setCopiedPass(true);
    setPassword('Company@123');
    setTimeout(() => setCopiedPass(false), 2000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/company/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('companyToken', data.token);
        localStorage.setItem('companyInfo', JSON.stringify(data));
        navigate('/company/dashboard');
      } else {
        setError(data.message || 'Login failed. Please check your credentials or company code.');
      }
    } catch (err) {
      setError('Unable to reach server. Please try again in a few moments.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-24 pb-16 relative overflow-hidden font-sans">
      {/* Liquid Aurora Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/15 blur-3xl animate-liquid-float" />
        <div className="absolute top-1/2 -left-28 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-indigo-400/15 blur-3xl animate-liquid-float-reverse" />
        <div className="absolute -bottom-24 right-1/4 w-96 h-96 rounded-full bg-gradient-to-tl from-indigo-500/15 via-sky-400/15 to-transparent blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Liquid Glass Login Container */}
        <div className="liquid-glass-drawer rounded-3xl p-8 sm:p-9 border border-white/80 shadow-xl shadow-indigo-900/5 relative overflow-hidden backdrop-blur-2xl">
          {/* Subtle Ambient Accent Blob */}
          <div className="absolute -top-20 -right-20 w-44 h-44 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

          <div className="text-center mb-6 relative z-10">
            <Link to="/" className="inline-block mb-3.5 hover:scale-105 transition-transform">
              <InfinityLogo size="lg" />
            </Link>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50/90 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-indigo-200/60 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Client Organization</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Company Portal</h1>
            <p className="text-slate-500 font-medium text-xs mt-1">
              Sign in with your registered company email or company code
            </p>
          </div>

          {/* Credentials Info Helper Card */}
          <div className="mb-6 p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-100/90 shadow-2xs relative z-10">
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-start gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                  <KeyRound className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-indigo-950 block">Organization Access Password</span>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
                    Default password for newly registered companies is:
                  </p>
                  <div className="inline-flex items-center gap-1.5 mt-1">
                    <code className="bg-white px-2 py-0.5 rounded-lg border border-indigo-200 text-indigo-700 font-mono font-bold text-xs tracking-wider shadow-2xs">
                      Company@123
                    </code>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleCopyPassword}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-indigo-50 border border-indigo-200 text-indigo-700 hover:text-indigo-900 font-bold text-[11px] transition-all cursor-pointer shadow-2xs flex-shrink-0"
                title="Fill Company@123 into password field"
              >
                {copiedPass ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-700">Filled!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Auto-Fill</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-5 p-3.5 bg-rose-50/90 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center shadow-xs backdrop-blur-sm"
            >
              <span className="mr-2">⚠️</span>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 relative z-10">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Email or Company Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Building2 className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                  placeholder="e.g. aerospace@zyntra.test or CMP-YZ5432"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/company/forgot-password" className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                  placeholder="Enter company password..."
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-indigo-600/20 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  <span>Sign In to Company Portal</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-white/70 flex items-center justify-between text-xs text-slate-500 relative z-10">
            <span>Admin managed organization</span>
            <Link to="/contact" className="font-semibold text-indigo-600 hover:underline">Support</Link>
          </div>
        </div>

        <div className="text-center mt-5">
          <p className="text-xs text-slate-400 font-medium">The Infinity Roles • Enterprise Security &copy; 2026</p>
        </div>
      </motion.div>
    </div>
  );
};

export default CompanyLogin;

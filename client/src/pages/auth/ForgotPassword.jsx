import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import InfinityLogo from '../../components/InfinityLogo';

const ForgotPassword = ({ role }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/${role}/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('A password reset link has been sent to your email.');
      } else {
        setError(data.message || 'Failed to send reset link');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleTheme = () => {
    switch(role) {
      case 'supervisor': return { bg: 'bg-[#0e3d79]/5', color: 'text-[#0e3d79]', ring: 'focus:ring-[#0e3d79]/20', border: 'focus:border-[#0e3d79]', btn: 'bg-gradient-to-r from-[#0e3d79] to-[#1553a1]' };
      case 'consultant': return { bg: 'bg-teal-500/5', color: 'text-[#0e3d79]', ring: 'focus:ring-[#0e3d79]/20', border: 'focus:border-[#0e3d79]', btn: 'bg-gradient-to-r from-[#0e3d79] to-[#1553a1]' };
      default: return { bg: 'bg-gray-500/5', color: 'text-gray-900', ring: 'focus:ring-gray-500/20', border: 'focus:border-gray-500', btn: 'bg-gray-800' };
    }
  };

  const theme = getRoleTheme();
  const formattedRole = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full ${theme.bg} blur-3xl`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full ${theme.bg} blur-3xl`}></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-white p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block mb-3">
              <InfinityLogo size="lg" />
            </Link>
            <h1 className={`text-3xl font-extrabold ${theme.color} tracking-tight mb-2`}>Forgot Password?</h1>
            <p className="text-gray-500 font-medium text-sm">Enter your email and we'll send you a link to reset your {formattedRole} portal password.</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-100 text-red-600 rounded-2xl text-sm font-semibold flex items-center"
            >
              <span className="mr-2">⚠️</span>
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 bg-green-50/80 backdrop-blur-sm border border-green-100 text-green-700 rounded-2xl text-sm font-semibold flex items-center"
            >
              <span className="mr-2">✅</span>
              {message}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-11 pr-4 py-3 bg-white/50 border border-gray-200/60 rounded-xl text-sm font-medium focus:ring-2 ${theme.ring} ${theme.border} transition-all outline-none`}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || message !== null}
              className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-[#0e3d79]/20 text-sm font-bold text-white ${theme.btn} hover:opacity-90 focus:outline-none transition-all hover:shadow-xl active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Send Reset Link'
              )}
            </button>
            
            <div className="text-center mt-4">
              <Link to={`/${role}/login`} className={`text-sm font-bold ${theme.color} hover:opacity-80 transition-opacity flex items-center justify-center`}>
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
              </Link>
            </div>
          </form>
        </div>
        <div className="text-center mt-6">
           <p className="text-xs text-slate-500 font-medium">The Infinity Roles © 2026. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

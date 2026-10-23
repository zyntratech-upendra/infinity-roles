import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ShieldCheck, User, Users, Briefcase, Sparkles, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InfinityLogo from './InfinityLogo';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Features', path: '/features' },
    { name: 'Contact', path: '/contact' },
  ];

  const portalRoles = [
    {
      title: 'Employee Portal',
      desc: 'Self-service timesheets & pay slips',
      path: '/employee/login',
      icon: <User className="w-4 h-4 text-cyan-500" />,
      badge: 'Staff'
    },
    {
      title: 'Supervisor Portal',
      desc: 'Team attendance & shift rosters',
      path: '/supervisor/login',
      icon: <Users className="w-4 h-4 text-indigo-500" />,
      badge: 'Manage'
    },
    {
      title: 'Consultant Portal',
      desc: 'Client engagements & audit logs',
      path: '/consultant/login',
      icon: <Briefcase className="w-4 h-4 text-purple-500" />,
      badge: 'External'
    },
    {
      title: 'Admin Master Portal',
      desc: 'Platform governance & organization root',
      path: '/admin/login',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-500" />,
      badge: 'Security Root',
      isAdmin: true
    }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5' 
        : 'bg-white/50 backdrop-blur-sm py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center relative">
          
          {/* Logo - Left */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <InfinityLogo size="md" />
            </Link>
          </div>
          
          {/* Navlinks - Middle */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 shadow-inner">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'text-white shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="navPill"
                      className="absolute inset-0 bg-indigo-600 rounded-full shadow-sm"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Action & Mobile Toggle - Right */}
          <div className="flex items-center space-x-3">
            {/* Roles Dropdown */}
            <div className="relative group hidden md:inline-block">
              <button 
                id="portal-login-dropdown-btn"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-all shadow-sm active:translate-y-0"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Access Portals</span>
                <ChevronDown className="w-4 h-4 ml-0.5 transition-transform group-hover:rotate-180" />
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 pt-2 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 overflow-hidden ring-1 ring-black/5">
                  <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                    Select Your Role Portal
                  </div>
                  
                  <div className="mt-1 space-y-1">
                    {portalRoles.map((role) => (
                      <Link 
                        key={role.title} 
                        to={role.path} 
                        className={`group/item flex items-center justify-between p-2.5 rounded-xl transition-all ${
                          role.isAdmin 
                            ? 'bg-slate-900 text-white hover:bg-slate-800 mt-2 shadow-sm' 
                            : 'hover:bg-indigo-50/70 text-slate-700 hover:text-indigo-900'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${role.isAdmin ? 'bg-white/10' : 'bg-slate-100 group-hover/item:bg-white'} transition-colors`}>
                            {role.icon}
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-snug">{role.title}</div>
                            <div className={`text-[10px] ${role.isAdmin ? 'text-slate-300' : 'text-slate-400'}`}>{role.desc}</div>
                          </div>
                        </div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          role.isAdmin 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-slate-100 group-hover/item:bg-indigo-100 text-slate-600 group-hover/item:text-indigo-700'
                        }`}>
                          {role.badge}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Mobile Menu Trigger */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-slate-200 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl"
          >
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-base font-semibold ${
                    location.pathname === link.path 
                      ? 'bg-indigo-50 text-indigo-600 font-bold' 
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 pt-3">
              <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Role Portals</p>
              <div className="grid grid-cols-2 gap-2">
                {portalRoles.map((role) => (
                  <Link
                    key={role.title}
                    to={role.path}
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-100 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {role.icon}
                      <span className="text-xs font-bold text-slate-800 truncate">{role.title.replace(' Portal', '')}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 truncate">{role.badge}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

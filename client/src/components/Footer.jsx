import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Heart, Sparkles, ArrowUpRight } from 'lucide-react';
import InfinityLogo from './InfinityLogo';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 pt-16 pb-12 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
          
          {/* Brand Info (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block mb-2 bg-white/95 px-4 py-2.5 rounded-2xl shadow-sm hover:bg-white hover:scale-105 transition-all">
              <InfinityLogo size="md" />
            </Link>
            
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
              The enterprise standard in role-based workforce orchestration. Unifying clock-ins, biometric verifications, automated payroll, and multi-tenant hierarchies in real time.
            </p>
            
            <div className="pt-2 flex flex-col space-y-2 text-xs text-slate-400">
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>support@infinityroles.com</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>+1 (800) 890-ROLES</span>
              </div>
            </div>

            {/* Cloud Status Pill */}
            <div className="pt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-semibold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Infinity Roles Cloud: 99.98% Operational</span>
            </div>
          </div>
          
          {/* Role Portals */}
          <div>
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-4 text-indigo-300">
              Role Portals
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li>
                <Link to="/employee/login" className="hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span>Employee Portal</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/supervisor/login" className="hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span>Supervisor Portal</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/consultant/login" className="hover:text-cyan-400 transition-colors flex items-center justify-between group">
                  <span>Consultant Portal</span>
                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center justify-between group font-semibold">
                  <span>Admin Master Portal</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Capabilities */}
          <div>
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-4 text-indigo-300">
              Platform
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Role Matrix</Link></li>
              <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Geo Attendance</Link></li>
              <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Payroll Engine</Link></li>
              <li><Link to="/features" className="hover:text-indigo-400 transition-colors">Audit & Compliance</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-white font-display font-bold text-sm tracking-wider uppercase mb-4 text-indigo-300">
              Company
            </h3>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/about" className="hover:text-indigo-400 transition-colors">About Infinity Roles</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-400 transition-colors">Contact Support</Link></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Security Architecture</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Shield</a></li>
            </ul>
          </div>

        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Infinity Roles Inc. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Security Audit</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

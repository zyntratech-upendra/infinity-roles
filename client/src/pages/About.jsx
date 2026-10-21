import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, Target, Shield, Clock, TrendingUp, CheckCircle2, Sparkles, Layers } from 'lucide-react';
import useSEO from '../hooks/useSEO';

const About = () => {
  useSEO({
    title: 'About Infinity Roles - Workforce Intelligence',
    description: 'Discover the vision behind Infinity Roles. We are transforming role orchestration, automated attendance tracking, and enterprise payroll for modern businesses.',
    keywords: 'about infinity roles, workforce intelligence, role management system, enterprise hr platform'
  });

  const pillars = [
    { title: 'Zero Friction', desc: 'No complex training needed. Intuitive role-based views let everyone work instantly.' },
    { title: 'Absolute Transparency', desc: 'Real-time GPS timestamps and photo verifications eliminate dispute and manual audits.' },
    { title: 'Limitless Scale', desc: 'From 10 employees to 10,000 multi-branch teams, our architecture never slows down.' },
  ];

  return (
    <div className="min-h-screen pt-32 pb-24 bg-slate-50 selection:bg-indigo-500 selection:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold text-indigo-700 uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Our Core Vision
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight font-display mb-6">
            Architecting the Future of <span className="text-gradient">Role Intelligence</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Infinity Roles was created with a clear mission: remove the friction between corporate administration, supervisor management, and frontline employee dignity.
          </p>
        </motion.div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-card space-y-6"
          >
            <div>
              <div className="inline-flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Target className="w-4 h-4" /> The Mission
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-display mb-3">
                Unifying All Organizational Stakeholders
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Traditional HR systems are fragmented, clunky, and distrustful. Infinity Roles bridges the gap with verified GPS clock-ins, live photo validation, and automatic payroll pipelines that empower everyone from the entry-level staff to executive directors.
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <div className="inline-flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase tracking-wider mb-2">
                <Layers className="w-4 h-4" /> The Vision
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 font-display mb-3">
                Limitless Possibilities for Every Role
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                By turning role hierarchy into an agile, data-backed operational system, we enable modern enterprises to adapt dynamically and scale infinitely.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex items-end p-8">
              <div className="text-white">
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Built for High-Trust Teams</span>
                <h3 className="text-xl font-bold font-display mt-1">Transforming Organizations Globally</h3>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar, i) => (
            <div key={i} className="bg-white p-7 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold font-display mb-4">
                0{i + 1}
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display mb-2">{pillar.title}</h3>
              <p className="text-slate-600 text-xs leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default About;

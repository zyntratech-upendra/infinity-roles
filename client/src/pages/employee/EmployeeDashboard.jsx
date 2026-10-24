import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Phone, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Calendar, 
  Loader2, 
  Award, 
  Mail, 
  ExternalLink,
  Building2,
  DollarSign,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const token = localStorage.getItem('employeeToken')?.replace(/^"|"$/g, '');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${import.meta.env.VITE_API_URL}/employee/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setEmployee(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-rose-50 text-rose-700 p-6 rounded-3xl border border-rose-100 text-center font-semibold text-xs">
        {error}. Please try logging in again.
      </div>
    );
  }

  const skill = employee.skillLevel || (employee.skillType === 'Skilled' ? 'Skilled' : 'Unskilled');
  const wages = employee.wageParticulars || {};

  return (
    <div className="space-y-6 max-w-6xl mx-auto w-full pb-16 font-sans">
      
      {/* Header Profile Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8">
          {/* Profile Picture */}
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl overflow-hidden border-4 border-white shadow-md bg-slate-100 flex-shrink-0 flex items-center justify-center">
            {employee.profilePhotoUrl ? (
              <img src={employee.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-slate-300" />
            )}
          </div>
          
          {/* Main Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{employee.name}</h1>
                <p className="text-xs font-mono text-indigo-600 font-bold mt-0.5">Worker ID: {employee.employeeId}</p>
              </div>

              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {skill} Tier
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Active Workforce
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 font-medium bg-slate-50/60 p-3.5 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400" /> {employee.email}</div>
              <div className="flex items-center gap-2"><Phone size={14} className="text-slate-400" /> {employee.phoneNumber || 'Not provided'}</div>
              <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400" /> DOB: {employee.dob ? new Date(employee.dob).toLocaleDateString() : 'N/A'}</div>
              <div className="flex items-center gap-2"><MapPin size={14} className="text-slate-400" /> {employee.address || 'Address N/A'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Remuneration Breakdown & Company Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Allotted Remuneration Breakdown Card */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">Allotted Salary Particulars</h3>
                  <p className="text-[11px] text-slate-400">Allotted as per company appointment agreement</p>
                </div>
              </div>

              <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                26 Days Basis
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Basic Daily Wage</span>
                <p className="text-base font-black text-slate-900 mt-0.5">₹{wages.basicWage || 0}</p>
                <span className="text-[10px] text-slate-400 font-mono">₹{((wages.basicWage || 0) * 26).toLocaleString('en-IN')}/mo</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HRA & Allowances</span>
                <p className="text-base font-black text-slate-900 mt-0.5">₹{wages.hraDa || 0}</p>
                <span className="text-[10px] text-slate-400 font-mono">₹{((wages.hraDa || 0) * 26).toLocaleString('en-IN')}/mo</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overtime Rate</span>
                <p className="text-base font-black text-indigo-700 mt-0.5">₹{wages.overtimeRatePerHour || 0}/hr</p>
                <span className="text-[10px] text-slate-400">Standard multiplier</span>
              </div>

              <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-2xl shadow-sm">
                <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">Monthly Gross</span>
                <p className="text-lg font-black mt-0.5 font-mono">₹{Number(wages.monthlyWage || 0).toLocaleString('en-IN')}</p>
                <span className="text-[9px] text-indigo-100">Disbursed monthly</span>
              </div>
            </div>
          </motion.div>

          {/* Education & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-indigo-600 mb-2">
                <GraduationCap size={18} />
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Education</h4>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Highest Qualification</span>
                <p className="text-xs font-bold text-slate-800">{employee.qualifications || 'N/A'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Institution</span>
                <p className="text-xs font-bold text-slate-800">{employee.institutions || 'N/A'}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-3">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Briefcase size={18} />
                <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Experience</h4>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Experience Years</span>
                <p className="text-xs font-bold text-slate-800">{employee.experienceYears ? `${employee.experienceYears} Years` : 'Fresher'}</p>
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Previous Salary</span>
                <p className="text-xs font-bold text-slate-800">{employee.previousSalary ? `₹${employee.previousSalary}` : 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Company & Documents */}
        <div className="space-y-6">
          
          {/* Assigned Corporate Company Card */}
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Building2 size={20} />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Assigned Enterprise</span>
                <h4 className="font-extrabold text-slate-900 text-sm">{employee.companyId?.companyName || 'Corporate Client'}</h4>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Company Code:</span>
                <span className="font-mono font-bold text-indigo-700">{employee.companyCode || employee.companyId?.companyCode || 'N/A'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Supervisor Lead:</span>
                <span className="font-bold text-slate-800">{employee.supervisorId?.name || 'Assigned Lead'}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Lead Contact:</span>
                <span className="text-slate-700">{employee.supervisorId?.phoneNumber || employee.supervisorId?.email || 'Active'}</span>
              </div>
            </div>
          </motion.div>

          {/* Cloudinary Verified Proofs */}
          <motion.div initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText size={18} className="text-teal-600" />
              <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Identity Proofs (Cloudinary)</h4>
            </div>

            <div className="space-y-2.5">
              {employee.aadhaarUrl ? (
                <a 
                  href={employee.aadhaarUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 text-xs font-bold text-slate-800 hover:text-indigo-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-indigo-600" />
                    <span>Aadhaar Card Proof</span>
                  </span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-400 text-center">Aadhaar card not uploaded</div>
              )}

              {employee.panUrl ? (
                <a 
                  href={employee.panUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50 border border-slate-200/70 hover:border-indigo-200 text-xs font-bold text-slate-800 hover:text-indigo-700 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <FileText size={16} className="text-indigo-600" />
                    <span>PAN Card Proof</span>
                  </span>
                  <ExternalLink size={14} />
                </a>
              ) : (
                <div className="p-3 bg-slate-50 rounded-2xl text-[11px] text-slate-400 text-center">PAN card not uploaded</div>
              )}
            </div>
          </motion.div>

        </div>
      </div>

    </div>
  );
};

export default EmployeeDashboard;

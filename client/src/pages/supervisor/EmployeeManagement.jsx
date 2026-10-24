import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  X, 
  Loader2, 
  Briefcase, 
  Mail, 
  Phone, 
  MapPin, 
  FileText, 
  Eye, 
  ExternalLink,
  Award,
  DollarSign
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillFilter, setSkillFilter] = useState('All');
  
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const navigate = useNavigate();
  
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('supervisorToken')?.replace(/^"|"$/g, '');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/supervisor/employees`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch workforce data');
      const data = await response.json();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!currentEmployee) return;
    setActionLoading(true);
    const token = localStorage.getItem('supervisorToken')?.replace(/^"|"$/g, '');
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/supervisor/employees/${currentEmployee._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to remove worker');

      setEmployees(prev => prev.filter(e => e._id !== currentEmployee._id));
      setIsDeleteModalOpen(false);
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase());

    const empSkill = emp.skillLevel || (emp.skillType === 'Skilled' ? 'Skilled' : 'Unskilled');
    const matchesSkill = skillFilter === 'All' || empSkill === skillFilter;

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Workforce Roster & Salary Allotments
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm">
            View and manage workers enrolled under your assigned company code.
          </p>
        </div>
        <button 
          onClick={() => navigate('/supervisor/employees/add')}
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
        >
          <Plus size={16} />
          <span>Register New Worker</span>
        </button>
      </div>

      {/* Filter and Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        
        {/* Search & Skill Tier Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by worker name, ID or email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Skill Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'Unskilled', 'Skilled', 'Highly Skilled', 'Super Skilled'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSkillFilter(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  skillFilter === lvl 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Table Body */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-xs text-slate-400 font-bold">Loading workforce records...</p>
          </div>
        ) : error ? (
          <div className="text-center text-rose-600 py-8 font-medium bg-rose-50 rounded-2xl border border-rose-100 text-xs">
            {error}
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No workforce matches found</p>
            <p className="text-xs text-slate-400 mt-0.5">Try clearing filters or enroll a new worker.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-slate-600 font-bold border-b border-slate-200/80">
                  <th className="py-3 px-4">Worker Profile</th>
                  <th className="py-3 px-4">Company Code</th>
                  <th className="py-3 px-4">Skill Level Tier</th>
                  <th className="py-3 px-4">Wage Structure</th>
                  <th className="py-3 px-4">Cloudinary Docs</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredEmployees.map((emp) => {
                  const skill = emp.skillLevel || (emp.skillType === 'Skilled' ? 'Skilled' : 'Unskilled');
                  const basicWage = emp.wageParticulars?.basicWage || 0;
                  const monthlyWage = emp.wageParticulars?.monthlyWage || 0;

                  return (
                    <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-2xl bg-indigo-50 border border-indigo-100 overflow-hidden flex items-center justify-center text-indigo-700 font-bold text-xs flex-shrink-0">
                            {emp.profilePhotoUrl ? (
                              <img src={emp.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              emp.name.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-900">{emp.name}</p>
                            <span className="font-mono text-[10px] text-indigo-600 font-semibold">{emp.employeeId}</span>
                            <span className="text-[10px] text-slate-400 block">{emp.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        <span className="bg-slate-100 px-2 py-0.5 rounded-md text-[10px]">
                          {emp.companyCode || 'ASSIGNED'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          skill === 'Unskilled' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          skill === 'Skilled' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                          skill === 'Highly Skilled' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          <Award className="w-3 h-3" />
                          <span>{skill}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-mono font-extrabold text-emerald-700 text-xs">
                          ₹{monthlyWage ? monthlyWage.toLocaleString('en-IN') : 'N/A'}/mo
                        </span>
                        <span className="block text-[10px] text-slate-400 font-mono">
                          ₹{basicWage}/day Basic
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          {emp.aadhaarUrl ? (
                            <a 
                              href={emp.aadhaarUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 text-indigo-600 font-bold text-[10px] flex items-center gap-0.5"
                            >
                              <FileText className="w-3 h-3" /> Aadhaar
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-300">No Aadhaar</span>
                          )}

                          {emp.panUrl && (
                            <a 
                              href={emp.panUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 text-indigo-600 font-bold text-[10px] flex items-center gap-0.5"
                            >
                              <FileText className="w-3 h-3" /> PAN
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setCurrentEmployee(emp); setIsDetailModalOpen(true); }}
                            className="p-1.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors"
                            title="View Full Profile"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => { setCurrentEmployee(emp); setIsDeleteModalOpen(true); }}
                            className="p-1.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition-colors"
                            title="Delete Worker"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {isDetailModalOpen && currentEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDetailModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center">
                    {currentEmployee.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{currentEmployee.name}</h3>
                    <p className="text-xs text-slate-500 font-mono">{currentEmployee.employeeId} • {currentEmployee.companyCode || 'Company'}</p>
                  </div>
                </div>
                <button onClick={() => setIsDetailModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
                  <X size={20} />
                </button>
              </div>

              {/* Wage particulars card */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 space-y-2">
                <span className="text-[11px] font-extrabold text-indigo-900 uppercase tracking-wider block">Allotted Remuneration Breakdown</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500">Skill Level:</span>
                    <span className="font-bold text-slate-900 ml-1">{currentEmployee.skillLevel || 'Skilled'}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Basic Daily:</span>
                    <span className="font-bold text-slate-900 ml-1">₹{currentEmployee.wageParticulars?.basicWage || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">HRA & DA:</span>
                    <span className="font-bold text-slate-900 ml-1">₹{currentEmployee.wageParticulars?.hraDa || 0}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Overtime Rate:</span>
                    <span className="font-bold text-slate-900 ml-1">₹{currentEmployee.wageParticulars?.overtimeRatePerHour || 0}/hr</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-indigo-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-600">Calculated Monthly Wage:</span>
                    <span className="text-base font-extrabold text-emerald-700 font-mono">
                      ₹{currentEmployee.wageParticulars?.monthlyWage?.toLocaleString('en-IN') || 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Verified Cloudinary Proofs */}
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">Cloudinary Verified Documents</span>
                <div className="flex gap-3">
                  {currentEmployee.aadhaarUrl && (
                    <a href={currentEmployee.aadhaarUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border hover:bg-indigo-50 text-indigo-600 text-xs font-bold">
                      <FileText size={14} /> Aadhaar Proof <ExternalLink size={12} />
                    </a>
                  )}
                  {currentEmployee.panUrl && (
                    <a href={currentEmployee.panUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border hover:bg-indigo-50 text-indigo-600 text-xs font-bold">
                      <FileText size={14} /> PAN Proof <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => setIsDetailModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && currentEmployee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsDeleteModalOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl p-6 z-10 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
                <Trash2 size={24} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Remove Worker?</h3>
              <p className="text-xs text-slate-500">
                Are you sure you want to remove <strong>{currentEmployee.name}</strong> ({currentEmployee.employeeId}) from this company roster?
              </p>
              <div className="flex gap-2 justify-center pt-2">
                <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={actionLoading} className="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs shadow-md">
                  {actionLoading ? 'Removing...' : 'Confirm Remove'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default EmployeeManagement;

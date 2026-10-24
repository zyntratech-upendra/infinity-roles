import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  Users, Search, Filter, FileText, ExternalLink, Shield, 
  Calendar, Phone, Mail, Award, X, Eye, CheckCircle2, DollarSign 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CompanyWorkforce = () => {
  const { company } = useOutletContext();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [activeWorker, setActiveWorker] = useState(null);

  useEffect(() => {
    const fetchWorkforce = async () => {
      const token = localStorage.getItem('companyToken');
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/company/workforce`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setWorkers(data);
        }
      } catch (err) {
        console.error('Error fetching workforce', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkforce();
  }, []);

  const tiers = ['ALL', 'Unskilled', 'Skilled', 'Highly Skilled', 'Super Skilled'];

  const filteredWorkers = workers.filter((w) => {
    const matchesSearch = 
      (w.name && w.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (w.employeeId && w.employeeId.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (w.phoneNumber && w.phoneNumber.includes(searchTerm));
    
    const matchesTier = selectedTier === 'ALL' || w.skillLevel === selectedTier;
    return matchesSearch && matchesTier;
  });

  const getTierBadge = (level) => {
    switch (level) {
      case 'Unskilled':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Skilled':
        return 'bg-sky-50 text-sky-700 border-sky-200';
      case 'Highly Skilled':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Super Skilled':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-purple-50 text-purple-700 border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Workforce Roster</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Complete registry of workers enrolled under company code <span className="font-mono font-bold text-indigo-600">{company?.companyCode}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            Total: <span className="text-indigo-600 font-black">{filteredWorkers.length}</span> of {workers.length}
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by worker name, employee ID, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none transition-all"
          />
        </div>

        {/* Tier Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:inline-block" />
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedTier === tier
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Workforce Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
        {loading ? (
          <div className="text-center py-16 text-xs text-slate-500 font-medium">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            Loading workforce roster...
          </div>
        ) : filteredWorkers.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">No workforce records found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchTerm || selectedTier !== 'ALL'
                ? 'Try adjusting your search criteria or tier filters.'
                : `Supervisors have not yet registered employees under company code ${company?.companyCode}.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Worker Details</th>
                  <th className="py-3.5 px-6">Skill Tier</th>
                  <th className="py-3.5 px-6">Wage Particulars</th>
                  <th className="py-3.5 px-6">26-Day Gross</th>
                  <th className="py-3.5 px-6">Supervisor</th>
                  <th className="py-3.5 px-6">Joined</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredWorkers.map((worker) => {
                  const particulars = worker.wageParticulars || {};
                  const gross = particulars.monthlyGross || worker.salary || 0;

                  return (
                    <tr key={worker._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {worker.profilePicture ? (
                            <img
                              src={worker.profilePicture}
                              alt={worker.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-700 font-black flex items-center justify-center text-xs">
                              {worker.name ? worker.name.substring(0, 2).toUpperCase() : 'WO'}
                            </div>
                          )}
                          <div>
                            <div className="font-extrabold text-slate-900">{worker.name}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              ID: {worker.employeeId || 'Pending'}
                            </div>
                            {worker.phoneNumber && (
                              <div className="text-[10px] text-slate-500 font-mono">{worker.phoneNumber}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full border ${getTierBadge(worker.skillLevel)}`}>
                          {worker.skillLevel || 'Skilled'}
                        </span>
                      </td>

                      <td className="py-4 px-6 font-mono text-[11px] text-slate-600">
                        <div>Basic: ₹{particulars.dailyWage || 0}/day</div>
                        <div className="text-[10px] text-slate-400">
                          HRA: ₹{particulars.hraDa || 0} • OT: ₹{particulars.otRate || 0}/hr
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <span className="font-mono font-black text-slate-900 text-sm">
                          ₹{Number(gross).toLocaleString()}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="text-slate-800 font-bold">
                          {worker.supervisorId?.name || 'Assigned Supervisor'}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {worker.supervisorId?.supervisorId || worker.supervisorId?.email || ''}
                        </div>
                      </td>

                      <td className="py-4 px-6 text-slate-500 text-[11px]">
                        {new Date(worker.createdAt).toLocaleDateString()}
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => setActiveWorker(worker)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold text-xs transition-colors border border-slate-200"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Worker Detail Inspection Modal */}
      <AnimatePresence>
        {activeWorker && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setActiveWorker(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Worker Profile & Wage Audit</h3>
                    <p className="text-xs text-slate-500 font-mono">Company Code: {company?.companyCode}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveWorker(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Worker Identity Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {activeWorker.profilePicture ? (
                    <img
                      src={activeWorker.profilePicture}
                      alt={activeWorker.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-xs"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-xs">
                      {activeWorker.name ? activeWorker.name.substring(0, 2).toUpperCase() : 'WO'}
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-black text-slate-900">{activeWorker.name}</h4>
                    <p className="text-xs text-slate-500 font-mono">ID: {activeWorker.employeeId || 'Pending'}</p>
                    <p className="text-xs text-slate-500">{activeWorker.email || activeWorker.phoneNumber || 'No contact email'}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${getTierBadge(activeWorker.skillLevel)}`}>
                  {activeWorker.skillLevel || 'Skilled'}
                </span>
              </div>

              {/* Wage Particulars Grid */}
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Allotted Salary Particulars (Skill Tier Breakdown)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Daily Basic</div>
                    <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                      ₹{activeWorker.wageParticulars?.dailyWage || 0}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">HRA / DA</div>
                    <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                      ₹{activeWorker.wageParticulars?.hraDa || 0}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">OT Hourly Rate</div>
                    <div className="text-base font-black text-slate-900 font-mono mt-0.5">
                      ₹{activeWorker.wageParticulars?.otRate || 0}/hr
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl border border-indigo-200 bg-indigo-50/60">
                    <div className="text-[10px] text-indigo-600 uppercase font-bold">26-Day Gross</div>
                    <div className="text-base font-black text-indigo-700 font-mono mt-0.5">
                      ₹{(activeWorker.wageParticulars?.monthlyGross || activeWorker.salary || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Cloudinary Documents / Proofs */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Digital Documents & Cloudinary Proofs
                </h4>
                <div className="space-y-2">
                  {activeWorker.documents?.length > 0 ? (
                    activeWorker.documents.map((doc, dIdx) => (
                      <div key={dIdx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-indigo-600" />
                          <span className="text-xs font-bold text-slate-800">{doc.title || `Document #${dIdx + 1}`}</span>
                        </div>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          <span>Open File</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    ))
                  ) : activeWorker.appointmentLetterUrl ? (
                    <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-slate-800">Generated Appointment Letter</span>
                      </div>
                      <a
                        href={activeWorker.appointmentLetterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                      >
                        <span>Download PDF</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                      No uploaded Cloudinary identification documents for this worker.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setActiveWorker(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition"
                >
                  Close Inspection
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CompanyWorkforce;

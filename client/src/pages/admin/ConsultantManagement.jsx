import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Loader2, X, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConsultantManagement = () => {
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/consultants`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setConsultants(data);
      }
    } catch (err) {
      console.error('Error fetching consultants', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError(null);
    try {
      const token = localStorage.getItem('adminToken');
      const url = editingId 
        ? `${import.meta.env.VITE_API_URL}/admin/consultants/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/consultants`;
      const method = editingId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (editingId) {
          setConsultants(consultants.map(c => c._id === editingId ? data : c));
        } else {
          setConsultants([...consultants, data]);
        }
        setIsModalOpen(false);
        setFormData({ name: '', email: '', phoneNumber: '', address: '' });
        setEditingId(null);
      } else {
        setError(data.message || `Failed to ${editingId ? 'update' : 'create'} consultant`);
      }
    } catch (err) {
      setError(`An error occurred while ${editingId ? 'updating' : 'creating'} consultant`);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (consultant) => {
    setEditingId(consultant._id);
    setFormData({
      name: consultant.name,
      email: consultant.email,
      phoneNumber: consultant.phoneNumber || '',
      address: consultant.address || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this consultant?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/consultants/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setConsultants(consultants.filter(c => c._id !== id));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete consultant');
      }
    } catch (err) {
      console.error('Error deleting consultant', err);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold mb-2">
            <span>Audit & Advisory Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Consultant Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-xs sm:text-sm">
            Deploy independent advisors, external contractors, and project milestone auditors.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', email: '', phoneNumber: '', address: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} />
          <span>Add Consultant</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            <span className="text-xs font-semibold">Loading consultants...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/70 text-slate-500 text-[11px] uppercase tracking-wider font-extrabold">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {consultants.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 mb-1">
                          <Plus size={24} />
                        </div>
                        <p className="font-bold text-slate-700 text-sm">No consultants deployed yet</p>
                        <p className="text-xs text-slate-400">Click "Add Consultant" to provision advisory credentials and dispatch email.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  consultants.map((consultant) => (
                    <tr key={consultant._id} className="hover:bg-purple-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 text-[11px]">
                          {consultant.consultantId || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {consultant.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-slate-400" />
                          <span>{consultant.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {consultant.phoneNumber || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-100">
                          {consultant.role || 'Consultant'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(consultant)} 
                            className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                            title="Edit Consultant"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(consultant._id)} 
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Consultant"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Slide-over Panel with Liquid Glassmorphism */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Liquid Glass Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />

            {/* Slide-over Right Drawer Container */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10 pointer-events-none z-10">
              <motion.div
                initial={{ x: '100%', opacity: 0.7 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className="w-screen max-w-md sm:max-w-lg pointer-events-auto h-full flex flex-col relative overflow-hidden liquid-glass-drawer text-slate-800"
              >
                {/* Liquid Aurora Background Lights */}
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-purple-500/20 via-indigo-500/15 to-pink-500/15 blur-3xl pointer-events-none animate-liquid-float" />
                <div className="absolute top-1/2 -left-28 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-purple-400/15 blur-3xl pointer-events-none animate-liquid-float-reverse" />

                {/* Top Header */}
                <div className="relative z-20 px-6 py-5 bg-white/60 backdrop-blur-xl border-b border-white/70 flex items-center justify-between shadow-xs">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase tracking-wider border border-purple-200/60 shadow-2xs mb-1.5">
                      <span>Consultant Provisioning</span>
                    </div>
                    <h2 className="text-xl font-extrabold text-slate-900 font-display">
                      {editingId ? 'Edit Consultant' : 'Add New Consultant'}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {editingId ? 'Update consultant profile and contact records.' : 'They will receive an automated invitation email with credentials.'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white/80 rounded-full transition-colors cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col justify-between overflow-y-auto relative z-10">
                  <div>
                    {error && (
                      <div className="mb-5 p-3.5 bg-rose-50/90 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold backdrop-blur-sm shadow-xs">
                        {error}
                      </div>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Consultant Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                          placeholder="Dr. Sarah Connor"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                          placeholder="consultant@domain.com"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Engagement / Practice Address
                        </label>
                        <textarea
                          rows={3}
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none resize-none"
                          placeholder="Enter engagement office or agency address..."
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/70 flex items-center justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2.5 rounded-xl border border-white/80 bg-white/60 hover:bg-white text-slate-600 hover:text-slate-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={creating}
                      className="flex items-center justify-center bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-700 hover:from-purple-700 hover:to-indigo-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-600/25 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        editingId ? 'Update Consultant' : 'Create Consultant'
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ConsultantManagement;

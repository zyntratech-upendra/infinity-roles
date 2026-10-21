import React, { useState, useEffect } from 'react';
import { Plus, Search, Mail, Loader2, X, Trash2, Edit } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SupervisorManagement = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phoneNumber: '', address: '' });
  const [editingId, setEditingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/supervisors`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setSupervisors(data);
      }
    } catch (err) {
      console.error('Error fetching supervisors', err);
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
        ? `${import.meta.env.VITE_API_URL}/admin/supervisors/${editingId}`
        : `${import.meta.env.VITE_API_URL}/admin/supervisors`;
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
          setSupervisors(supervisors.map(s => s._id === editingId ? data : s));
        } else {
          setSupervisors([...supervisors, data]);
        }
        setIsModalOpen(false);
        setFormData({ name: '', email: '', phoneNumber: '', address: '' });
        setEditingId(null);
      } else {
        setError(data.message || `Failed to ${editingId ? 'update' : 'create'} supervisor`);
      }
    } catch (err) {
      setError(`An error occurred while ${editingId ? 'updating' : 'creating'} supervisor`);
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (supervisor) => {
    setEditingId(supervisor._id);
    setFormData({
      name: supervisor.name,
      email: supervisor.email,
      phoneNumber: supervisor.phoneNumber || '',
      address: supervisor.address || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this supervisor?')) return;
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/supervisors/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        setSupervisors(supervisors.filter(s => s._id !== id));
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to delete supervisor');
      }
    } catch (err) {
      console.error('Error deleting supervisor', err);
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
            <span>Shift & Team Orchestration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display">
            Supervisor Management
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-xs sm:text-sm">
            Deploy supervisors, manage shift rosters, and assign team privileges.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormData({ name: '', email: '', phoneNumber: '', address: '' });
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} />
          <span>Add Supervisor</span>
        </button>
      </div>

      {/* Table Section */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/80 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="text-xs font-semibold">Loading supervisors...</span>
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
                {supervisors.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500 mb-1">
                          <Plus size={24} />
                        </div>
                        <p className="font-bold text-slate-700 text-sm">No supervisors deployed yet</p>
                        <p className="text-xs text-slate-400">Click "Add Supervisor" to provision credentials and dispatch onboarding email.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  supervisors.map((supervisor) => (
                    <tr key={supervisor._id} className="hover:bg-indigo-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 text-[11px]">
                          {supervisor.supervisorId || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {supervisor.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-2">
                          <Mail size={13} className="text-slate-400" />
                          <span>{supervisor.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {supervisor.phoneNumber || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {supervisor.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button 
                            onClick={() => handleEdit(supervisor)} 
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                            title="Edit Supervisor"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(supervisor._id)} 
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Supervisor"
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

      {/* Create / Edit Slide-over Panel with Glassmorphism */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 240 }}
              className="bg-white/85 backdrop-blur-3xl border-l border-white/70 shadow-[0_20px_50px_rgba(79,70,229,0.15)] w-full max-w-lg h-full relative z-10 overflow-y-auto flex flex-col"
            >
              {/* Top Decorative Ambient Glow in Card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-indigo-500/15 via-purple-500/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

              <div className="p-6 border-b border-slate-200/60 flex justify-between items-start bg-gradient-to-r from-white/90 via-indigo-50/30 to-purple-50/20 backdrop-blur-md">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider border border-indigo-100 mb-2">
                    <span>Supervisor Provisioning</span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-900 font-display">
                    {editingId ? 'Edit Supervisor' : 'Add New Supervisor'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {editingId ? 'Update supervisor credentials and contact details.' : 'They will receive an automated email with system login credentials.'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  {error && (
                    <div className="mb-5 p-3.5 bg-rose-50/80 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold backdrop-blur-sm">
                      {error}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none transition-all text-sm font-medium shadow-sm placeholder:text-slate-400"
                        placeholder="John Doe"
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
                        className="w-full px-4 py-2.5 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none transition-all text-sm font-medium shadow-sm placeholder:text-slate-400"
                        placeholder="supervisor@domain.com"
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
                        className="w-full px-4 py-2.5 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none transition-all text-sm font-medium shadow-sm placeholder:text-slate-400"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Office or Work Location Address
                      </label>
                      <textarea
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/15 focus:border-indigo-500 outline-none transition-all text-sm font-medium resize-none shadow-sm placeholder:text-slate-400"
                        placeholder="Enter location or facility address..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-200/80 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors shadow-sm bg-white/80"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex items-center justify-center bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      editingId ? 'Update Supervisor' : 'Create Supervisor'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SupervisorManagement;

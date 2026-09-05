import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Calendar, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

          <div className="glass-card p-8">
            {/* Avatar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name}</h2>
                <p className="text-slate-400">{user?.email}</p>
                <span className={`badge mt-1 ${user?.role === 'admin' ? 'badge-pending' : 'badge-confirmed'}`}>{user?.role}</span>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-1"><User className="w-4 h-4" /> Full Name</label>
                {editing ? (
                  <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="input-field" />
                ) : (
                  <p className="text-white font-medium py-3 px-4 rounded-xl bg-white/5">{user?.name}</p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-1"><Mail className="w-4 h-4" /> Email</label>
                <p className="text-white font-medium py-3 px-4 rounded-xl bg-white/5">{user?.email}</p>
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-1"><Phone className="w-4 h-4" /> Phone</label>
                {editing ? (
                  <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="input-field" />
                ) : (
                  <p className="text-white font-medium py-3 px-4 rounded-xl bg-white/5">{user?.phone || 'Not set'}</p>
                )}
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm text-slate-400 mb-1"><Calendar className="w-4 h-4" /> Member Since</label>
                <p className="text-white font-medium py-3 px-4 rounded-xl bg-white/5">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              {editing ? (
                <>
                  <button onClick={handleSave} disabled={loading} className="btn-primary disabled:opacity-50">
                    {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save</>}
                  </button>
                  <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                </>
              ) : (
                <button onClick={() => setEditing(true)} className="btn-primary">Edit Profile</button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

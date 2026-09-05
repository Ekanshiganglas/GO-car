import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Save } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function AddEditCar() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [featureInput, setFeatureInput] = useState('');

  const [form, setForm] = useState({
    brand: '', model: '', year: 2024, price_per_day: 50, city: '',
    car_type: 'sedan', seats: 5, fuel_type: 'petrol', transmission: 'automatic',
    image_url: '', description: '', features: [], available: true,
  });

  useEffect(() => {
    if (isEdit) fetchCar();
  }, [id]);

  const fetchCar = async () => {
    try {
      const res = await API.get(`/cars/${id}`);
      setForm({
        brand: res.data.brand, model: res.data.model, year: res.data.year,
        price_per_day: res.data.price_per_day, city: res.data.city,
        car_type: res.data.car_type, seats: res.data.seats, fuel_type: res.data.fuel_type,
        transmission: res.data.transmission, image_url: res.data.image_url || '',
        description: res.data.description || '', features: res.data.features || [],
        available: res.data.available,
      });
    } catch {
      toast.error('Car not found');
      navigate('/admin/cars');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value });
  };

  const addFeature = () => {
    if (featureInput.trim() && !form.features.includes(featureInput.trim())) {
      setForm({ ...form, features: [...form.features, featureInput.trim()] });
      setFeatureInput('');
    }
  };

  const removeFeature = (f) => {
    setForm({ ...form, features: form.features.filter(x => x !== f) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.brand || !form.model || !form.city) return toast.error('Please fill required fields');
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/admin/cars/${id}`, form);
        toast.success('Car updated!');
      } else {
        await API.post('/admin/cars', form);
        toast.success('Car added!');
      }
      navigate('/admin/cars');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to save car');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen pt-20 flex items-center justify-center"><div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6">
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-8">{isEdit ? 'Edit Car' : 'Add New Car'}</h1>

          <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
            {/* Grid fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'brand', label: 'Brand *', type: 'text', placeholder: 'e.g. Toyota' },
                { name: 'model', label: 'Model *', type: 'text', placeholder: 'e.g. Camry' },
                { name: 'year', label: 'Year', type: 'number' },
                { name: 'price_per_day', label: 'Price Per Day ($) *', type: 'number' },
                { name: 'city', label: 'City *', type: 'text', placeholder: 'e.g. Mumbai' },
                { name: 'seats', label: 'Seats', type: 'number' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm text-slate-300 mb-1">{field.label}</label>
                  <input type={field.type} name={field.name} value={form[field.name]} onChange={handleChange} className="input-field" placeholder={field.placeholder} />
                </div>
              ))}
            </div>

            {/* Selects */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Car Type</label>
                <select name="car_type" value={form.car_type} onChange={handleChange} className="input-field">
                  {['sedan', 'suv', 'hatchback', 'luxury', 'convertible', 'minivan'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Fuel Type</label>
                <select name="fuel_type" value={form.fuel_type} onChange={handleChange} className="input-field">
                  {['petrol', 'diesel', 'electric', 'hybrid'].map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-slate-300 mb-1">Transmission</label>
                <select name="transmission" value={form.transmission} onChange={handleChange} className="input-field">
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                </select>
              </div>
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Image URL</label>
              <input type="text" name="image_url" value={form.image_url} onChange={handleChange} className="input-field" placeholder="https://..." />
              {form.image_url && (
                <div className="mt-2 h-32 rounded-xl overflow-hidden bg-white/5">
                  <img src={form.image_url} alt="Preview" className="h-full object-cover" onError={(e) => e.target.style.display='none'} />
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input-field resize-none" placeholder="Describe this car..." />
            </div>

            {/* Features */}
            <div>
              <label className="block text-sm text-slate-300 mb-1">Features</label>
              <div className="flex gap-2 mb-2">
                <input value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())} className="input-field flex-1" placeholder="Add feature..." />
                <button type="button" onClick={addFeature} className="btn-secondary text-sm">Add</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {form.features.map(f => (
                  <span key={f} className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 text-sm">
                    {f} <button type="button" onClick={() => removeFeature(f)} className="text-blue-300 hover:text-white">×</button>
                  </span>
                ))}
              </div>
            </div>

            {/* Available */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" name="available" checked={form.available} onChange={handleChange} className="accent-blue-500 w-5 h-5" />
              <span className="text-slate-300">Available for booking</span>
            </label>

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base disabled:opacity-50">
              {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Save className="w-5 h-5" /> {isEdit ? 'Update Car' : 'Add Car'}</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

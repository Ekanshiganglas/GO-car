import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight } from 'lucide-react';
import API from '../../api/axios';
import toast from 'react-hot-toast';

export default function ManageCars() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      const res = await API.get('/cars?available_only=false&limit=50');
      setCars(res.data.cars || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteCar = async (id) => {
    if (!confirm('Are you sure you want to delete this car?')) return;
    try {
      await API.delete(`/admin/cars/${id}`);
      toast.success('Car deleted');
      fetchCars();
    } catch (err) {
      toast.error('Failed to delete car');
    }
  };

  const toggleAvailability = async (id, current) => {
    try {
      await API.put(`/admin/cars/${id}`, { available: !current });
      toast.success(`Car ${!current ? 'enabled' : 'disabled'}`);
      fetchCars();
    } catch (err) {
      toast.error('Failed to update');
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Manage Cars</h1>
            <p className="text-slate-400">{cars.length} cars listed</p>
          </div>
          <Link to="/admin/cars/new" className="btn-primary"><Plus className="w-5 h-5" /> Add Car</Link>
        </div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 skeleton" />)}</div>
        ) : (
          <div className="glass-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">Car</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">Price/Day</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">City</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">Type</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">Status</th>
                    <th className="text-left py-4 px-4 text-sm font-medium text-slate-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cars.map((car, i) => (
                    <motion.tr
                      key={car.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600/20 to-purple-600/20 flex items-center justify-center text-lg">🚗</div>
                          <div>
                            <p className="font-medium text-white">{car.brand} {car.model}</p>
                            <p className="text-xs text-slate-400">{car.year}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-blue-400 font-semibold">${car.price_per_day}</td>
                      <td className="py-3 px-4 text-slate-300">{car.city}</td>
                      <td className="py-3 px-4 text-slate-300 capitalize">{car.car_type}</td>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleAvailability(car.id, car.available)} className="flex items-center gap-1">
                          {car.available ? (
                            <><ToggleRight className="w-6 h-6 text-emerald-400" /><span className="text-xs text-emerald-400">Active</span></>
                          ) : (
                            <><ToggleLeft className="w-6 h-6 text-slate-500" /><span className="text-xs text-slate-500">Inactive</span></>
                          )}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Link to={`/admin/cars/edit/${car.id}`} className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 transition-colors">
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button onClick={() => deleteCar(car.id)} className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

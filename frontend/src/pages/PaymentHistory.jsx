import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, CheckCircle, XCircle, Clock } from 'lucide-react';
import API from '../api/axios';

export default function PaymentHistory() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const res = await API.get('/payments');
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="w-5 h-5 text-emerald-400" />;
    if (status === 'failed') return <XCircle className="w-5 h-5 text-red-400" />;
    return <Clock className="w-5 h-5 text-amber-400" />;
  };

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white mb-2">Payment History</h1>
          <p className="text-slate-400 mb-8">Track all your transactions</p>
        </motion.div>

        {loading ? (
          <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="h-20 skeleton" />)}</div>
        ) : payments.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-4">💳</div>
            <h3 className="text-xl font-bold text-white mb-2">No Payments Yet</h3>
            <p className="text-slate-400">Payments will appear here after you book a car</p>
          </div>
        ) : (
          <div className="glass-card overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Date</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Transaction ID</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Method</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Amount</th>
                    <th className="text-left py-4 px-6 text-sm font-medium text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map(payment => (
                    <tr key={payment.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="py-4 px-6 text-sm text-slate-300">{new Date(payment.created_at).toLocaleDateString()}</td>
                      <td className="py-4 px-6 text-sm font-mono text-slate-400">{payment.transaction_id}</td>
                      <td className="py-4 px-6 text-sm text-slate-300 capitalize">{payment.method}</td>
                      <td className="py-4 px-6 text-sm font-semibold text-white">${payment.amount}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {statusIcon(payment.status)}
                          <span className={`badge badge-${payment.status === 'completed' ? 'active' : payment.status === 'failed' ? 'canceled' : 'pending'}`}>
                            {payment.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-3">
              {payments.map(payment => (
                <div key={payment.id} className="p-4 rounded-xl bg-white/5">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm text-slate-400">{new Date(payment.created_at).toLocaleDateString()}</span>
                    {statusIcon(payment.status)}
                  </div>
                  <p className="font-mono text-xs text-slate-500 mb-2">{payment.transaction_id}</p>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-300 capitalize">{payment.method}</span>
                    <span className="font-bold text-white">${payment.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

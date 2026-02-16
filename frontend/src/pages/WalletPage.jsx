import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function WalletPage() {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState('');
  const [upi, setUpi] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchWallet = async () => {
    const { data } = await api.get('/wallet.php');
    setWallet(data);
  };

  useEffect(() => {
    fetchWallet();
  }, []);

  const submitWithdrawal = async (event) => {
    event.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const { data } = await api.post('/wallet.php', { amount, upi });
      setMessage(data.message);
      setAmount('');
      setUpi('');
      await fetchWallet();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Withdrawal failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!wallet) {
    return <p className="text-sm text-slate-500">Loading wallet...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="hero-card p-4">
        <p className="text-xs uppercase tracking-wide text-blue-100">Wallet Balance</p>
        <p className="mt-1 text-3xl font-extrabold">{wallet.coinBalance} coins</p>
        <p className="mt-2 text-xs text-blue-50">Minimum withdrawal: {wallet.minWithdrawal} coins</p>
      </div>

      <form onSubmit={submitWithdrawal} className="surface-card p-4">
        <h3 className="text-sm font-bold text-slate-900">Request withdrawal</h3>
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          className="input-field mt-3"
        />
        <input
          value={upi}
          onChange={(e) => setUpi(e.target.value)}
          placeholder="UPI ID / Paytm Number"
          className="input-field mt-3"
        />
        <button type="submit" disabled={loading} className="primary-btn mt-3">
          {loading ? 'Submitting...' : 'Submit Withdrawal'}
        </button>
      </form>

      {message ? <p className="surface-card p-3 text-sm text-slate-700">{message}</p> : null}

      <div className="surface-card p-4">
        <h3 className="text-sm font-bold text-slate-900">Withdrawal history</h3>
        <div className="mt-3 space-y-2">
          {wallet.withdrawals.length === 0 ? (
            <p className="text-xs text-slate-500">No withdrawal requests found.</p>
          ) : (
            wallet.withdrawals.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#f1f6ff] px-3 py-2 text-xs">
                <div>
                  <p className="font-semibold text-slate-800">{item.amount} coins</p>
                  <p className="text-slate-500">{item.upi}</p>
                </div>
                <p className="font-bold capitalize text-[#2858b5]">{item.status}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
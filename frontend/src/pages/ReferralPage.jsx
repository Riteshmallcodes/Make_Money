import { useEffect, useState } from 'react';
import api from '../lib/api';

export default function ReferralPage() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/referral.php');
      setStats(data);
    }

    load();
  }, []);

  const copyCode = async () => {
    if (!stats?.referralCode) {
      return;
    }

    await navigator.clipboard.writeText(stats.referralCode);
    setMessage('Referral code copied.');
  };

  if (!stats) {
    return <p className="text-sm text-slate-500">Loading referral details...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="hero-card p-4">
        <p className="text-xs uppercase tracking-wide text-blue-100">Your Referral Code</p>
        <p className="mt-1 text-3xl font-extrabold tracking-wider">{stats.referralCode}</p>
        <button type="button" onClick={copyCode} className="secondary-btn mt-3 border-white/40 bg-white/15 text-white">
          Copy / Share
        </button>
        {message ? <p className="mt-2 text-xs text-blue-50">{message}</p> : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="surface-card p-4">
          <p className="text-xs text-slate-500">Referred users</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.referredUsers}</p>
        </div>
        <div className="surface-card p-4">
          <p className="text-xs text-slate-500">Total earnings</p>
          <p className="mt-2 text-3xl font-extrabold text-slate-900">{stats.totalReferralEarnings}</p>
        </div>
      </div>
    </div>
  );
}
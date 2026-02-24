import { useEffect, useState } from 'react';
import api from '../lib/api';
import StatCard from '../components/StatCard';
import { getApiErrorMessage, unwrapData } from '../lib/http';

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const fetchDashboard = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/dashboard.php');
      const payload = unwrapData(data) || {};
      setDashboard({
        coinBalance: payload.coinBalance ?? payload.coin_balance ?? 0,
        completedTasks: payload.completedTasks ?? payload.completed_tasks ?? 0,
        referralEarnings: payload.referralEarnings ?? payload.referral_earnings ?? 0,
        dailyCheckInCompleted:
          payload.dailyCheckInCompleted ?? payload.daily_checkin_completed ?? false,
        withdrawalHistory: payload.withdrawalHistory ?? payload.withdrawal_history ?? [],
      });
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError, 'Unable to load dashboard.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const runDailyCheckIn = async () => {
    setMessage('');
    try {
      const { data } = await api.post('/taskpage.php', { action: 'daily_checkin' });
      setMessage(unwrapData(data)?.message || data?.message || 'Check-in completed.');
      await fetchDashboard();
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Daily check-in failed.'));
    }
  };

  if (loading) {
    return <p className="text-sm text-slate-500">Loading dashboard...</p>;
  }

  if (error) {
    return <p className="surface-card p-3 text-sm text-red-600">{error}</p>;
  }

  if (!dashboard) {
    return <p className="surface-card p-3 text-sm text-slate-700">Dashboard data unavailable.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="hero-card p-4">
        <p className="text-xs uppercase tracking-wide text-blue-100">Total Coin Balance</p>
        <p className="mt-1 text-3xl font-extrabold">{dashboard.coinBalance}</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Completed Tasks" value={dashboard.completedTasks} />
        <StatCard label="Referral Earnings" value={dashboard.referralEarnings} />
        <StatCard label="Withdrawals" value={dashboard.withdrawalHistory.length} />
        <StatCard label="Status" value={dashboard.dailyCheckInCompleted ? 'Done' : 'Open'} />
      </div>

      <div className="surface-card p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-slate-900">Daily check-in</p>
          <span className="badge-chip">+ Reward</span>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {dashboard.dailyCheckInCompleted ? 'Already done today.' : 'Tap to claim today reward.'}
        </p>
        <button type="button" onClick={runDailyCheckIn} disabled={dashboard.dailyCheckInCompleted} className="primary-btn mt-3">
          {dashboard.dailyCheckInCompleted ? 'Claimed Today' : 'Claim Daily Check-In'}
        </button>
        {message ? <p className="mt-2 text-xs text-slate-600">{message}</p> : null}
      </div>

      <div className="surface-card p-4">
        <p className="text-sm font-bold text-slate-900">Recent withdrawals</p>
        <div className="mt-2 space-y-2">
          {dashboard.withdrawalHistory.length === 0 ? (
            <p className="text-xs text-slate-500">No withdrawals yet.</p>
          ) : (
            dashboard.withdrawalHistory.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-[#f1f6ff] px-3 py-2 text-xs">
                <span>{item.amount} coins</span>
                <span className="font-bold capitalize text-[#2858b5]">{item.status}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

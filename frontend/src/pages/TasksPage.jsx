import { useEffect, useRef, useState } from 'react';
import api from '../lib/api';
import { getApiErrorMessage, unwrapData } from '../lib/http';

const typeLabels = {
  watch_ads: 'Watch Ads',
  daily_checkin: 'Daily Check-In',
  app_install_offer: 'App Install Offer',
  survey: 'Survey',
};

const WATCH_AD_SECONDS = 15;
const WATCH_AD_MAX_VIEWS = 20;
const WATCH_AD_REWARD = 10;
const WATCH_AD_LOCAL_KEY = 'makebuddy_watch_ad_views_count';
const TASK_AD_KEY = '216617840e23fe9f1eea471347698770';
const TASK_AD_WIDTH = 160;
const TASK_AD_HEIGHT = 300;

function HighPerformanceAdUnit() {
  const adContainerRef = useRef(null);

  useEffect(() => {
    if (!adContainerRef.current) {
      return;
    }

    adContainerRef.current.innerHTML = '';

    window.atOptions = {
      key: TASK_AD_KEY,
      format: 'iframe',
      height: TASK_AD_HEIGHT,
      width: TASK_AD_WIDTH,
      params: {},
    };

    const invokeScript = document.createElement('script');
    invokeScript.src = `https://www.highperformanceformat.com/${TASK_AD_KEY}/invoke.js`;
    invokeScript.async = true;
    adContainerRef.current.appendChild(invokeScript);

    return () => {
      if (adContainerRef.current) {
        adContainerRef.current.innerHTML = '';
      }
      if (window.atOptions && window.atOptions.key === TASK_AD_KEY) {
        delete window.atOptions;
      }
    };
  }, []);

  return (
    <div className="flex min-h-[320px] items-center justify-center">
      <div ref={adContainerRef} />
    </div>
  );
}

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [adTask, setAdTask] = useState(null);
  const [adCountdown, setAdCountdown] = useState(WATCH_AD_SECONDS);
  const [claimingAdReward, setClaimingAdReward] = useState(false);
  const [watchAdViewsCount, setWatchAdViewsCount] = useState(() => {
    const value = Number.parseInt(localStorage.getItem(WATCH_AD_LOCAL_KEY) || '0', 10);
    return Number.isNaN(value) ? 0 : Math.max(0, value);
  });
  const taskAdClickUrl = import.meta.env.VITE_TASK_AD_CLICK_URL?.trim();

  const fetchTasks = async () => {
    setError('');
    try {
      const { data } = await api.get('/taskpage.php');
      const payload = unwrapData(data) || {};
      setTasks(payload.tasks || []);
      setBalance(payload.coinBalance ?? payload.coin_balance ?? 0);
    } catch (fetchError) {
      setError(getApiErrorMessage(fetchError, 'Unable to load tasks.'));
    }
  };

  useEffect(() => {
    async function loadTasks() {
      await fetchTasks();
    }

    loadTasks();
  }, []);

  useEffect(() => {
    if (!adTask) {
      return;
    }

    if (adCountdown <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      setAdCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [adTask, adCountdown]);

  const completeTask = async (taskId) => {
    setMessage('');
    try {
      const { data } = await api.post('/taskpage.php', { action: 'complete', task_id: taskId });
      const payload = unwrapData(data) || {};
      setBalance(payload.coinBalance ?? payload.coin_balance ?? balance ?? 0);
      setMessage(payload.message || 'Task completed.');
      await fetchTasks();
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Task could not be completed.'));
    }
  };

  const startWatchAdTask = (task) => {
    setMessage('');
    if (watchAdViewsCount >= WATCH_AD_MAX_VIEWS) {
      setMessage(`Watch ad limit reached (${WATCH_AD_MAX_VIEWS}/${WATCH_AD_MAX_VIEWS}).`);
      return;
    }
    setAdTask(task);
    setAdCountdown(WATCH_AD_SECONDS);

    if (taskAdClickUrl) {
      window.open(taskAdClickUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const closeAdModal = () => {
    if (claimingAdReward) {
      return;
    }
    setAdTask(null);
    setAdCountdown(WATCH_AD_SECONDS);
  };

  const claimAdTaskReward = async () => {
    if (!adTask || adCountdown > 0) {
      return;
    }

    setClaimingAdReward(true);
    await completeTask(adTask.id);
    setWatchAdViewsCount((prev) => {
      const next = Math.min(WATCH_AD_MAX_VIEWS, prev + 1);
      localStorage.setItem(WATCH_AD_LOCAL_KEY, String(next));
      return next;
    });
    setClaimingAdReward(false);
    setAdTask(null);
    setAdCountdown(WATCH_AD_SECONDS);
  };

  return (
    <div className="space-y-4">
      <div className="hero-card p-4">
        <p className="text-xs uppercase tracking-wide text-blue-100">Current Coins</p>
        <p className="mt-1 text-3xl font-extrabold">{balance ?? '--'}</p>
      </div>

      {message ? <p className="surface-card p-3 text-sm text-slate-700">{message}</p> : null}
      {error ? <p className="surface-card p-3 text-sm text-red-600">{error}</p> : null}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-slate-900">{task.title}</p>
                <p className="mt-1 text-xs text-slate-500">{typeLabels[task.type] || task.type}</p>
                <p className="mt-2 inline-flex rounded-full bg-[#e6faf5] px-2.5 py-1 text-xs font-bold text-[#0f8a70]">
                  +{task.type === 'watch_ads' ? WATCH_AD_REWARD : task.reward} coins
                </p>
              </div>
              <button
                type="button"
                disabled={task.type === 'watch_ads' ? watchAdViewsCount >= WATCH_AD_MAX_VIEWS : task.completed}
                onClick={() => (task.type === 'watch_ads' ? startWatchAdTask(task) : completeTask(task.id))}
                className="rounded-xl bg-[#194fae] px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {task.type === 'watch_ads'
                  ? watchAdViewsCount >= WATCH_AD_MAX_VIEWS
                    ? 'Limit Reached'
                    : `Watch Ad (${watchAdViewsCount}/${WATCH_AD_MAX_VIEWS})`
                  : task.completed
                    ? 'Completed'
                    : 'Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {adTask ? (
        <div className="fixed inset-0 z-40 flex items-end bg-black/55 p-4 sm:items-center sm:justify-center">
          <div className="surface-card w-full max-w-md p-4">
            <p className="text-sm font-bold text-slate-900">Watch Ad To Unlock Reward</p>
            <p className="mt-1 text-xs text-slate-500">
              Watch up to {WATCH_AD_MAX_VIEWS} ads. Each successful ad gives {WATCH_AD_REWARD} coins.
            </p>

            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-2">
              <HighPerformanceAdUnit />
            </div>

            <p className="mt-3 text-xs font-semibold text-slate-700">
              {adCountdown > 0 ? `Reward unlocks in ${adCountdown}s` : 'Reward unlocked. You can claim now.'}
            </p>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={closeAdModal}
                disabled={claimingAdReward}
                className="secondary-btn !w-auto px-4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={claimAdTaskReward}
                disabled={adCountdown > 0 || claimingAdReward}
                className="primary-btn !w-auto px-4 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {claimingAdReward ? 'Claiming...' : 'Claim Reward'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

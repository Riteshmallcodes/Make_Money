import { useEffect, useState } from 'react';
import api from '../lib/api';

const typeLabels = {
  watch_ads: 'Watch Ads',
  daily_checkin: 'Daily Check-In',
  app_install_offer: 'App Install Offer',
  survey: 'Survey',
};

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [balance, setBalance] = useState(null);
  const [message, setMessage] = useState('');

  const fetchTasks = async () => {
    const { data } = await api.get('/taskpage.php');
    setTasks(data.tasks || []);
    setBalance(data.coinBalance);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const completeTask = async (taskId) => {
    setMessage('');
    try {
      const { data } = await api.post('/taskpage.php', { action: 'complete', task_id: taskId });
      setBalance(data.coinBalance);
      setMessage(data.message);
      await fetchTasks();
    } catch (error) {
      setMessage(error?.response?.data?.message || 'Task could not be completed.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="hero-card p-4">
        <p className="text-xs uppercase tracking-wide text-blue-100">Current Coins</p>
        <p className="mt-1 text-3xl font-extrabold">{balance ?? '--'}</p>
      </div>

      {message ? <p className="surface-card p-3 text-sm text-slate-700">{message}</p> : null}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="surface-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-bold text-slate-900">{task.title}</p>
                <p className="mt-1 text-xs text-slate-500">{typeLabels[task.type] || task.type}</p>
                <p className="mt-2 inline-flex rounded-full bg-[#e6faf5] px-2.5 py-1 text-xs font-bold text-[#0f8a70]">+{task.reward} coins</p>
              </div>
              <button
                type="button"
                disabled={task.completed}
                onClick={() => completeTask(task.id)}
                className="rounded-xl bg-[#194fae] px-3 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {task.completed ? 'Completed' : 'Complete'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
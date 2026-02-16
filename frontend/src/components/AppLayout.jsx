import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BottomNav from './BottomNav';

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="screen-shell pb-24">
      <header className="sticky top-0 z-10 border-b border-[#d9e7ff] bg-white/90 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-slate-500">Welcome back</p>
            <p className="text-[15px] font-bold text-[#14325d]">{user?.name || 'User'}</p>
          </div>
          <button type="button" onClick={logout} className="secondary-btn">
            Logout
          </button>
        </div>
      </header>
      <main className="p-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
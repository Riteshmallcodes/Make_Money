import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', label: 'Home', icon: 'H' },
  { to: '/tasks', label: 'Tasks', icon: 'T' },
  { to: '/referrals', label: 'Refer', icon: 'R' },
  { to: '/wallet', label: 'Wallet', icon: 'W' },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[420px] border-t border-[#d8e7ff] bg-white/95 px-2 pb-3 pt-2 backdrop-blur">
      <div className="grid grid-cols-4 gap-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center rounded-2xl px-2 py-2 text-[11px] font-semibold ${
                isActive ? 'bg-[#e6f0ff] text-[#2057c8]' : 'text-slate-500'
              }`
            }
          >
            <span className="mb-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#edf3ff] text-[10px] font-bold">
              {link.icon}
            </span>
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
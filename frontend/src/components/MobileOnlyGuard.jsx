import useMobileGuard from '../hooks/useMobileGuard';

export default function MobileOnlyGuard({ children }) {
  const isMobile = useMobileGuard();

  if (!isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#081528] p-6 text-center text-white">
        <div className="w-full max-w-sm rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur">
          <h1 className="text-2xl font-bold">Mobile Access Only</h1>
          <p className="mt-3 text-sm text-slate-100">This app is available only on mobile devices.</p>
        </div>
      </div>
    );
  }

  return children;
}
export default function StatCard({ label, value, hint }) {
  return (
    <div className="surface-card p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1.5 text-[26px] font-extrabold leading-none text-slate-900">{value}</p>
      {hint ? <p className="mt-2 text-[11px] text-slate-500">{hint}</p> : null}
    </div>
  );
}
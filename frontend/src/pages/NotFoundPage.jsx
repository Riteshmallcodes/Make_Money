import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="screen-shell flex min-h-screen items-center p-4">
      <div className="surface-card w-full p-6 text-center">
        <h1 className="text-xl font-bold text-slate-900">Page not found</h1>
        <p className="mt-2 text-sm text-slate-500">This page does not exist.</p>
        <Link to="/dashboard" className="primary-btn mt-5 inline-block w-auto px-5">
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getApiErrorMessage } from '../lib/http';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }

    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (apiError) {
      setError(getApiErrorMessage(apiError, 'Invalid login details.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-shell flex min-h-screen items-center p-4">
      <form onSubmit={onSubmit} className="surface-card w-full p-6">
        <p className="badge-chip inline-flex">Bonus Buddy</p>
        <h1 className="mt-3 text-2xl font-extrabold text-[#10325e]">Login</h1>
        <p className="mt-1 text-sm text-slate-500">Access your earnings and daily rewards.</p>

        {error ? <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p> : null}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          className="input-field mt-1"
          placeholder="you@example.com"
        />

        <label className="mt-3 block text-sm font-semibold text-slate-700">Password</label>
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={onChange}
          className="input-field mt-1"
          placeholder="Enter password"
        />

        <button type="submit" disabled={loading} className="primary-btn mt-5">
          {loading ? 'Signing in...' : 'Login'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          New user?{' '}
          <Link to="/register" className="font-bold text-[#1f62d4]">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

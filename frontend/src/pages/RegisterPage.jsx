import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    referralCode: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!form.name || !form.email || !form.mobile || !form.password) {
      setError('Please fill all required fields.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (apiError) {
      setError(apiError?.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="screen-shell flex min-h-screen items-center p-4">
      <form onSubmit={onSubmit} className="surface-card w-full p-6">
        <p className="badge-chip inline-flex">Create Profile</p>
        <h1 className="mt-3 text-2xl font-extrabold text-[#10325e]">Register</h1>
        <p className="mt-1 text-sm text-slate-500">Join and start earning coins.</p>

        {error ? <p className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-600">{error}</p> : null}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Name</label>
        <input name="name" value={form.name} onChange={onChange} className="input-field mt-1" />

        <label className="mt-3 block text-sm font-semibold text-slate-700">Email</label>
        <input name="email" type="email" value={form.email} onChange={onChange} className="input-field mt-1" />

        <label className="mt-3 block text-sm font-semibold text-slate-700">Mobile</label>
        <input name="mobile" value={form.mobile} onChange={onChange} className="input-field mt-1" />

        <label className="mt-3 block text-sm font-semibold text-slate-700">Password</label>
        <input name="password" type="password" value={form.password} onChange={onChange} className="input-field mt-1" />

        <label className="mt-3 block text-sm font-semibold text-slate-700">Referral code (optional)</label>
        <input name="referralCode" value={form.referralCode} onChange={onChange} className="input-field mt-1" />

        <button type="submit" disabled={loading} className="primary-btn mt-5">
          {loading ? 'Creating account...' : 'Register'}
        </button>

        <p className="mt-4 text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-[#1f62d4]">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
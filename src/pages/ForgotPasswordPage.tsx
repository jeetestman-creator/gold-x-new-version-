import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function ForgotPasswordPage() {
  const = useState('');
  const = useState(false);
  const navigate = useNavigate();

  const handleReset = async () => {
    if (!email.trim()) return toast.error('Enter your email');

    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) throw error;

      toast.success('Reset link sent! Check your email.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md border border-yellow-500">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">Reset Password</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 bg-black border border-gray-600 rounded-lg text-white focus:border-yellow-400 outline-none"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleReset}
            disabled={loading || !email.trim()}
            className="w-full bg-yellow-400 text-black py-4 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <p className="text-center text-sm mt-4">
            <Link to="/login" className="text-yellow-400 underline hover:text-yellow-300">
              Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function LoginPage() {
  const = useState('');
  const = useState(false);
  const = useState(0); // Attempts counter for rate limit
  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email.trim()) return toast.error('Enter your email');

    if (attempts >= 5) {
      toast.error('Too many attempts. Try after 1 minute.');
      return;
    }

    setLoading(true);
    setAttempts(attempts + 1);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/otp`
        }
      });

      if (error) throw error;

      toast.success('OTP sent! Check your email.');
      navigate('/otp', { state: { email } }); // Pass email to OTP page
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md border border-yellow-500">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">Login to Golden Wealth Hub</h1>

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
            onClick={handleSendOTP}
            disabled={loading || !email.trim()}
            className="w-full bg-yellow-400 text-black py-4 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>

          <div className="text-center text-sm mt-4">
            <Link to="/reset-password" className="text-yellow-400 underline hover:text-yellow-300">
              Forgot Password?
            </Link>
          </div>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-yellow-400 underline hover:text-yellow-300">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

export default function SignupPage() {
  const = useState('');
  const = useState('');
  const = useState(''); // Optional referral code
  const = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    if (!email.trim() || !password.trim()) {
      return toast.error('Email & Password required');
    }

    if (password.length < 8) {
      return toast.error('Password must be at least 8 characters');
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/otp`
        }
      });

      if (error) throw error;

      // Save referral code if provided
      if (referralCode.trim()) {
        await supabase.from('profiles').update({
          referred_by: referralCode.trim()
        }).eq('id', data.user?.id);
      }

      toast.success('Account created! Check email for OTP.');
      navigate('/otp', { state: { email } });
    } catch (err: any) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md border border-yellow-500">
        <h1 className="text-4xl font-bold text-yellow-400 text-center mb-8">Sign Up</h1>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 bg-black border border-gray-600 rounded-lg text-white focus:border-yellow-400 outline-none"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full p-4 bg-black border border-gray-600 rounded-lg text-white focus:border-yellow-400 outline-none"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Referral Code (optional)</label>
            <input
              type="text"
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="e.g. ABC123"
              className="w-full p-4 bg-black border border-gray-600 rounded-lg text-white focus:border-yellow-400 outline-none"
              disabled={loading}
            />
          </div>

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-yellow-400 text-black py-4 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p className="text-center text-sm mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-yellow-400 underline hover:text-yellow-300">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

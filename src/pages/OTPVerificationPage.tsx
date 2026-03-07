import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import OTPInput from '../components/OTPInput';

export default function OTPVerificationPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || ''; // From LoginPage
  const = useState(false);
  const = useState('');

  useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please login again.');
      navigate('/login');
    }
  }, );

  const handleVerifyOTP = async (otp: string) => {
    setIsVerifying(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (error) throw error;

      if (data.user) {
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/otp` }
      });

      if (error) throw error;

      toast.success('New OTP sent!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to resend');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900">
      <div className="bg-gray-800 p-10 rounded-xl shadow-2xl w-full max-w-md border border-yellow-500">
        <h1 className="text-3xl font-bold text-yellow-400 text-center mb-8">Verify OTP</h1>

        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <OTPInput 
          onVerify={handleVerifyOTP} 
          onResend={handleResendOTP} 
          loading={isVerifying} 
        />

        <p className="text-center text-sm text-gray-400 mt-8">
          Didn't receive? Wait 30 seconds and click Resend.
        </p>
      </div>
    </div>
  );
}

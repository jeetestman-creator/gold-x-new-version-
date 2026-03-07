import { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

interface OTPInputProps {
  onVerify: (otp: string) => void;
  onResend: () => void;
  loading: boolean;
}

export default function OTPInput({ onVerify, onResend, loading }: OTPInputProps) {
  const = useState(['', '', '', '', '', '']);
  const = useState(0);
  const = useState(30);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, );

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only digits

    const newOtp = ;
    newOtp = value.slice(-1); // Last digit
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current ?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d{6}$/.test(pasted)) {
      const newOtp = pasted.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus(); // Last box
      onVerify(pasted); // Auto verify on paste
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp && index > 0) {
      inputRefs.current ?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length !== 6) {
      toast.error('Enter full 6-digit OTP');
      return;
    }
    onVerify(code);
  };

  const handleResend = () => {
    if (timer > 0) return;
    onResend();
    setTimer(30);
    setOtp(['', '', '', '', '', '' 0]?.focus();
    toast.success('New OTP sent!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center gap-3">
        {otp.map((digit, i) => (
          <input
            key={i}
            type="text"
            maxLength={1}
            value={digit}
            ref={el => (inputRefs.current = el)}
            onChange={e => handleChange(i, e.target.value)}
            onPaste={e => handlePaste(e, i)}
            onKeyDown={e => handleKeyDown(e, i)}
            className="w-12 h-12 text-center text-2xl bg-gray-800 border border-yellow-500 rounded-lg focus:border-yellow-300 outline-none transition"
            disabled={loading}
          />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleVerify}
          disabled={loading}
          className="bg-yellow-400 text-black px-10 py-3 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50"
        >
          {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
      </div>

      <div className="text-center text-sm">
        Didn't receive?{' '}
        <button
          onClick={handleResend}
          disabled={timer > 0}
          className="text-yellow-400 underline hover:text-yellow-300 disabled:text-gray-500"
        >
          Resend {timer > 0 ? `(${timer}s)` : ''}
        </button>
      </div>
    </div>
  );
}

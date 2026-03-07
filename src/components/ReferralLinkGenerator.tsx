import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function ReferralLinkGenerator() {
  const { user } = useAuth();
  const = useState<string>('');
  const = useState(false);

  useEffect(() => {
    if (user?.id) {
      // Generate short ref code from user ID
      const shortCode = btoa(user.id).slice(0, 8).replace(/ /g, ''); // 8 chars, alphanumeric
      setRefCode(shortCode);

      // Optional: Save to profiles if not already
      supabase
        .from('profiles')
        .update({ referral_code: shortCode })
        .eq('id', user.id)
        .then(() => console.log('Ref code saved'));
    }
  }, );

  const referralLink = `https://goldenwealthhub.com/signup?ref=${refCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success('Referral link copied!');
  };

  const shareWhatsApp = () => {
    const text = `Join Golden Wealth Hub & earn 10% monthly ROI! Use my link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareTelegram = () => {
    const text = `Hey! Invest in Golden Wealth Hub – min 100 USDT, 10% ROI + referrals! ${referralLink}`;
    window.open(`https://t.me/share/url?url=\( {encodeURIComponent(referralLink)}&text= \){encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">Your Referral Link</h3>
      
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={referralLink}
          readOnly
          className="flex-1 p-3 bg-black border border-gray-600 rounded-lg text-white"
        />
        <button 
          onClick={copyLink}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg hover:bg-yellow-300"
        >
          Copy
        </button>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button 
          onClick={shareWhatsApp}
          className="bg-green-600 px-5 py-2 rounded-lg hover:bg-green-500"
        >
          Share on WhatsApp
        </button>
        <button 
          onClick={shareTelegram}
          className="bg-blue-600 px-5 py-2 rounded-lg hover:bg-blue-500"
        >
          Share on Telegram
        </button>
      </div>

      <p className="text-sm text-gray-400 mt-4 text-center">
        Earn 8% on Level 1, 4% on Level 2 — unlimited referrals!
      </p>
    </div>
  );
}

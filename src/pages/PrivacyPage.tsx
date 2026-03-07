import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';

export default function PrivacyPage() {
  const { user } = useAuth();
  const = useState(true); // Analytics sharing
  const = useState(true); // Email notifications
  const = useState(false);
  const = useState(false);

  useEffect(() => {
    if (user) {
      // Fetch current preferences
      const fetchPreferences = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('allow_analytics, allow_notifications')
          .eq('id', user.id)
          .single();

        setAllowAnalytics(data?.allow_analytics ?? true);
        setAllowNotifications(data?.allow_notifications ?? true);
      };
      fetchPreferences();
    }
  }, );

  const handleSavePreferences = async () => {
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        allow_analytics: allowAnalytics,
        allow_notifications: allowNotifications
      })
      .eq('id', user.id);

    if (!error) {
      toast.success('Preferences updated');
    } else {
      toast.error('Failed to save');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure? This cannot be undone.')) return;

    try {
      const { error } = await supabase.rpc('delete_user', { user_id: user?.id });

      if (!error) {
        toast.success('Account deleted. Logging out...');
        await supabase.auth.signOut();
      } else {
        toast.error('Deletion failed');
      }
    } catch (err) {
      toast.error('Error deleting account');
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">Privacy Settings</h1>

      {/* Data Summary */}
      <section className="bg-gray-800 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">What We Collect</h2>
        <ul className="space-y-3 text-gray-300">
          <li>• Email & basic profile info</li>
          <li>• Transaction & balance data</li>
          <li>• Referral links & commissions</li>
          <li>• Device & IP for security (anonymized)</li>
        </ul>
        <p className="mt-4 text-sm text-gray-400">
          We follow India's DPDP Act 2023. No data sold to third parties.
        </p>
      </section>

      {/* Preferences */}
      <section className="bg-gray-800 p-8 rounded-lg mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Choices</h2>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span>Allow analytics (helps improve app)</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={allowAnalytics}
                onChange={(e) => setAllowAnalytics(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-yellow-400 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <span>Receive email notifications</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={allowNotifications}
                onChange={(e) => setAllowNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-yellow-400 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
          </div>
        </div>

        <button
          onClick={handleSavePreferences}
          className="mt-6 bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition w-full md:w-auto"
        >
          Save Preferences
        </button>
      </section>

      {/* Delete Account */}
      <section className="bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Delete Account</h2>
        <p className="text-gray-300 mb-6">
          Deleting your account will remove all data permanently. This action cannot be undone.
        </p>

        <button
          onClick={handleDeleteAccount}
          disabled={deleting}
          className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-red-500 transition disabled:opacity-50"
        >
          {deleting ? 'Deleting...' : 'Delete My Account'}
        </button>
      </section>

      <p className="text-center text-sm text-gray-500 mt-12">
        Last updated: March 2026 | Contact us at support@goldenwealthhub.com for more.
      </p>
    </div>
  );
}

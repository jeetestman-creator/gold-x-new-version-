import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface AdminControlsProps {
  userId: string;
  currentStatus: string;
  onUpdate: () => void;
}

export default function AdminControls({ userId, currentStatus, onUpdate }: AdminControlsProps) {
  const = useState('');
  const = useState(false);

  const handleToggleStatus = async () => {
    const newStatus = currentStatus === 'active' ? 'blocked' : 'active';

    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', userId);

    if (!error) {
      toast.success(`User ${newStatus}`);
      onUpdate();
    } else {
      toast.error('Failed to update status');
    }
  };

  const handleCreditROI = async () => {
    const amount = 10; // 10% of balance - இது placeholder, real-ல balance * 0.1
    const { error } = await supabase
      .rpc('credit_roi', { user_id: userId, amount }); // Custom RPC function in Supabase

    if (!error) {
      toast.success('ROI credited manually');
      onUpdate();
    } else {
      toast.error('Failed to credit ROI');
    }
  };

  const handleBroadcast = async () => {
    if (!broadcastMessage.trim()) return toast.error('Enter message');

    // Send to all users via Supabase edge function
    const { error } = await supabase.functions.invoke('send-broadcast', {
      body: { message: broadcastMessage }
    });

    if (!error) {
      toast.success('Message sent to all users');
      setBroadcastMessage('');
    } else {
      toast.error('Broadcast failed');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <h3 className="text-xl font-bold text-yellow-400">Admin Controls</h3>

      {/* Status Toggle */}
      <div className="flex items-center justify-between">
        <span>Current Status: {currentStatus}</span>
        <button 
          onClick={handleToggleStatus}
          className={`px-4 py-2 rounded ${currentStatus === 'active' ? 'bg-red-600' : 'bg-green-600'}`}
        >
          {currentStatus === 'active' ? 'Block User' : 'Activate User'}
        </button>
      </div>

      {/* Manual ROI Credit */}
      <div className="flex items-center justify-between">
        <span>Manual ROI Credit (10%)</span>
        <button 
          onClick={handleCreditROI}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          Credit Now
        </button>
      </div>

      {/* Broadcast Message */}
      <div>
        <label className="block text-sm mb-2">Broadcast to All Users</label>
        <textarea
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          placeholder="Type announcement..."
          className="w-full h-20 bg-black border border-gray-600 p-3 rounded text-white"
        />
        <button 
          onClick={handleBroadcast}
          disabled={loading}
          className="mt-3 bg-yellow-400 text-black px-6 py-2 rounded w-full disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Broadcast'}
        </button>
      </div>
    </div>
  );
}

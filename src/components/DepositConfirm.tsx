
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { useAuth } from '../hooks/useAuth';

interface DepositConfirmProps {
  amount: number;
  network: 'TRC20' | 'BEP20';
  onClose: () => void;
}

export default function DepositConfirm({ amount, network, onClose }: DepositConfirmProps) {
  const { user } = useAuth();
  const = useState('');

  const addresses = {
    TRC20: 'TYourTronDepositAddressHere', // Replace with real Tron address
    BEP20: '0xYourBSCDepositAddressHere'   // Replace with real BSC address
  };

  const qrValue = addresses;

  const handleConfirm = async () => {
    if (!txHash.trim()) {
      toast.error('Please enter transaction hash');
      return;
    }

    if (amount < 100) {
      toast.error('Minimum deposit is 100 USDT');
      return;
    }

    try {
      const { error } = await supabase
        .from('deposits')
        .insert({
          user_id: user?.id,
          amount,
          network,
          tx_hash: txHash.trim(),
          status: 'pending',
          fee: amount * 0.05, // 5% fee
          net_amount: amount * 0.95
        });

      if (error) throw error;

      toast.success('Deposit request submitted! Waiting for confirmation.');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit deposit');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full border border-yellow-500">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Confirm Deposit</h2>

        <p className="mb-4">
          Send <strong>{amount} USDT</strong> via {network} network.<br />
          <span className="text-red-400">5% fee will be deducted (Net: {(amount * 0.95).toFixed(2)} USDT)</span>
        </p>

        <div className="flex flex-col items-center mb-6">
          <QRCode value={qrValue} size={180} bgColor="#000" fgColor="#FFD700" />
          <p className="mt-4 text-sm break-all text-center bg-gray-800 p-2 rounded">
            {qrValue}
          </p>
          <button 
            onClick={() => navigator.clipboard.writeText(qrValue).then(() => toast.success('Address copied!'))}
            className="mt-2 bg-yellow-400 text-black px-4 py-1 rounded"
          >
            Copy Address
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">Transaction Hash (TxID)</label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Paste your Tx Hash here"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white"
          />
        </div>

        <div className="flex justify-between">
          <button 
            onClick={onClose}
            className="bg-gray-600 px-6 py-2 rounded hover:bg-gray-500"
          >
            Cancel
          </button>
          <button 
            onClick={handleConfirm}
            className="bg-green-600 px-6 py-2 rounded hover:bg-green-500"
          >
            Confirm Deposit
          </button>
        </div>
        const handleConfirm = async () => {
  if (!txHash.trim()) {
    return toast.error('Please enter transaction hash');
  }

  if (amount < 100) {
    return toast.error('Minimum deposit is 100 USDT');
  }

  setLoading(true); // optional loading state

  try {
    // 1. Insert deposit record
    const { data: newDeposit, error } = await supabase
      .from('deposits')
      .insert({
        user_id: user?.id,
        amount,
        network,
        tx_hash: txHash.trim(),
        status: 'pending',
        fee: amount * 0.05,
        net_amount: amount * 0.95
      })
      .select('id')
      .single();

    if (error) throw error;

    const newDepositId = newDeposit.id;

    // 2. Call auto-detect endpoint based on network
    let detectUrl = '';
    if (network === 'TRC20') {
      detectUrl = 'https://your-project.supabase.co/functions/v1/auto-detect-deposit';
    } else if (network === 'BEP20') {
      detectUrl = 'https://your-project.supabase.co/functions/v1/auto-detect-bep20';
    }

    if (detectUrl) {
      const detectRes = await fetch(detectUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deposit_id: newDepositId, tx_hash: txHash.trim() })
      });

      if (!detectRes.ok) {
        const err = await detectRes.json();
        throw new Error(err.error || 'Auto-detection failed');
      }
    }

    toast.success('Deposit submitted & auto-verification started!');
    onClose(); // close modal
  } catch (err) {
    console.error(err);
    toast.error(err.message || 'Failed to submit deposit');
  } finally {
    setLoading(false);
  }
};

        <p className="text-xs text-gray-400 mt-6 text-center">
          Deposits are processed manually or auto-detected. Confirmation may take 10–60 mins.
        </p>
      </div>
    </div>
  );
}

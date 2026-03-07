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
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);

  // Replace with your actual wallet addresses
  const depositAddresses = {
    TRC20: 'TYourTronDepositAddressHere', // ← YOUR REAL TRON ADDRESS
    BEP20: '0xYourBSCDepositAddressHere'   // ← YOUR REAL BSC ADDRESS
  };

  const qrValue = depositAddresses[network];

  const handleConfirm = async () => {
    if (!txHash.trim()) {
      return toast.error('Please enter transaction hash');
    }

    if (amount < 100) {
      return toast.error('Minimum deposit is 100 USDT');
    }

    setLoading(true);

    try {
      // Step 1: Insert deposit record into Supabase
      const { data: newDeposit, error: insertError } = await supabase
        .from('deposits')
        .insert({
          user_id: user?.id,
          amount,
          network,
          tx_hash: txHash.trim(),
          status: 'pending',
          fee: amount * 0.05,
          net_amount: amount * 0.95,
        })
        .select('id')
        .single();

      if (insertError) throw insertError;

      const newDepositId = newDeposit.id;

      // Step 2: Trigger auto-detection based on network
      let detectUrl = '';
      if (network === 'TRC20') {
        detectUrl = 'https://your-project-ref.supabase.co/functions/v1/auto-detect-deposit';
      } else if (network === 'BEP20') {
        detectUrl = 'https://your-project-ref.supabase.co/functions/v1/auto-detect-bep20';
      }

      if (detectUrl) {
        const detectResponse = await fetch(detectUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            deposit_id: newDepositId,
            tx_hash: txHash.trim(),
          }),
        });

        if (!detectResponse.ok) {
          // Don't throw — allow manual confirmation if auto-detect fails
          console.warn('Auto-detection failed (tx may not be visible yet):', await detectResponse.text());
          toast.warning('Deposit submitted. Verification in progress...');
        } else {
          toast.success('Deposit submitted & auto-verification started!');
        }
      } else {
        toast.success('Deposit submitted! Waiting for manual verification.');
      }

      onClose(); // Close modal on success
    } catch (err: any) {
      console.error('Deposit error:', err);
      toast.error(err.message || 'Failed to submit deposit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full border border-yellow-500">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Confirm Your Deposit</h2>

        <p className="mb-4">
          Send <strong>{amount} USDT</strong> using {network} network.<br />
          <span className="text-red-400 text-sm">
            5% fee will be deducted (You will receive {(amount * 0.95).toFixed(2)} USDT)
          </span>
        </p>

        <div className="flex flex-col items-center mb-6">
          <QRCode value={qrValue} size={180} bgColor="#000000" fgColor="#FFD700" />
          <p className="mt-4 text-sm break-all text-center bg-gray-800 p-2 rounded">
            {qrValue}
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(qrValue);
              toast.success('Address copied to clipboard!');
            }}
            className="mt-2 bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-300"
          >
            Copy Address
          </button>
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-2">Transaction Hash (TxID / Tx Hash)</label>
          <input
            type="text"
            value={txHash}
            onChange={(e) => setTxHash(e.target.value)}
            placeholder="Paste your transaction hash here"
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded text-white focus:border-yellow-400 outline-none"
            disabled={loading}
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Confirm & Submit'}
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6 text-center">
          Deposits are verified automatically (or manually within 30–60 minutes).
          <br />
          Keep this window open until confirmation.
        </p>
      </div>
    </div>
  );
}

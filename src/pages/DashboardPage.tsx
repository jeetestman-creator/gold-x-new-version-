
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import QRCode from 'react-qr-code';
import { format, differenceInDays } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import ReferralNode from '../components/ReferralNode';


export default function DashboardPage() {
  const { user } = useAuth();

  const = useState(0);
  const = useState<string>('Loading...');
  const = useState(0);
  const = useState<Date | null>(null);
  const = useState<any[]>([]);
  const = useState(true);
  const = useState<'TRC20' | 'BEP20'>('TRC20');

  const depositAddresses = {
    TRC20: 'TYourTronWalletAddressHere', // Replace with real Tron address
    BEP20: '0xYourBSCWalletAddressHere'   // Replace with real BSC address
  };

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // 1. Balance & Next ROI
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('balance, next_roi_date')
          .eq('id', user.id)
          .single();

        if (profileError) throw profileError;

        setBalance(profile?.balance || 0);
        setNextRoiDate(profile?.next_roi_date 
          ? format(new Date(profile.next_roi_date), 'MMM dd, yyyy') 
          : 'Admin will set soon');

        // 2. Referral Earnings & Lock
        const { data: referrals } = await supabase
          .from('referrals')
          .select('commission_amount, commission_locked_until')
          .eq('referred_by', user.id);

        const total = referrals?.reduce((sum, r) => sum + (r.commission_amount || 0), 0) || 0;
        setReferralEarnings(total);

        // First locked commission (30 days lock)
        const locked = referrals?.find(r => r.commission_locked_until);
        if (locked) {
          const lockDate = new Date(locked.commission_locked_until);
          setReferralLockedUntil(lockDate);
        }

        // 3. Transaction History
        const { data: txs } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        setTransactions(txs || []);

      } catch (err) {
        console.error(err);
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, );

  const handleDeposit = () => {
    toast.success(`Use ${network} to deposit min 100 USDT`);
  };

  const isReferralLocked = referralLockedUntil && differenceInDays(referralLockedUntil, new Date()) > 0;

  if (loading) return <p className="text-center">Loading dashboard...</p>;

  return (
    <div className="space-y-8">
      {/* Balance Card */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold text-yellow-400">Your Balance</h2>
        <p className="text-4xl mt-2">{balance.toFixed(2)} USDT</p>
        <p className="text-sm mt-2">Next ROI: {nextRoiDate}</p>
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl">Referral Earnings</h3>
          <p className="text-3xl mt-2">{referralEarnings.toFixed(2)} USDT</p>
          {isReferralLocked && (
            <p className="text-red-400 mt-2">
              Locked until {format(referralLockedUntil!, 'MMM dd')} (30 days rule)
            </p>
          )}
        </div>

        {/* Deposit Section */}
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl">Deposit Now</h3>
          <select 
            value={network}
            onChange={(e) => setNetwork(e.target.value as 'TRC20' | 'BEP20')}
            className="bg-black text-white p-2 mt-2 rounded"
          >
            <option>TRC20</option>
            <option>BEP20</option>
          </select>
          <div className="mt-4 flex flex-col items-center">
            <QRCode value={depositAddresses } size={150} />
            <p className="mt-2 break-all text-sm">{depositAddresses }</p>
          </div>
          <button 
            onClick={handleDeposit}
            className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded w-full"
          >
            Confirm Deposit
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl">Recent Transactions</h3>
        <table className="w-full mt-4 text-left">
          <thead>
            <tr className="border-b">
              <th>Type</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b">
                <td>{tx.type}</td>
                <td>{tx.amount} USDT</td>
                <td>{format(new Date(tx.created_at), 'dd MMM yy')}</td>
                <td className={tx.status === 'approved' ? 'text-green-400' : 'text-yellow-400'}>
                  {tx.status}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && <tr><td colSpan={4}>No transactions yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const = useState<any[]>([]); // Tree data: array of level 1 nodes

useEffect(() => {
  const fetchReferralTree = async () => {
    try {
      // Get all referrals for this user (recursive query via RPC)
      const { data, error } = await supabase.rpc('get_referral_tree', {
        root_user_id: user?.id
      });

      if (error) throw error;

      setReferralTree(data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load referral tree');
    }
  };

  if (user) fetchReferralTree();
}, );

// ... after Referral Earnings card
<div className="bg-gray-800 p-6 rounded-lg">
  <h3 className="text-xl font-bold mb-4">Your Referral Tree</h3>
  
  {referralTree.length === 0 ? (
    <p className="text-gray-400">No referrals yet. Share your link!</p>
  ) : (
    <div className="space-y-4">
      {referralTree.map(node => (
        <ReferralNode 
          key={node.email} 
          user={{ email: node.email, balance: node.balance, level: 1 }} 
          children={node.children || []} 
        />
      ))}
    </div>
  )}
</div>

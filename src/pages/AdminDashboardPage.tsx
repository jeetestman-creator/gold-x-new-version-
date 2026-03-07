
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { useAuth } from '../hooks/useAuth';
import { useState, useEffect } from 'react';

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const = useState<any[]>([ ]>([]); // pending withdrawals
  const = useState<any[]>([]); // all users
  const = useState<Date | null>(null);
  const = useState('');
  const = useState(true);

  useEffect(() => {
    if (!user) return;

    // Check if admin (assume role in profiles table)
    const checkAdmin = async () => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        toast.error('Access denied');
        return;
      }
      fetchAdminData();
    };

    checkAdmin();
  }, );

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // Pending Deposits
      const { data: deps } = await supabase
        .from('deposits')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setPendingDeposits(deps || []);

      // Pending Withdrawals
      const { data: wds } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      setPendingWithdrawals(wds || []);

      // All Users
      const { data: users } = await supabase
        .from('profiles')
        .select('id, email, balance, created_at');

      setUsers(users || []);

    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveDeposit = async (id: string) => {
    const { error } = await supabase
      .from('deposits')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      toast.success('Deposit approved');
      fetchAdminData();
    }
  };

  const handleRejectDeposit = async (id: string) => {
    const { error } = await supabase
      .from('deposits')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (!error) {
      toast.success('Deposit rejected');
      fetchAdminData();
    }
  };

  const handleApproveWithdrawal = async (id: string) => {
    // Add crypto transfer logic here (TronWeb / ethers.js)
    const { error } = await supabase
      .from('withdrawals')
      .update({ status: 'approved' })
      .eq('id', id);

    if (!error) {
      toast.success('Withdrawal approved');
      fetchAdminData();
    }
  };

  const handleRejectWithdrawal = async (id: string) => {
    const { error } = await supabase
      .from('withdrawals')
      .update({ status: 'rejected' })
      .eq('id', id);

    if (!error) {
      toast.success('Withdrawal rejected');
      fetchAdminData();
    }
  };

  const setNextRoi = async () => {
    if (!nextRoiDate) return toast.error('Select a date');

    const { error } = await supabase
      .from('profiles')
      .update({ next_roi_date: nextRoiDate.toISOString() })
      .eq('role', 'user'); // Broadcast to all users

    if (!error) {
      toast.success('Next ROI date set');
    }
  };

  const sendBroadcast = async () => {
    if (!broadcastMessage) return toast.error('Enter message');

    // Use Supabase function or Resend to send to all emails
    toast.success('Broadcast sent (implement email send)');
  };

  if (loading) return <p className="text-center">Loading admin panel...</p>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-yellow-400">Admin Dashboard</h1>

      {/* Pending Deposits */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl">Pending Deposits</h2>
        <table className="w-full mt-4 text-left">
          <thead>
            <tr>
              <th>User</th>
              <th>Amount</th>
              <th>Network</th>
              <th>Tx Hash</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingDeposits.map(dep => (
              <tr key={dep.id}>
                <td>{dep.user_email}</td>
                <td>{dep.amount} USDT</td>
                <td>{dep.network}</td>
                <td>{dep.tx_hash.slice(0, 10)}...</td>
                <td>
                  <button onClick={() => handleApproveDeposit(dep.id)} className="bg-green-600 px-3 py-1 rounded mr-2">Approve</button>
                  <button onClick={() => handleRejectDeposit(dep.id)} className="bg-red-600 px-3 py-1 rounded">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pending Withdrawals */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-2xl">Pending Withdrawals</h2>
        <table className="w-full mt-4">
          {/* Similar table as above, with approve/reject */}
        </table>
      </div>

      {/* Set ROI Date */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2>Set Next ROI Payout Date</h2>
        <input
          type="date"
          onChange={(e) => setNextRoiDate(new Date(e.target.value))}
          className="bg-black text-white p-2 mt-2 rounded"
        />
        <button onClick={setNextRoi} className="ml-4 bg-yellow-400 text-black px-6 py-2 rounded">Update</button>
      </div>

      {/* Broadcast */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2>Broadcast Message</h2>
        <textarea
          value={broadcastMessage}
          onChange={(e) => setBroadcastMessage(e.target.value)}
          className="w-full h-24 bg-black text-white p-2 mt-2 rounded"
        />
        <button onClick={sendBroadcast} className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded">Send</button>
      </div>

      {/* Users Overview */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h2>All Users ({users.length})</h2>
        <ul className="mt-4">
          {users.map(u => (
            <li key={u.id}>{u.email} - Balance: {u.balance} USDT</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const = useState<any[]>([]); // Top referrers list
const = useState(0); // Total commissions paid
const = useState<any[]>([]); // All referral tree (top-level)

useEffect(() => {
  const fetchReferralOverview = async () => {
    try {
      // Total commissions paid (from referrals table)
      const { data: comms } = await supabase
        .from('referrals')
        .select('commission_amount')
        .eq('commission_locked_until', null); // Unlocked ones

      const total = comms?.reduce((sum, r) => sum + (r.commission_amount || 0), 0) || 0;
      setTotalCommissions(total);

      // Top 10 referrers (by total commission)
      const { data: top } = await supabase
        .from('referrals')
        .select('referred_by, sum(commission_amount) as total')
        .group('referred_by')
        .order('total', { ascending: false })
        .limit(10);

      const topUsers = await Promise.all(top.map(async r => {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email')
          .eq('id', r.referred_by)
          .single();
        return { email: profile?.email, total: r.total };
      }));

      setTopReferrers(topUsers);

      // Full referral tree (top-level only, expandable)
      const { data: tree } = await supabase.rpc('get_full_referral_tree'); // New RPC
      setReferralTree(tree || []);
    } catch (err) {
      toast.error('Failed to load referral overview');
    }
  };

  fetchReferralOverview();
}, );

// ... after Broadcast section, add this:
<div className="bg-gray-800 p-6 rounded-lg">
  <h2 className="text-2xl font-bold text-yellow-400 mb-4">Referral Overview</h2>

  {/* Total Stats */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div className="bg-black p-6 rounded-lg text-center">
      <p className="text-sm text-gray-400">Total Commissions Paid</p>
      <p className="text-3xl font-bold text-green-400">{totalCommissions.toFixed(2)} USDT</p>
    </div>
    <div className="bg-black p-6 rounded-lg text-center">
      <p className="text-sm text-gray-400">Active Referrers</p>
      <p className="text-3xl font-bold">{topReferrers.length}</p>
    </div>
    <div className="bg-black p-6 rounded-lg text-center">
      <p className="text-sm text-gray-400">Pending Locks</p>
      <p className="text-3xl font-bold text-yellow-400">
        {referralTree.reduce((sum, r) => sum + r.children.length, 0)} referrals
      </p>
    </div>
  </div>

  {/* Top Referrers */}
  <div className="mb-8">
    <h3 className="text-xl mb-4">Top 10 Referrers</h3>
    <ul className="space-y-2">
      {topReferrers.map((r, i) => (
        <li key={i} className="flex justify-between bg-gray-700 p-3 rounded">
          <span>{r.email}</span>
          <span className="text-green-400">{r.total.toFixed(2)} USDT</span>
        </li>
      ))}
    </ul>
  </div>

  {/* Referral Tree */}
  <div>
    <h3 className="text-xl mb-4">All Referral Trees</h3>
    {referralTree.length === 0 ? (
      <p className="text-gray-400">No referrals yet.</p>
    ) : (
      referralTree.map(root => (
        <ReferralNode 
          key={root.user.email} 
          user={{ ...root.user, level: 0 }} 
          children={root.children} 
        />
      ))
    )}
  </div>
</div>

 
import TronWeb from 'tronweb';

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io',
  privateKey: 'YOUR_ADMIN_PRIVATE_KEY' // Supabase secret-ல store பண்ணு, NEVER hardcode!
});

export async function sendUSDTToUser(toAddress: string, amount: number) {
  const usdtContract = await tronWeb.contract().at('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'); // USDT TRC-20

  const tx = await usdtContract.transfer(toAddress, tronWeb.toSun(amount)).send({
    feeLimit: 40_000_000, // 40 TRX fee limit
  });

  return tx;
}

// AdminDashboardPage-ல approve-ல call பண்ணு:
const handleApproveWithdrawal = async (wd: any) => {
  try {
    const tx = await sendUSDTToUser(wd.user_wallet_address, wd.net_amount); // user wallet from profiles
    await supabase.from('withdrawals').update({ tx_hash: tx, status: 'approved', approved_at: new Date() }).eq('id', wd.id);
    toast.success('Withdrawal sent!');
  } catch (err) {
    toast.error('Transfer failed');
  }
};

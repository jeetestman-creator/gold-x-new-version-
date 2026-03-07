import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  const { deposit_id, tx_hash } = await req.json();

  // Fetch deposit details
  const { data: deposit } = await supabase
    .from('deposits')
    .select('amount, user_id, network')
    .eq('id', deposit_id)
    .single();

  if (!deposit || deposit.network !== 'BEP20') {
    return new Response('Invalid deposit', { status: 400 });
  }

  // BscScan API call
  const apiKey = Deno.env.get('BSCSCAN_API_KEY');
  const url = `https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x55d398326f99059ff775485246999027b3197955&address=TYourBSCWalletAddressHere&startblock=0&endblock=99999999&sort=desc&apikey=${apiKey}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.status !== '1') {
    return new Response('API error', { status: 500 });
  }

  const tx = data.result.find(t => t.hash.toLowerCase() === tx_hash.toLowerCase());

  if (!tx) {
    return new Response('Transaction not found', { status: 404 });
  }

  const yourWallet = '0xYourBSCWalletAddressHere'; // Replace
  const usdtContract = '0x55d398326f99059ff775485246999027b3197955';

  if (
    tx.contractAddress.toLowerCase() !== usdtContract.toLowerCase() ||
    tx.to.toLowerCase() !== yourWallet.toLowerCase() ||
    Number(tx.value) / 1e18 !== deposit.amount
  ) {
    return new Response('No matching transfer', { status: 400 });
  }

  // Auto-approve
  await supabase
    .from('deposits')
    .update({ status: 'approved', tx_hash })
    .eq('id', deposit_id);

  // Credit balance
  await supabase.rpc('credit_balance', {
    user_id: deposit.user_id,
    amount: deposit.net_amount
  });

  // Send email
  await fetch('https://your-project.supabase.co/functions/v1/send-deposit-confirmation', {
    method: 'POST',
    body: JSON.stringify({ user_id: deposit.user_id, amount: deposit.amount })
  });

  return new Response('BEP-20 deposit auto-approved', { status: 200 });
});

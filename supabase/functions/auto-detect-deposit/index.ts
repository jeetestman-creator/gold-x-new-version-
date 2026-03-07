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

  if (!deposit || deposit.network !== 'TRC20') {
    return new Response('Invalid deposit', { status: 400 });
  }

  // TronScan API call
  const apiKey = Deno.env.get('TRONSCAN_API_KEY');
  const url = `https://apilist.tronscanapi.com/api/transaction/\( {tx_hash}?apiKey= \){apiKey}`;

  const res = await fetch(url);
  const tx = await res.json();

  if (!tx || tx.result !== 'SUCCESS') {
    return new Response('Invalid transaction', { status: 400 });
  }

  // Check if transfer to your wallet & correct amount
  const yourWallet = 'TYourTronAddressHere'; // Replace
  const usdtContract = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';

  const transfers = tx.token_transfers || [];
  const match = transfers.find(t => 
    t.contract_address === usdtContract &&
    t.to_address === yourWallet &&
    Number(t.quant) / 1e6 === deposit.amount
  );

  if (!match) {
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

  // Send email notification
  await fetch('https://your-project.supabase.co/functions/v1/send-deposit-confirmation', {
    method: 'POST',
    body: JSON.stringify({ user_id: deposit.user_id, amount: deposit.amount })
  });

  return new Response('Deposit auto-approved', { status: 200 });
});

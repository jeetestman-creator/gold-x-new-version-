import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

serve(async () => {
  // Fetch all pending deposits
  const { data: pending } = await supabase
    .from('deposits')
    .select('id, tx_hash, network, amount, user_id')
    .eq('status', 'pending')
    .limit(10); // Batch size to avoid rate limit

  if (!pending?.length) return new Response('No pending deposits', { status: 200 });

  for (const dep of pending) {
    let approved = false;

    if (dep.network === 'TRC20') {
      const res = await fetch(`https://apilist.tronscanapi.com/api/transaction/\( {dep.tx_hash}?apiKey= \){Deno.env.get('TRONSCAN_API_KEY')}`);
      const tx = await res.json();

      if (tx.result === 'SUCCESS') {
        const yourWallet = 'TYourTronAddressHere';
        const usdt = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t';
        const match = tx.token_transfers?.find(t => 
          t.contract_address === usdt && t.to_address === yourWallet && Number(t.quant)/1e6 === dep.amount
        );
        if (match) approved = true;
      }
    } else if (dep.network === 'BEP20') {
      const res = await fetch(`https://api.bscscan.com/api?module=account&action=tokentx&contractaddress=0x55d398326f99059ff775485246999027b3197955&address=0xYourBSCWalletHere&startblock=0&endblock=99999999&sort=desc&apikey=${Deno.env.get('BSCSCAN_API_KEY')}`);
      const data = await res.json();

      if (data.status === '1') {
        const tx = data.result.find(t => t.hash.toLowerCase() === dep.tx_hash.toLowerCase());
        if (tx && Number(tx.value)/1e18 === dep.amount) approved = true;
      }
    }

    if (approved) {
      await supabase
        .from('deposits')
        .update({ status: 'approved' })
        .eq('id', dep.id);

      await supabase.rpc('credit_balance', { user_id: dep.user_id, amount: dep.net_amount });

      // Notify user
      await fetch('https://your-project.supabase.co/functions/v1/send-deposit-confirmation', {
        method: 'POST',
        body: JSON.stringify({ user_id: dep.user_id, amount: dep.amount })
      });
    }
  }

  return new Response('Pending deposits checked', { status: 200 });
});

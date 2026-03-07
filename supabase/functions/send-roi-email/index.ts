import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

serve(async (req) => {
  const { user_id, amount } = await req.json();

  const { data: profile } = await supabase.from('profiles').select('email').eq('id', user_id).single();

  // Use Resend API to send email
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: Deno.env.get('FROM_EMAIL'),
      to: profile.email,
      subject: 'Golden Wealth Hub - ROI Credited!',
      html: `<p>Hi! Your ${amount} USDT ROI has been credited. Check dashboard.</p>`
    })
  });

  return new Response('Email sent', { status: 200 });
});

serve(async (req) => {
  const { referred_by, amount } = await req.json(); // amount = 8% of referral deposit

  await supabase.rpc('credit_referral', {
    user_id: referred_by,
    comm_amount: amount,
    level: 1 // or dynamic
  });

  return new Response('Commission credited', { status: 200 });
});

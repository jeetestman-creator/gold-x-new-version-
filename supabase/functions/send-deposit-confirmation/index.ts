// Similar to above — deposit approved ஆனப்போ call பண்ணு
// Body: { user_id, amount, tx_hash }
serve(async (req) => {
  const { user_id, amount, tx_hash } = await req.json();
  // Fetch email & send confirmation
  // ...
  return new Response('Deposit confirmed', { status: 200 });
});

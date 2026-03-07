serve(async (req) => {
  const { user_id, amount } = await req.json();
  // Send "Withdrawal processed" email
  // ...
  return new Response('Withdrawal notified', { status: 200 });
});

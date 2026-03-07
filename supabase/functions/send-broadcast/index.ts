serve(async (req) => {
  const { message } = await req.json();

  const { data: users } = await supabase.from('profiles').select('email').eq('allow_notifications', true);

  for (const u of users) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { /* same as above */ },
      body: JSON.stringify({
        from: Deno.env.get('FROM_EMAIL'),
        to: u.email,
        subject: 'Golden Wealth Hub Update',
        html: `<p>${message}</p>`
      })
    });
  }

  return new Response('Broadcast sent', { status: 200 });
});

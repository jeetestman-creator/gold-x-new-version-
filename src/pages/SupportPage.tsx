import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { format } from 'date-fns';

export default function SupportPage() {
  const { user } = useAuth();

  const = useState('');
  const = useState('');
  const = useState<any[]>([]);
  const = useState(false);

  useEffect(() => {
    if (!user) return;

    fetchTickets();

    // Realtime subscription
    const channel = supabase.channel('tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'support_tickets', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTickets(prev => );
          } else if (payload.eventType === 'UPDATE') {
            setTickets(prev => prev.map(t => t.id === payload.new.id ? payload.new : t));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, );

  const fetchTickets = async () => {
    const { data } = await supabase
      .from('support_tickets')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false });

    setTickets(data || []);
  };

  const handleSubmit = async () => {
    if (!subject.trim() || !message.trim()) return toast.error('Fill all fields');

    setLoading(true);
    try {
      const { error } = await supabase
        .from('support_tickets')
        .insert({
          user_id: user?.id,
          subject,
          message,
          status: 'open'
        });

      if (error) throw error;

      toast.success('Ticket submitted! Admin will reply soon.');
      setSubject('');
      setMessage('');
    } catch (err) {
      toast.error('Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold text-yellow-400 mb-8 text-center">Support / Help</h1>

      {/* New Ticket Form */}
      <section className="bg-gray-800 p-8 rounded-lg mb-12">
        <h2 className="text-2xl font-bold mb-6">Create New Ticket</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Withdrawal issue"
              className="w-full p-4 bg-black border border-gray-600 rounded-lg text-white focus:border-yellow-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your issue..."
              className="w-full h-32 p-4 bg-black border border-gray-600 rounded-lg text-white focus:border-yellow-400 outline-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-yellow-400 text-black px-8 py-3 rounded-lg font-bold hover:bg-yellow-300 transition disabled:opacity-50 w-full md:w-auto"
          >
            {loading ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </div>
      </section>

      {/* Ticket History */}
      <section className="bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6">Your Tickets</h2>

        {tickets.length === 0 ? (
          <p className="text-gray-400">No tickets yet. Create one above!</p>
        ) : (
          <div className="space-y-6">
            {tickets.map(ticket => (
              <div key={ticket.id} className="border-b border-gray-600 pb-6">
                <div className="flex justify-between">
                  <h3 className="font-bold">{ticket.subject}</h3>
                  <span className={`px-3 py-1 rounded text-sm ${ticket.status === 'open' ? 'bg-yellow-500' : ticket.status === 'resolved' ? 'bg-green-600' : 'bg-red-600'}`}>
                    {ticket.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-gray-300 mt-2">{ticket.message}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Created: {format(new Date(ticket.created_at), 'dd MMM yyyy, hh:mm a')}
                </p>
                {ticket.reply && (
                  <div className="mt-4 bg-gray-700 p-4 rounded">
                    <p className="font-bold">Admin Reply:</p>
                    <p>{ticket.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-center text-sm text-gray-500 mt-12">
        For urgent issues, email: support@goldenwealthhub.com
      </p>
    </div>
  );
}

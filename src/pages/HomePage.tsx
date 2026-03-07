import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function HomePage() {
  const testimonials = [
    {
      name: 'Ramesh K',
      text: 'முதல் மாதமே 10% ROI கிடைச்சது! Referral-ல 8% கமிஷன் சூப்பர்.',
      rating: 5
    },
    {
      name: 'Priya M',
      text: 'Crypto deposit எளிதா இருக்கு, withdrawal 48 hrs-ல வந்தது.',
      rating: 4.5
    },
    {
      name: 'Vikram S',
      text: 'Referral lock 30 days தான், ஆனா worth it!',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-6">
          Golden Wealth Hub
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Invest Min 100 USDT • Earn 10% Monthly ROI • Referral 8-4-2-1%
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <Link
            to="/login"
            className="bg-yellow-400 text-black px-10 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition"
          >
            Get Started
          </Link>
          <button
            onClick={() => toast('Watch Demo Video coming soon!')}
            className="border border-yellow-400 px-10 py-4 rounded-lg font-bold hover:bg-yellow-400 hover:text-black transition"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Plan Details */}
      <section className="py-16 px-4 bg-gray-800/50">
        <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">Our Investment Plan</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-black p-8 rounded-lg border border-yellow-500 hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">Minimum Deposit</h3>
            <p className="text-4xl mb-4">100 USDT</p>
            <ul className="text-sm space-y-2">
              <li>✓ TRC-20 / BEP-20</li>
              <li>✓ 5% Deposit Fee</li>
              <li>✓ Auto ROI Credit</li>
            </ul>
          </div>

          <div className="bg-black p-8 rounded-lg border border-yellow-500 hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">Monthly ROI</h3>
            <p className="text-4xl mb-4">10%</p>
            <ul className="text-sm space-y-2">
              <li>✓ No Compounding</li>
              <li>✓ Payout on Admin Date</li>
              <li>✓ 5% Withdrawal Fee</li>
            </ul>
          </div>

          <div className="bg-black p-8 rounded-lg border border-yellow-500 hover:scale-105 transition">
            <h3 className="text-2xl font-bold mb-4">Referral Commission</h3>
            <p className="text-4xl mb-4">8-4-2-1%</p>
            <ul className="text-sm space-y-2">
              <li>✓ Level 1: 8%</li>
              <li>✓ Level 2: 4%</li>
              <li>✓ 30 Days Lock on Bonus</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-yellow-400">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-gray-800 p-6 rounded-lg">
              <p className="text-gray-300 mb-4">"{t.text}"</p>
              <p className="font-bold">{t.name}</p>
              <p className="text-yellow-400">{'★'.repeat(Math.floor(t.rating))} {t.rating % 1 !== 0 ? '½' : ''}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-20 px-4 text-center bg-yellow-400 text-black">
        <h2 className="text-4xl font-bold mb-6">Ready to Grow Your Wealth?</h2>
        <Link
          to="/login"
          className="bg-black text-yellow-400 px-12 py-5 rounded-lg font-bold text-xl hover:bg-gray-900 transition"
        >
          Join Now – Free Sign Up
        </Link>
        <p className="mt-6 text-sm">Terms apply. Invest wisely.</p>
      </section>
    </div>
  );
}

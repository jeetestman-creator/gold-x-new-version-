import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-black text-yellow-400 p-4">
      <div className="flex justify-between">
        <Link to="/" className="font-bold">Golden Wealth Hub</Link>
        <div>
          <Link to="/dashboard" className="mx-2">Dashboard</Link>
          <Link to="/privacy" className="mx-2">Privacy</Link>
          <Link to="/support" className="mx-2">Support</Link>
          {user ? (
            <>
              <span className="mx-2">Welcome, {user.email}</span>
              <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
}

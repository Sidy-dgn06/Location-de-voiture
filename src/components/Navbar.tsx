
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getSession, logout } from '../utils/auth';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();
  const session   = getSession();
  const { totalItems } = useCart();

  const navLink = (path: string) =>
    location.pathname === path
      ? 'text-amber-400 font-semibold transition-colors'
      : 'text-gray-200 hover:text-amber-400 transition-colors';

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="bg-blue-900 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-black text-lg">C</span>
            </div>
            <span className="text-white font-bold text-xl tracking-wide">
              Car<span className="text-amber-400">Rent</span>
            </span>
          </Link>

          {/* Liens desktop */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className={navLink('/')}>Accueil</Link>
            <a href="/#vehicules" className="text-gray-200 hover:text-amber-400 transition-colors">Véhicules</a>
            <a href="/#contact" className="text-gray-200 hover:text-amber-400 transition-colors">Contact</a>
          </div>

          {/* Auth + panier desktop */}
          <div className="hidden md:flex items-center gap-3">

            {/* Icône panier */}
            <Link to="/cart" className="relative text-gray-200 hover:text-amber-400 transition-colors p-2">
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-400 text-blue-900 text-xs font-black rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {session ? (
              <>
                {session.role === 'admin' && (
                  <Link to="/dashboard" className="text-gray-200 hover:text-amber-400 transition-colors text-sm font-medium">
                    Dashboard
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm">
                    {session.fullName.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-200 text-sm">{session.fullName.split(' ')[0]}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="border border-gray-400 hover:border-red-400 hover:text-red-400 text-gray-300 px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-200 hover:text-amber-400 transition-colors text-sm font-medium">
                  Connexion
                </Link>
                <Link to="/register" className="bg-amber-400 hover:bg-amber-500 text-blue-900 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                  S'inscrire
                </Link>
              </>
            )}
          </div>

          {/* Burger mobile */}
          <div className="md:hidden flex items-center gap-3">
            <Link to="/cart" className="relative text-white p-1">
              <span className="text-xl">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-blue-900 text-xs font-black rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-white p-2 flex flex-col gap-1.5"
              aria-label="Menu"
            >
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-blue-800 px-4 py-4 flex flex-col gap-4">
          <Link to="/" className="text-gray-200 hover:text-amber-400 transition-colors" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <a href="/#vehicules" className="text-gray-200 hover:text-amber-400 transition-colors" onClick={() => setMenuOpen(false)}>Véhicules</a>
          <Link to="/cart" className="text-gray-200 hover:text-amber-400 transition-colors" onClick={() => setMenuOpen(false)}>
            Panier {totalItems > 0 && `(${totalItems})`}
          </Link>
          {session ? (
            <>
              {session.role === 'admin' && (
                <Link to="/dashboard" className="text-gray-200 hover:text-amber-400 transition-colors" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              )}
              <p className="text-blue-300 text-sm">{session.fullName}</p>
              <button onClick={() => { handleLogout(); setMenuOpen(false); }} className="text-red-400 text-left text-sm font-semibold">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-200 hover:text-amber-400 transition-colors" onClick={() => setMenuOpen(false)}>Connexion</Link>
              <Link to="/register" className="bg-amber-400 text-blue-900 px-4 py-2 rounded-xl text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>S'inscrire</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

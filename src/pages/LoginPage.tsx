import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  // États du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation simple
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    setLoading(true);

    // Simulation d'une connexion (en vrai, appel API ici)
    setTimeout(() => {
      setLoading(false);
      // Rediriger vers le dashboard après connexion
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Colonne gauche — image décorative */}
      <div className="hidden lg:flex flex-1 bg-blue-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-blue-800"></div>
        <div className="relative z-10 text-center px-12">
          <div className="w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-blue-900 font-black text-4xl">C</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Bienvenue sur CarRent</h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Connectez-vous pour accéder à vos réservations et gérer votre compte.
          </p>
          <img
            src="https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&q=80"
            alt="Voiture"
            className="mt-10 rounded-2xl opacity-60 w-full max-w-sm mx-auto"
          />
        </div>
      </div>

      {/* Colonne droite — formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* En-tête */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4 lg:hidden">
              <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
                <span className="text-amber-400 font-black text-xl">C</span>
              </div>
              <span className="text-blue-900 font-bold text-2xl">Car<span className="text-amber-400">Rent</span></span>
            </div>
            <h1 className="text-2xl font-black text-blue-900">Se connecter</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-amber-500 font-semibold hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Formulaire */}
          <div className="bg-white rounded-3xl shadow-lg p-8">
            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="exemple@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  required
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Votre mot de passe"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 text-sm"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* Mot de passe oublié */}
              <div className="text-right">
                <Link
                  to="/reset-password"
                  className="text-sm text-blue-600 hover:text-amber-500 font-medium transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>

              {/* Bouton soumettre */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-900 hover:bg-blue-800 text-white hover:scale-[1.02] shadow-md'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Connexion...
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>
            </form>

            {/* Séparateur */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-200"></div>
              <span className="px-4 text-xs text-gray-400">ou continuer avec</span>
              <div className="flex-1 border-t border-gray-200"></div>
            </div>

            {/* Bouton Google (décoratif) */}
            <button className="w-full border border-gray-200 hover:bg-gray-50 py-3 rounded-xl flex items-center justify-center gap-3 transition-colors text-sm font-medium text-gray-700">
              <span className="text-lg">🔵</span>
              Continuer avec Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// src/pages/RegisterPage.tsx
// Personne 2 — feature/auth-pages

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../utils/auth';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

function getPasswordStrength(pwd: string): { label: string; color: string; width: string } {
  if (pwd.length === 0) return { label: '', color: '', width: '0%' };
  if (pwd.length < 4)   return { label: 'Très faible', color: 'bg-red-500',    width: '20%' };
  if (pwd.length < 6)   return { label: 'Faible',      color: 'bg-orange-400', width: '40%' };
  if (pwd.length < 8)   return { label: 'Moyen',       color: 'bg-yellow-400', width: '60%' };
  if (/[A-Z]/.test(pwd) && /[0-9]/.test(pwd))
                        return { label: 'Fort',         color: 'bg-green-500',  width: '100%' };
  return                       { label: 'Bien',         color: 'bg-blue-500',   width: '80%' };
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword]     = useState(false);
  const [showConfirm,  setShowConfirm]      = useState(false);
  const [error,        setError]            = useState('');
  const [loading,      setLoading]          = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const { fullName, email, phone, password, confirmPassword } = form;

    if (!fullName.trim() || !email.trim() || !phone.trim() || !password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);
    const result = register(fullName.trim(), email.trim(), phone.trim(), password);
    setLoading(false);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate('/');
  }

  const strength = getPasswordStrength(form.password);
  const passwordMismatch = form.confirmPassword.length > 0 && form.password !== form.confirmPassword;

  return (
    <div className="min-h-[calc(100vh-64px)] flex">

      {/* Côté gauche décoratif */}
      <div className="hidden lg:flex flex-1 bg-blue-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-blue-800" />
        <div className="relative z-10 text-center px-12 max-w-md">
          <div className="w-24 h-24 bg-amber-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-blue-900 font-black text-4xl">C</span>
          </div>
          <h2 className="text-3xl font-black text-white mb-4">Rejoignez CarRent</h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-10">
            Créez votre compte gratuitement et accédez à nos véhicules.
          </p>
          <div className="space-y-3 text-left">
            {[
              "✅ Réservation en 2 minutes",
              "✅ Aucun frais d'inscription",
              "✅ Annulation gratuite 24h avant",
              "✅ Support disponible 7j/7",
            ].map((item) => (
              <p key={item} className="text-blue-200 text-sm">{item}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Logo mobile */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-amber-400 font-black text-xl">C</span>
            </div>
            <span className="text-blue-900 font-bold text-2xl">
              Car<span className="text-amber-400">Rent</span>
            </span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-black text-blue-900">Créer un compte</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Déjà inscrit ?{' '}
              <Link to="/login" className="text-amber-500 font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
                ⚠️ {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Nom */}
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  placeholder="Ex: Moussa Diallo"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Adresse email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                  required
                />
              </div>

              {/* Téléphone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Numéro de téléphone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+221 77 000 00 00"
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
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Minimum 6 caractères"
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label="Afficher le mot de passe"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
                {form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                        style={{ width: strength.width }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Force : <span className="font-semibold">{strength.label}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Confirmer mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Répétez votre mot de passe"
                    className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all ${
                      passwordMismatch
                        ? 'border-red-300 focus:ring-red-400'
                        : 'border-gray-200 focus:ring-blue-500'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    aria-label="Afficher la confirmation"
                  >
                    {showConfirm ? '🙈' : '👁️'}
                  </button>
                </div>
                {passwordMismatch && (
                  <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>

              <p className="text-xs text-gray-400 text-center pt-1">
                En créant un compte, vous acceptez nos{' '}
                <span className="text-blue-600 cursor-pointer hover:underline">Conditions d'utilisation</span>.
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                  loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-900 hover:bg-blue-800 text-white shadow-md'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création en cours...
                  </span>
                ) : (
                  'Créer mon compte'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword, getUsers } from '../utils/auth';

type Step = 1 | 2 | 3;

function StepIndicator({ current }: { current: Step }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {([1, 2, 3] as Step[]).map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              current === s
                ? 'bg-blue-900 text-white scale-110'
                : current > s
                ? 'bg-amber-400 text-blue-900'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {current > s ? '✓' : s}
          </div>
          {s < 3 && (
            <div className={`w-10 h-0.5 ${current > s ? 'bg-amber-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function ResetPasswordPage() {
  const [step,            setStep]            = useState<Step>(1);
  const [email,           setEmail]           = useState('');
  const [code,            setCode]            = useState(['', '', '', '', '', '']);
  const [newPassword,     setNewPassword]     = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew,         setShowNew]         = useState(false);
  const [showConfirm,     setShowConfirm]     = useState(false);
  const [error,           setError]           = useState('');
  const [loading,         setLoading]         = useState(false);
  const [success,         setSuccess]         = useState(false);

  // Étape 1 : vérifier que l'email existe
  function handleSendEmail(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!email.trim()) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }
    const users = getUsers();
    const exists = users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!exists) {
      setError('Aucun compte trouvé avec cet email.');
      return;
    }
    setLoading(true);
    // Simulation d'envoi d'email (1.5s)
    setTimeout(() => { setLoading(false); setStep(2); }, 1500);
  }

  // Étape 2 : code OTP (on accepte n'importe quel code à 6 chiffres)
  function handleCodeChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...code];
    next[index] = value;
    setCode(next);
    if (value && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      if (el) (el as HTMLInputElement).focus();
    }
  }

  function handleVerifyCode(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (code.some((c) => c === '')) {
      setError('Veuillez entrer le code complet à 6 chiffres.');
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1200);
  }

  // Étape 3 : nouveau mot de passe
  function handleResetPassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    if (!newPassword || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setLoading(true);
    const result = resetPassword(email.trim(), newPassword);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
      return;
    }
    setSuccess(true);
  }

  // Écran de succès
  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-3xl shadow-lg p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">✅</span>
          </div>
          <h2 className="text-2xl font-black text-blue-900 mb-3">Mot de passe réinitialisé !</h2>
          <p className="text-gray-500 mb-8">
            Votre mot de passe a été modifié avec succès. Vous pouvez maintenant vous connecter.
          </p>
          <Link
            to="/login"
            className="block w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-2xl font-bold text-lg transition-colors text-center"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">

      {/* Côté gauche */}
      <div className="hidden lg:flex flex-1 bg-blue-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-blue-800" />
        <div className="relative z-10 text-center px-12 max-w-sm">
          <div className="text-8xl mb-8">🔐</div>
          <h2 className="text-3xl font-black text-white mb-4">Réinitialisation</h2>
          <p className="text-blue-200 text-lg leading-relaxed mb-10">
            Suivez les 3 étapes pour récupérer l'accès à votre compte.
          </p>
          <div className="space-y-4 text-left">
            {[
              { s: '1', t: 'Entrez votre email' },
              { s: '2', t: 'Vérifiez votre code' },
              { s: '3', t: 'Créez un nouveau mot de passe' },
            ].map((item) => (
              <div key={item.s} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs flex-shrink-0">
                  {item.s}
                </div>
                <p className="text-blue-200 text-sm">{item.t}</p>
              </div>
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

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <StepIndicator current={step} />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
                ⚠️ {error}
              </div>
            )}

            {/* ÉTAPE 1 */}
            {step === 1 && (
              <form onSubmit={handleSendEmail} className="space-y-5">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-black text-blue-900">Mot de passe oublié ?</h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Entrez votre email pour recevoir un code de vérification.
                  </p>
                </div>
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Adresse email
                  </label>
                  <input
                    id="reset-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="exemple@email.com"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                    loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 text-white shadow-md'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : 'Envoyer le code'}
                </button>
                <p className="text-center text-sm text-gray-500">
                  <Link to="/login" className="text-blue-600 hover:text-amber-500 font-medium transition-colors">
                    ← Retour à la connexion
                  </Link>
                </p>
              </form>
            )}

            {/* ÉTAPE 2 */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-black text-blue-900">Vérification</h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Code envoyé à <span className="font-semibold text-blue-900">{email}</span>
                  </p>
                </div>
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 text-gray-900 transition-all"
                    />
                  ))}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                    loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 text-white shadow-md'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Vérification...
                    </span>
                  ) : 'Vérifier le code'}
                </button>
                <p className="text-center text-sm text-gray-500">
                  Pas reçu ?{' '}
                  <button type="button" onClick={() => setStep(1)} className="text-amber-500 font-semibold hover:underline">
                    Renvoyer
                  </button>
                </p>
              </form>
            )}

            {/* ÉTAPE 3 */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-black text-blue-900">Nouveau mot de passe</h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Choisissez un mot de passe sécurisé.
                  </p>
                </div>
                <div>
                  <label htmlFor="new-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                      required
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                      {showNew ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>
                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Répétez votre mot de passe"
                      className={`w-full px-4 py-3 pr-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all ${
                        confirmPassword && newPassword !== confirmPassword
                          ? 'border-red-300 focus:ring-red-400'
                          : 'border-gray-200 focus:ring-blue-500'
                      }`}
                      required
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                      {showConfirm ? '🙈' : '👁️'}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                    loading ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800 text-white shadow-md'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Enregistrement...
                    </span>
                  ) : 'Enregistrer le mot de passe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

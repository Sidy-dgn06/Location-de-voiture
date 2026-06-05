import { useState } from 'react';
import { Link } from 'react-router-dom';

// Cette page a 3 étapes :
//  L'utilisateur entre son email
//  L'utilisateur entre le code reçu par email
//  L'utilisateur entre son nouveau mot de passe

type Step = 1 | 2 | 3;

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // --- Étape 1 : Envoi de l'email ---
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Veuillez entrer votre adresse email.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(2);
    }, 1500);
  };

  // --- Étape 2 : Vérification du code OTP ---
  const handleCodeChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return; // Seulement les chiffres
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    // Passer automatiquement au champ suivant
    if (value && index < 5) {
      const nextInput = document.getElementById(code-${index + 1});
      nextInput?.focus();
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (code.some((c) => c === '')) {
      setError('Veuillez entrer le code complet à 6 chiffres.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 1200);
  };

  // ---  Nouveau mot de p
  const handleResetPassword = (e: React.FormEvent) => {
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
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  // Indicateur d'étapes
  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
              step === s
                ? 'bg-blue-900 text-white scale-110'
                : step > s
                ? 'bg-amber-400 text-blue-900'
                : 'bg-gray-200 text-gray-400'
            }`}
          >
            {step > s ? '✓' : s}
          </div>
          {s < 3 && (
            <div className={w-10 h-0.5 ${step > s ? 'bg-amber-400' : 'bg-gray-200'}}></div>
          )}
        </div>
      ))}
    </div>
  );

  // --- Succès final ---
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
            className="block w-full bg-blue-900 hover:bg-blue-800 text-white py-4 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] shadow-md text-center"
          >
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Colonne gauche — décorative */}
      <div className="hidden lg:flex flex-1 bg-blue-900 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 to-blue-800"></div>
        <div className="relative z-10 text-center px-12">
          <div className="text-8xl mb-8">🔐</div>
          <h2 className="text-3xl font-black text-white mb-4">Réinitialisation</h2>
          <p className="text-blue-200 text-lg leading-relaxed max-w-sm mx-auto">
            Pas de panique ! Suivez les 3 étapes simples pour récupérer l'accès à votre compte CarRent.
          </p>
          <div className="mt-10 space-y-4 text-left max-w-xs mx-auto">
            {[
              { step: '1', text: 'Entrez votre email' },
              { step: '2', text: 'Vérifiez votre code' },
              { step: '3', text: 'Créez un nouveau mot de passe' },
            ].map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div className="w-7 h-7 bg-amber-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-xs flex-shrink-0">
                  {item.step}
                </div>
                <p className="text-blue-200 text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Colonne droite — formulaire */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="flex items-center justify-center gap-2 mb-6 lg:hidden">
            <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center">
              <span className="text-amber-400 font-black text-xl">C</span>
            </div>
            <span className="text-blue-900 font-bold text-2xl">Car<span className="text-amber-400">Rent</span></span>
          </div>

          <div className="bg-white rounded-3xl shadow-lg p-8">
            <StepIndicator />

            {/* Message d'erreur */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-5">
                ⚠️ {error}
              </div>
            )}

            {/* ===== ÉTAPE 1 : Email ===== */}
            {step === 1 && (
              <form onSubmit={handleSendEmail} className="space-y-5">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-black text-blue-900">Mot de passe oublié ?</h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Entrez votre email, nous vous enverrons un code de vérification.
                  </p>
                </div>

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
                      Envoi en cours...
                    </span>
                  ) : (
                    'Envoyer le code'
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  <Link to="/login" className="text-blue-600 hover:text-amber-500 font-medium transition-colors">
                    ← Retour à la connexion
                  </Link>
                </p>
              </form>
            )}

            {/* ===== ÉTAPE 2 : Code OTP ===== */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-black text-blue-900">Vérification</h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Un code à 6 chiffres a été envoyé à{' '}
                    <span className="font-semibold text-blue-900">{email}</span>
                  </p>
                </div>

                {/* Champs OTP */}
                <div className="flex gap-2 justify-center">
                  {code.map((digit, index) => (
                    <input
                      key={index}
                      id={code-${index}}
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
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-900 hover:bg-blue-800 text-white hover:scale-[1.02] shadow-md'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Vérification...
                    </span>
                  ) : (
                    'Vérifier le code'
                  )}
                </button>

                <p className="text-center text-sm text-gray-500">
                  Vous n'avez pas reçu de code ?{' '}
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-amber-500 font-semibold hover:underline"
                  >
                    Renvoyer
                  </button>
                </p>
              </form>
            )}

            {/* ===== ÉTAPE 3 : Nouveau mot de passe ===== */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="text-center mb-6">
                  <h1 className="text-2xl font-black text-blue-900">Nouveau mot de passe</h1>
                  <p className="text-gray-500 text-sm mt-2">
                    Choisissez un nouveau mot de passe sécurisé pour votre compte.
                  </p>
                </div>

                {/* Nouveau mot de passe */}
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimum 6 caractères"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showNew ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* Confirmer mot de passe */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
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
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
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
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-900 hover:bg-blue-800 text-white hover:scale-[1.02] shadow-md'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Enregistrement...
                    </span>
                  ) : (
                    'Enregistrer le mot de passe'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



import { Navigate } from 'react-router-dom';
import { getSession } from '../utils/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const session = getSession();

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && session.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
        <div className="text-7xl mb-6">🚫</div>
        <h1 className="text-3xl font-black text-blue-900 mb-3">Accès refusé</h1>
        <p className="text-gray-500 mb-2 max-w-md">
          Vous n'avez pas les permissions pour accéder au tableau de bord.
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Cette section est réservée aux administrateurs CarRent.
        </p>
        <a
          href="/"
          className="bg-amber-400 hover:bg-amber-500 text-blue-900 px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Retour à l'accueil
        </a>
      </div>
    );
  }

  return <>{children}</>;
}
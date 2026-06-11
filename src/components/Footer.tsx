import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer id="contact" className="bg-blue-950 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Logo + description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 bg-amber-400 rounded-full flex items-center justify-center">
              <span className="text-blue-900 font-black text-lg">C</span>
            </div>
            <span className="text-white font-bold text-xl">
              Car<span className="text-amber-400">Rent</span>
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            Votre partenaire de confiance pour la location de véhicules au Sénégal.
            Des véhicules récents, un service de qualité, des prix compétitifs.
          </p>
        </div>

        {/* Liens rapides */}
        <div>
          <h4 className="text-white font-semibold mb-4">Liens rapides</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-amber-400 transition-colors">Accueil</Link></li>
            <li><Link to="/login" className="hover:text-amber-400 transition-colors">Connexion</Link></li>
            <li><Link to="/register" className="hover:text-amber-400 transition-colors">Inscription</Link></li>
            <li><Link to="/dashboard" className="hover:text-amber-400 transition-colors">Tableau de bord</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-semibold mb-4">Contact</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>📍 Dakar, Sénégal</li>
            <li>📞 +221 77 000 00 00</li>
            <li>✉️ contact@carrent.sn</li>
            <li>🕘 Lun - Sam : 8h - 20h</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-blue-800 text-center py-4 text-xs text-gray-500">
        © 2025 CarRent. Tous droits réservés. Projet UNIPRO — Dev Web Frontend.
      </div>
    </footer>
  );
}



import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CarCard from '../components/CarCard';
import { cars, testimonials } from '../data/mockData';
import { useCart } from '../context/CartContext';
import type { Car } from '../types';

export default function LandingPage() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [reservationModal, setReservationModal] = useState<{ isOpen: boolean; car: Car | null }>({
    isOpen: false,
    car: null,
  });
  const [reservationDates, setReservationDates] = useState<{ startDate: string; endDate: string }>({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  });
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  // Filtrer les voitures par catégorie
  const filteredCars =
    selectedCategory === 'tous'
      ? cars
      : cars.filter((car) => car.category === selectedCategory);

  const handleReserve = (car: Car) => {
    // Ouvrir le modal de réservation
    setReservationModal({ isOpen: true, car });
  };

  const handleConfirmReservation = () => {
    if (reservationModal.car && reservationDates.startDate && reservationDates.endDate) {
      if (reservationDates.startDate >= reservationDates.endDate) {
        alert('La date de fin doit être après la date de début');
        return;
      }
      
      // Ajouter la voiture au panier avec les dates choisies
      addItem(reservationModal.car, reservationDates.startDate, reservationDates.endDate);

      // Afficher la notification de succès
      setNotification({
        show: true,
        message: `${reservationModal.car.brand} ${reservationModal.car.model} a été ajoutée au panier ! 🎉`,
      });

      // Fermer le modal
      setReservationModal({ isOpen: false, car: null });

      // Réinitialiser les dates
      setReservationDates({
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      });

      // Masquer la notification après 3 secondes
      setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 3000);
    }
  };

  const handleCloseModal = () => {
    setReservationModal({ isOpen: false, car: null });
  };

  const categories = [
    { key: 'tous', label: 'Tous' },
    { key: 'economique', label: 'Économique' },
    { key: 'confort', label: 'Confort' },
    { key: 'suv', label: 'SUV' },
    { key: 'luxe', label: 'Luxe' },
  ];

  return (
    <div>
      {/* ===== NOTIFICATION ===== */}
      {notification.show && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-lg animate-fade-in z-50">
          {notification.message}
        </div>
      )}

      {/* ===== MODAL RÉSERVATION ===== */}
      {reservationModal.isOpen && reservationModal.car && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-blue-900">Réservez votre voiture</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Détails voiture */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <div className="flex gap-4">
                <img
                  src={reservationModal.car.image}
                  alt={`${reservationModal.car.brand} ${reservationModal.car.model}`}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div>
                  <h3 className="font-bold text-gray-900">
                    {reservationModal.car.brand} {reservationModal.car.model}
                  </h3>
                  <p className="text-sm text-gray-500">{reservationModal.car.year}</p>
                  <p className="text-lg font-bold text-blue-900 mt-2">
                    {reservationModal.car.price.toLocaleString('fr-FR')} FCFA/jour
                  </p>
                </div>
              </div>
            </div>

            {/* Sélection des dates */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de départ
                </label>
                <input
                  type="date"
                  value={reservationDates.startDate}
                  onChange={(e) =>
                    setReservationDates({ ...reservationDates, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date de retour
                </label>
                <input
                  type="date"
                  value={reservationDates.endDate}
                  onChange={(e) =>
                    setReservationDates({ ...reservationDates, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Calcul du prix */}
            {reservationDates.startDate && reservationDates.endDate && reservationDates.startDate < reservationDates.endDate && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">
                  {Math.ceil(
                    (new Date(reservationDates.endDate).getTime() -
                      new Date(reservationDates.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{' '}
                  jour(s)
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {(
                    reservationModal.car.price *
                    Math.ceil(
                      (new Date(reservationDates.endDate).getTime() -
                        new Date(reservationDates.startDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )
                  ).toLocaleString('fr-FR')}{' '}
                  FCFA
                </p>
              </div>
            )}

            {/* Boutons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmReservation}
                className="flex-1 px-4 py-3 bg-amber-400 hover:bg-amber-500 text-blue-900 rounded-lg font-semibold transition-colors"
              >
                Ajouter au panier
              </button>
            </div>

            {/* Lien vers panier */}
            <button
              onClick={() => navigate('/cart')}
              className="w-full mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-800 font-semibold"
            >
              Voir mon panier →
            </button>
          </div>
        </div>
      )}
      {/* ===== SECTION HERO ===== */}
      <section
        className="relative bg-blue-900 text-white overflow-hidden"
        style={{ minHeight: '85vh' }}
      >
        {/* Fond décoratif */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 opacity-90"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-400 rounded-full opacity-10 blur-3xl"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col lg:flex-row items-center gap-12">
          {/* Texte */}
          <div className="flex-1 text-center lg:text-left">
            <span className="inline-block bg-amber-400 text-blue-900 text-xs font-bold px-4 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              🚗 Location de voitures au Sénégal
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight mb-6">
              Louez votre
              <span className="text-amber-400 block">voiture idéale</span>
              en quelques clics
            </h1>
            <p className="text-lg text-blue-200 mb-8 max-w-lg mx-auto lg:mx-0">
              Plus de 50 véhicules disponibles à Dakar et dans les grandes villes du Sénégal.
              Des prix compétitifs, un service irréprochable.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#vehicules"
                className="bg-amber-400 hover:bg-amber-500 text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg text-center"
              >
                Voir les véhicules
              </a>
              <button
                onClick={() => navigate('/register')}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all text-center"
              >
                S'inscrire gratuitement
              </button>
            </div>

            {/* Stats rapides */}
            <div className="flex gap-8 justify-center lg:justify-start mt-12">
              {[
                { value: '50+', label: 'Véhicules' },
                { value: '500+', label: 'Clients' },
                { value: '4.8★', label: 'Note moyenne' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-amber-400">{stat.value}</p>
                  <p className="text-xs text-blue-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image voiture hero */}
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-amber-400 opacity-20 absolute top-4 left-4"></div>
              <img
                src="https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80"
                alt="Voiture de luxe"
                className="relative z-10 w-80 lg:w-[480px] object-contain drop-shadow-2xl rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION AVANTAGES ===== */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-blue-900 mb-3">Pourquoi choisir CarRent ?</h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Nous offrons la meilleure expérience de location de voiture au Sénégal
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: '🚗',
                title: 'Flotte moderne',
                desc: 'Véhicules récents, bien entretenus et climatisés pour votre confort',
              },
              {
                icon: '💰',
                title: 'Prix compétitifs',
                desc: 'Les meilleurs tarifs du marché sans frais cachés ni mauvaises surprises',
              },
              {
                icon: '📍',
                title: 'Livraison à domicile',
                desc: 'Nous livrons votre véhicule où vous voulez à Dakar et environs',
              },
              {
                icon: '🛡️',
                title: 'Assurance incluse',
                desc: 'Tous nos véhicules sont assurés. Conduisez en toute sérénité',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="text-center p-6 rounded-2xl hover:bg-blue-50 transition-colors group"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-blue-900 mb-2 group-hover:text-amber-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION VÉHICULES ===== */}
      <section id="vehicules" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-blue-900 mb-3">Nos véhicules disponibles</h2>
            <p className="text-gray-500">Choisissez parmi notre large sélection de véhicules</p>
          </div>

          {/* Filtres catégories */}
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat.key
                    ? 'bg-blue-900 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-blue-50 border border-gray-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grille voitures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} onReserve={handleReserve} />
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg">Aucun véhicule dans cette catégorie pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION TÉMOIGNAGES ===== */}
      <section className="py-20 bg-blue-900">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-black text-white mb-3">Ce que disent nos clients</h2>
            <p className="text-blue-300">Des milliers de clients satisfaits nous font confiance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-blue-800 rounded-2xl p-6 hover:bg-blue-700 transition-colors">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <span key={i} className="text-amber-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-blue-100 text-sm leading-relaxed mb-6 italic">
                  "{t.comment}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-blue-900 font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-blue-400 text-xs">{t.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION CTA FINAL ===== */}
      <section className="py-20 bg-amber-400">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-blue-900 mb-4">
            Prêt à prendre la route ?
          </h2>
          <p className="text-blue-800 mb-8 text-lg">
            Inscrivez-vous gratuitement et réservez votre voiture en moins de 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
            >
              Créer un compte gratuit
            </button>
            <button
              onClick={() => navigate('/login')}
              className="bg-white hover:bg-gray-100 text-blue-900 px-8 py-4 rounded-2xl font-bold text-lg transition-all border-2 border-blue-900"
            >
              Se connecter
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

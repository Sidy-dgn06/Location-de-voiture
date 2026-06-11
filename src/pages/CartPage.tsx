import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart } = useCart();

  // Calculer le prix total
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const startDate = new Date(item.startDate);
      const endDate = new Date(item.endDate);
      const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
      return total + item.car.price * days;
    }, 0);
  };

  const handleCheckout = () => {
    const total = calculateTotal();
    // URL fournie pour Wave
    const base = 'https://pay.wave.com/m/M_sn_3hqqkojGKpSn/c/sn/';

    // Construire des paramètres (Wave peut ignorer des params non supportés)
    const params = new URLSearchParams({
      amount: Math.round(total).toString(),
      description: `Reservation de ${items.length} véhicule(s) - ${new Date().toLocaleDateString('fr-FR')}`,
    });

    // Rediriger vers Wave (nouvel onglet)
    window.open(`${base}?${params.toString()}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto py-16 px-4">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Panier de réservation</h1>
        <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-sm text-center">
          <p className="text-gray-600 text-lg mb-6">Votre panier est vide pour le moment.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-amber-400 hover:bg-amber-500 text-blue-900 px-8 py-3 rounded-xl font-semibold transition-colors"
          >
            Continuer les réservations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6 text-blue-900">Panier de réservation</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Liste des réservations */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const startDate = new Date(item.startDate);
            const endDate = new Date(item.endDate);
            const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) || 1;
            const subtotal = item.car.price * days;

            return (
              <div
                key={item.car.id}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-4 p-4">
                  {/* Image */}
                  <div className="sm:w-32 h-32 flex-shrink-0">
                    <img
                      src={item.car.image}
                      alt={`${item.car.brand} ${item.car.model}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  {/* Détails */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-lg text-blue-900">
                          {item.car.brand} {item.car.model}
                        </h3>
                        <p className="text-sm text-gray-500">{item.car.year}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4 my-4 text-sm">
                      <div>
                        <p className="text-gray-500">Départ</p>
                        <p className="font-semibold text-gray-700">
                          {startDate.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Retour</p>
                        <p className="font-semibold text-gray-700">
                          {endDate.toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    {/* Prix et bouton supprimer */}
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">{days} jour(s) × {item.car.price.toLocaleString('fr-FR')} FCFA</p>
                        <p className="text-lg font-bold text-blue-900">
                          {subtotal.toLocaleString('fr-FR')} FCFA
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item.car.id)}
                        className="text-red-500 hover:text-red-700 font-semibold transition-colors text-sm"
                      >
                        ✕ Supprimer
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Résumé */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 h-fit sticky top-4">
          <h2 className="font-bold text-lg text-blue-900 mb-4">Résumé de votre réservation</h2>

          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Nombre de véhicules</span>
              <span className="font-semibold text-gray-900">{items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Sous-total</span>
              <span className="font-semibold text-gray-900">
                {calculateTotal().toLocaleString('fr-FR')} FCFA
              </span>
            </div>
          </div>

          <div className="flex justify-between text-lg font-bold text-blue-900 mb-6">
            <span>Total</span>
            <span>{calculateTotal().toLocaleString('fr-FR')} FCFA</span>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold py-3 rounded-xl transition-colors mb-3"
          >
            Procéder à la réservation
          </button>

          <button
            onClick={clearCart}
            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors"
          >
            Vider le panier
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 bg-transparent border-2 border-gray-300 hover:border-blue-900 text-blue-900 font-semibold py-3 rounded-xl transition-colors"
          >
            Continuer les réservations
          </button>
        </div>
      </div>
    </div>
  );
}

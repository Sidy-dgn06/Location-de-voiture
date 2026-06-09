
import type { Car } from '../types';

interface CarCardProps {
    car: Car;
    onReserve?: (car: Car) => void;
}

// Couleurs par catégorie
const categoryColors: Record<string, string> = {
  economique: 'bg-green-100 text-green-800',
  confort: 'bg-blue-100 text-blue-800',
  luxe: 'bg-yellow-100 text-yellow-800',
  suv: 'bg-purple-100 text-purple-800',
};

// Labels lisibles
const categoryLabels: Record<string, string> = {
  economique: 'Économique',
  confort: 'Confort',
  luxe: 'Luxe',
  suv: 'SUV',
};

export default function CarCard({ car, onReserve }: CarCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={car.image}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        {/* Badge disponibilité */}
        <span
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold ${
            car.available
              ? 'bg-green-500 text-white'
              : 'bg-red-500 text-white'
          }`}
        >
          {car.available ? 'Disponible' : 'Indisponible'}
        </span>
        {/* Badge catégorie */}
        <span
          className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold ${categoryColors[car.category]}`}
        >
          {categoryLabels[car.category]}
        </span>
      </div>

      {/* Contenu */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              {car.brand} {car.model}
            </h3>
            <p className="text-sm text-gray-500">{car.year}</p>
          </div>
          {/* Note */}
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-semibold text-gray-700">{car.rating}</span>
            <span className="text-xs text-gray-400">({car.reviews})</span>
          </div>
        </div>

        {/* Caractéristiques */}
        <div className="grid grid-cols-3 gap-2 my-3 text-center">
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Places</p>
            <p className="text-sm font-semibold text-gray-800">{car.seats}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Boîte</p>
            <p className="text-sm font-semibold text-gray-800 capitalize">
              {car.transmission === 'automatique' ? 'Auto' : 'Manuel'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2">
            <p className="text-xs text-gray-500">Carburant</p>
            <p className="text-sm font-semibold text-gray-800 capitalize">{car.fuel}</p>
          </div>
        </div>

        {/* Prix + bouton */}
        <div className="flex items-center justify-between mt-4">
          <div>
            <span className="text-xl font-bold text-blue-900">
              {car.price.toLocaleString('fr-FR')} FCFA
            </span>
            <span className="text-sm text-gray-500"> / jour</span>
          </div>
          <button
            onClick={() => onReserve?.(car)}
            disabled={!car.available}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              car.available
                ? 'bg-amber-400 hover:bg-amber-500 text-blue-900 cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {car.available ? 'Réserver' : 'Indisponible'}
          </button>
        </div>
      </div>
    </div>
  );
}

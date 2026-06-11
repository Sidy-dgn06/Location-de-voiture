
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number; // prix par jour en FCFA
  category: 'economique' | 'confort' | 'luxe' | 'suv';
  seats: number;
  transmission: 'automatique' | 'manuelle';
  fuel: 'essence' | 'diesel' | 'électrique';
  available: boolean;
  image: string;
  rating: number;
  reviews: number;
}

export interface Reservation {
  id: number;
  carId: number;
  carBrand: string;
  carModel: string;
  clientName: string;
  clientEmail: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'en_cours' | 'terminée' | 'annulée' | 'confirmée';
  pickupLocation: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'client';
}

export interface Testimonial {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface DashboardStats {
  totalReservations: number;
  activeReservations: number;
  availableCars: number;
  totalRevenue: number;
}

import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Car } from '../types';

export interface CartItem {
  car: Car;
  startDate: string;
  endDate: string;
}

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  addItem: (car: Car, startDate: string, endDate: string) => void;
  removeItem: (carId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (car: Car, startDate: string, endDate: string) => {
    setItems((prevItems) => {
      // Vérifier si la voiture est déjà dans le panier
      const existingIndex = prevItems.findIndex((item) => item.car.id === car.id);
      
      if (existingIndex >= 0) {
        // Remplacer l'élément existant
        const newItems = [...prevItems];
        newItems[existingIndex] = { car, startDate, endDate };
        return newItems;
      }
      
      // Ajouter le nouvel élément
      return [...prevItems, { car, startDate, endDate }];
    });
  };

  const removeItem = (carId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.car.id !== carId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const value: CartContextType = {
    items,
    totalItems: items.length,
    addItem,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}

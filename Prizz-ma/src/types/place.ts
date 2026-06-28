export type Place = {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  occupancyRate: number;
  totalSeats: number;
  occupiedSeats: number;
  outletCount: number;
  latitude: number;
  longitude: number;
  hasPriz: boolean;
  isOpen247: boolean;
  hasAffordableCoffee: boolean;
  hasQuietZone: boolean;
  hasAC: boolean;
  coffeePrice: number;
  openTime: string;
  closeTime: string;
  isVisible: boolean;
  adminId: string;
};

export type MapFilterId = 'priz' | '247' | 'coffee';
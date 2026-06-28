import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { collection, doc, onSnapshot, query, where, updateDoc, increment } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export type AmenityKey = 'priz' | 'silent' | 'klima';

type Venue = {
  id: string;
  name: string;
  totalSeats: number;
  occupiedSeats: number;
};

type AdminManagerContextValue = {
  venues: Venue[];
  selectedVenueId: string;
  setSelectedVenueId: (id: string) => void;
  maxCapacity: number;
  emptyCount: number;
  fillSeat: () => Promise<void>;
  freeSeat: () => Promise<void>;
  coffeePrice: string;
  setCoffeePrice: (v: string) => void;
  openTime: Date;
  setOpenTime: (d: Date) => void;
  closeTime: Date;
  setCloseTime: (d: Date) => void;
  amenities: Record<AmenityKey, boolean>;
  toggleAmenity: (key: AmenityKey) => void;
};

const AdminManagerContext = createContext<AdminManagerContextValue | null>(null);

const defaultOpen = new Date();
defaultOpen.setHours(8, 0, 0, 0);
const defaultClose = new Date();
defaultClose.setHours(22, 0, 0, 0);

export function AdminManagerProvider({ children }: { children: ReactNode }) {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [selectedVenueId, setSelectedVenueId] = useState<string>('');
  const [maxCapacity, setMaxCapacity] = useState(50);
  const [emptyCount, setEmptyCount] = useState(0);
  const [coffeePrice, setCoffeePrice] = useState('0');
  const [openTime, setOpenTime] = useState(defaultOpen);
  const [closeTime, setCloseTime] = useState(defaultClose);
  const [amenities, setAmenities] = useState<Record<AmenityKey, boolean>>({
    priz: false,
    silent: false,
    klima: false,
  });

  // Sadece bu adminin mekanlarını çek
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) return;

      const q = query(
        collection(db, 'venues'),
        where('adminId', '==', user.uid)
      );

      const unsubVenues = onSnapshot(q, (snap) => {
        const data = snap.docs.map((d) => ({
          id: d.id,
          name: d.data().name,
          totalSeats: d.data().totalSeats,
          occupiedSeats: d.data().occupiedSeats,
        }));
        setVenues(data);
        if (data.length > 0 && !selectedVenueId) {
          setSelectedVenueId(data[0].id);
        }
      });

      return () => unsubVenues();
    });

    return () => unsubAuth();
  }, []);

  // Seçili mekanı dinle
  useEffect(() => {
    if (!selectedVenueId) return;
    const unsub = onSnapshot(doc(db, 'venues', selectedVenueId), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setMaxCapacity(data.totalSeats ?? 50);
        setEmptyCount((data.totalSeats ?? 50) - (data.occupiedSeats ?? 0));
        setCoffeePrice(String(data.coffeePrice ?? '0'));
        setAmenities({
          priz: data.hasPriz ?? false,
          silent: data.hasQuietZone ?? false,
          klima: data.hasAC ?? false,
        });
      }
    });
    return () => unsub();
  }, [selectedVenueId]);

  const fillSeat = async () => {
    if (!selectedVenueId || emptyCount <= 0) return;
    try {
      const newOccupied = maxCapacity - emptyCount + 1;
      const newRate = Math.round((newOccupied / maxCapacity) * 100);
      await updateDoc(doc(db, 'venues', selectedVenueId), {
        occupiedSeats: increment(1),
        occupancyRate: newRate,
      });
    } catch (error) {
      Alert.alert('Hata', 'Kapasite güncellenemedi.');
    }
  };

  const freeSeat = async () => {
    if (!selectedVenueId || emptyCount >= maxCapacity) return;
    try {
      const newOccupied = maxCapacity - emptyCount - 1;
      const newRate = Math.round((newOccupied / maxCapacity) * 100);
      await updateDoc(doc(db, 'venues', selectedVenueId), {
        occupiedSeats: increment(-1),
        occupancyRate: newRate,
      });
    } catch (error) {
      Alert.alert('Hata', 'Kapasite güncellenemedi.');
    }
  };

  const toggleAmenity = (key: AmenityKey) => {
    setAmenities((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <AdminManagerContext.Provider
      value={{
        venues,
        selectedVenueId,
        setSelectedVenueId,
        maxCapacity,
        emptyCount,
        fillSeat,
        freeSeat,
        coffeePrice,
        setCoffeePrice,
        openTime,
        setOpenTime,
        closeTime,
        setCloseTime,
        amenities,
        toggleAmenity,
      }}
    >
      {children}
    </AdminManagerContext.Provider>
  );
}

export function useAdminManager() {
  const ctx = useContext(AdminManagerContext);
  if (!ctx) throw new Error('useAdminManager must be used within AdminManagerProvider');
  return ctx;
}
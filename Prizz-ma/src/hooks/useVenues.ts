import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { PLACES } from '../data/places';
import type { Place } from '../types/place';

export function useVenues() {
  const [venues, setVenues] = useState<Place[]>(PLACES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'venues'),
      (snapshot) => {
        const data = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() } as Place))
          .filter((v) => v.isVisible);
        if (data.length > 0) {
          setVenues(data);
        }
        setLoading(false);
      },
      (error) => {
        console.error('Firestore hata:', error);
        setLoading(false);
        // Hata olursa PLACES static data kalır
      },
    );

    return () => unsubscribe();
  }, []);

  return { venues, loading };
}
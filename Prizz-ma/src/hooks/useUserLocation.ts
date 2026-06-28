import { useState, useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import type { Place } from '../types/place';

export interface UserCoords {
  latitude: number;
  longitude: number;
}

export interface NearbyPlace {
  place: Place;
  distanceMeters: number;
}

export interface UseUserLocationReturn {
  userCoords: UserCoords | null;
  nearbyPlace: NearbyPlace | null;
  permissionDenied: boolean;
  isLocating: boolean;
  flyToUser: () => void;
}

const PROXIMITY_THRESHOLD_METERS = 600;

function haversine(a: UserCoords, b: UserCoords): number {
  const R = 6_371_000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const dLat = rad(b.latitude - a.latitude);
  const dLon = rad(b.longitude - a.longitude);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function useUserLocation(places: Place[]): UseUserLocationReturn {
  const [userCoords, setUserCoords] = useState<UserCoords | null>(null);
  const [nearbyPlace, setNearbyPlace] = useState<NearbyPlace | null>(null);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [isLocating, setIsLocating] = useState(true);

  const subRef = useRef<Location.LocationSubscription | null>(null);

  const findNearest = useCallback(
    (coords: UserCoords) => {
      let best: NearbyPlace | null = null;
      for (const p of places) {
        const dist = haversine(coords, { latitude: p.latitude, longitude: p.longitude });
        if (dist <= PROXIMITY_THRESHOLD_METERS) {
          if (!best || dist < best.distanceMeters) {
            best = { place: p, distanceMeters: Math.round(dist) };
          }
        }
      }
      setNearbyPlace(best);
    },
    [places],
  );

  const startWatching = useCallback(async () => {
    setIsLocating(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setPermissionDenied(true);
      setIsLocating(false);
      return;
    }

    try {
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
      console.log('USER COORDS:', coords.latitude, coords.longitude);
      setUserCoords(coords);
      findNearest(coords);
    } catch (_) {}

    subRef.current = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.Balanced, distanceInterval: 10, timeInterval: 5000 },
      (loc) => {
        const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
        console.log('USER COORDS:', coords.latitude, coords.longitude);
        setUserCoords(coords);
        findNearest(coords);
        setIsLocating(false);
      },
    );
  }, [findNearest]);

  useEffect(() => {
    startWatching();
    return () => {
      subRef.current?.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userCoords) findNearest(userCoords);
  }, [places, userCoords, findNearest]);

  return {
    userCoords,
    nearbyPlace,
    permissionDenied,
    isLocating,
    flyToUser: startWatching,
  };
}
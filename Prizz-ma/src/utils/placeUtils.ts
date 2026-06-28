import type { Place } from '../types/place';
import type { MapFilterId } from '../types/place';

export function getMarkerColor(occupancyRate: number): string {
  if (occupancyRate >= 75) return '#FF9500';
  if (occupancyRate >= 50) return '#FFD60A';
  return '#34C759';
}

export function filterPlaces(places: Place[], activeFilters: MapFilterId[]): Place[] {
  if (activeFilters.length === 0) return places;

  return places.filter((place) => {
    if (activeFilters.includes('priz') && !place.hasPriz) return false;
    if (activeFilters.includes('247') && !place.isOpen247) return false;
    if (activeFilters.includes('coffee') && !place.hasAffordableCoffee) return false;
    return true;
  });
}

export function formatPlaceTitle(place: Place): string {
  return `${place.name} - ${place.subtitle}`;
}

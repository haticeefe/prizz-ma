import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { FilterBar } from '../components/map/FilterBar';
import { PlaceDetailCard } from '../components/map/PlaceDetailCard';
import { PowerMarker } from '../components/map/PowerMarker';
import { CAMPUS_CENTER } from '../data/places';
import { minimalMapStyle } from '../constants/mapStyle';
import { useVenues } from '../hooks/useVenues';
import type { MapFilterId, Place } from '../types/place';
import { filterPlaces } from '../utils/placeUtils';

const TAB_BAR_HEIGHT = 64;

export function MapScreen() {
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const venues = useVenues();
  const [activeFilters, setActiveFilters] = useState<MapFilterId[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

  const visiblePlaces = useMemo(
    () => filterPlaces(venues, activeFilters),
    [venues, activeFilters],
  );

  useEffect(() => {
    if (venues.length === 0) return;
    if (!selectedPlace || !venues.some((p) => p.id === selectedPlace.id)) {
      setSelectedPlace(venues[0]);
    }
  }, [venues, selectedPlace]);

  useEffect(() => {
    if (!selectedPlace) return;
    const stillVisible = visiblePlaces.some((p) => p.id === selectedPlace.id);
    if (!stillVisible && visiblePlaces.length > 0) {
      setSelectedPlace(visiblePlaces[0]);
    }
  }, [visiblePlaces, selectedPlace]);

  const handleToggleFilter = useCallback((id: MapFilterId) => {
    setActiveFilters((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id],
    );
  }, []);

  const handleMarkerPress = useCallback((place: Place) => {
    setSelectedPlace(place);
    mapRef.current?.animateToRegion(
      {
        latitude: place.latitude,
        longitude: place.longitude,
        latitudeDelta: 0.006,
        longitudeDelta: 0.006,
      },
      350,
    );
  }, []);

  const cardBottomInset = insets.bottom + TAB_BAR_HEIGHT;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={CAMPUS_CENTER}
        customMapStyle={minimalMapStyle}
        showsUserLocation
        showsMyLocationButton={false}
        showsCompass={false}
        toolbarEnabled={false}
      >
        {visiblePlaces.map((place) => (
          <PowerMarker
            key={place.id}
            place={place}
            selected={selectedPlace?.id === place.id}
            onPress={() => handleMarkerPress(place)}
          />
        ))}
      </MapView>

      <FilterBar
        activeFilters={activeFilters}
        onToggle={handleToggleFilter}
        topInset={insets.top}
      />

      {selectedPlace && (
        <PlaceDetailCard place={selectedPlace} bottomInset={cardBottomInset} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8e8e8',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

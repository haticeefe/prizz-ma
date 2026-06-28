import { StyleSheet, Text, View } from 'react-native';
import { Marker } from 'react-native-maps';
import type { Place } from '../../types/place';

type PowerMarkerProps = {
  place: Place;
  selected: boolean;
  onPress: () => void;
};

function getColor(rate: number): string {
  if (rate < 40) return '#34C759';
  if (rate < 60) return '#FFD60A';
  if (rate < 75) return '#FF9500';
  return '#FF3B30';
}

export function PowerMarker({ place, selected, onPress }: PowerMarkerProps) {
  const color = getColor(place.occupancyRate);

  return (
    <Marker
      coordinate={{ latitude: place.latitude, longitude: place.longitude }}
      onPress={onPress}
      tracksViewChanges={true}
      anchor={{ x: 0.5, y: 1 }}
      zIndex={selected ? 99 : 1}
    >
      <View style={styles.wrapper}>
        <View style={[styles.bubble, { backgroundColor: color, borderColor: selected ? '#00FFFF' : '#fff' }]}>
          <Text style={styles.emoji}>🏠</Text>
          <Text style={styles.rate}>%{place.occupancyRate}</Text>
        </View>
        <View style={[styles.tail, { borderTopColor: selected ? '#00FFFF' : color }]} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  bubble: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 2.5,
    gap: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  emoji: {
    fontSize: 24,
  },
  rate: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
});
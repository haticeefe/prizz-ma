import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type OccupancyBarProps = {
  percent: number;
};

export function OccupancyBar({ percent }: OccupancyBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <View style={styles.wrapper}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Doluluk</Text>
        <Text style={styles.value}>%{clamped}</Text>
      </View>
      <View style={styles.track}>
        <LinearGradient
          colors={['#FFD60A', '#FF9500', '#FF3B30']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[styles.fill, { width: `${clamped}%` }]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.55)',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF9500',
  },
  track: {
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});

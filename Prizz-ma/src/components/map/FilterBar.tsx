import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import type { MapFilterId } from '../../types/place';

const FILTERS: { id: MapFilterId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'priz', label: 'Priz Var', icon: 'flash' },
  { id: '247', label: '7/24', icon: 'time' },
  { id: 'coffee', label: 'Uygun Kahve', icon: 'cafe' },
];

type FilterBarProps = {
  activeFilters: MapFilterId[];
  onToggle: (id: MapFilterId) => void;
  topInset: number;
};

export function FilterBar({ activeFilters, onToggle, topInset }: FilterBarProps) {
  return (
    <View style={[styles.container, { paddingTop: topInset + 10 }]}>
      <BlurView intensity={50} tint="light" style={styles.blur}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >
          {FILTERS.map((filter) => {
            const active = activeFilters.includes(filter.id);
            return (
              <Pressable
                key={filter.id}
                onPress={() => onToggle(filter.id)}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Ionicons
                  name={filter.icon}
                  size={15}
                  color={active ? '#041014' : 'rgba(30, 30, 30, 0.75)'}
                />
                <Text style={[styles.pillText, active && styles.pillTextActive]}>
                  {filter.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 14,
  },
  blur: {
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
  },
  scroll: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  pillActive: {
    backgroundColor: '#00FFFF',
    borderColor: 'rgba(0, 255, 255, 0.5)',
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(30, 30, 30, 0.8)',
  },
  pillTextActive: {
    color: '#041014',
  },
});

import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { CapacityManagerCard } from '../../components/admin/CapacityManagerCard';
import { useAdminManager } from '../../context/AdminManagerContext';
import { colors } from '../../theme/colors';

const TAB_BAR_HEIGHT = 56;

export function AdminCapacityScreen() {
  const insets = useSafeAreaInsets();
  const { venues, selectedVenueId, setSelectedVenueId } = useAdminManager();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Kapasite</Text>
        <Text style={styles.subtitle}>Anlık masa doluluk durumunu yönetin.</Text>

        {/* Mekan Seçici */}
        <Text style={styles.sectionLabel}>Mekan Seç</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.venueScroll}
          contentContainerStyle={styles.venueScrollContent}
        >
          {venues.map((venue) => (
            <Pressable
              key={venue.id}
              style={[
                styles.venueChip,
                selectedVenueId === venue.id && styles.venueChipSelected,
              ]}
              onPress={() => setSelectedVenueId(venue.id)}
            >
              <Text style={[
                styles.venueChipText,
                selectedVenueId === venue.id && styles.venueChipTextSelected,
              ]}>
                {venue.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <CapacityManagerCard />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.adminBackground,
  },
  scroll: {
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  venueScroll: {
    marginBottom: 20,
  },
  venueScrollContent: {
    gap: 8,
    paddingRight: 8,
  },
  venueChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.15)',
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  venueChipSelected: {
    borderColor: colors.cyan,
    backgroundColor: 'rgba(0, 229, 255, 0.12)',
  },
  venueChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  venueChipTextSelected: {
    color: colors.cyan,
  },
});
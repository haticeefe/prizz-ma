import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { OccupancyBar } from './OccupancyBar';
import type { Place } from '../../types/place';
import { formatPlaceTitle } from '../../utils/placeUtils';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../types/auth';

type PlaceDetailCardProps = {
  place: Place;
  bottomInset: number;
};

export function PlaceDetailCard({ place, bottomInset }: PlaceDetailCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const emptySeats = place.totalSeats - place.occupiedSeats;

  return (
    <View style={[styles.container, { paddingBottom: bottomInset + 8 }]}>
      <BlurView intensity={72} tint="dark" style={styles.card}>
        <View style={styles.inner}>

          {/* Başlık + LIVE badge */}
          <View style={styles.titleRow}>
            <Text style={styles.title}>{formatPlaceTitle(place)}</Text>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>

          {/* Puan + Boş masa + Priz */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#FFD60A" />
              <Text style={styles.statValue}>{place.rating.toFixed(1)}</Text>
              <Text style={styles.statLabel}>Priz-ma Puanı</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="people" size={14} color={colors.cyan} />
              <Text style={styles.statValue}>{emptySeats}</Text>
              <Text style={styles.statLabel}>Boş Masa</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="flash" size={14} color="#FBBF24" />
              <Text style={styles.statValue}>{place.outletCount}</Text>
              <Text style={styles.statLabel}>Priz</Text>
            </View>
          </View>

          {/* Doluluk çubuğu */}
          <View>
            <View style={styles.occupancyLabelRow}>
              <Text style={styles.occupancyLabel}>Doluluk Oranı</Text>
              <Text style={[styles.occupancyPct,
                { color: place.occupancyRate >= 75 ? '#F87171' : place.occupancyRate >= 40 ? '#FBBF24' : '#34D399' }
              ]}>
                %{place.occupancyRate} Dolu
              </Text>
            </View>
            <OccupancyBar percent={place.occupancyRate} />
          </View>

          {/* Özellik etiketleri */}
          <View style={styles.tagsRow}>
            {place.hasPriz && (
              <View style={styles.tag}>
                <Ionicons name="flash" size={12} color={colors.cyan} />
                <Text style={styles.tagText}>Priz Var</Text>
              </View>
            )}
            {place.isOpen247 && (
              <View style={styles.tag}>
                <Ionicons name="time" size={12} color={colors.cyan} />
                <Text style={styles.tagText}>7/24</Text>
              </View>
            )}
            {place.hasQuietZone && (
              <View style={styles.tag}>
                <Ionicons name="volume-mute" size={12} color={colors.cyan} />
                <Text style={styles.tagText}>Sessiz</Text>
              </View>
            )}
            {place.hasAC && (
              <View style={styles.tag}>
                <Ionicons name="snow" size={12} color={colors.cyan} />
                <Text style={styles.tagText}>Klima</Text>
              </View>
            )}
            {place.hasAffordableCoffee && (
              <View style={styles.tag}>
                <Ionicons name="cafe" size={12} color={colors.cyan} />
                <Text style={styles.tagText}>Uygun Kahve</Text>
              </View>
            )}
          </View>

          {/* Butonlar */}
          <View style={styles.btnRow}>
            <Pressable
              style={({ pressed }) => [styles.detailBtn, pressed && { opacity: 0.8 }]}
              onPress={() => navigation.navigate('VenueDetail', { venueId: place.id })}
            >
              <Ionicons name="information-circle-outline" size={18} color={colors.cyan} />
              <Text style={styles.detailText}>Detay & Yorum</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [styles.directionBtn, pressed && styles.directionPressed]}
              onPress={() => {
                const { Linking } = require('react-native');
                const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
                Linking.openURL(url);
              }}
            >
              <Ionicons name="navigate" size={18} color="#041014" />
              <Text style={styles.directionText}>Yol Tarifi</Text>
            </Pressable>
          </View>

        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 0,
    zIndex: 10,
  },
  card: {
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: 'rgba(12, 14, 22, 0.82)',
  },
  inner: {
    padding: 18,
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.white,
    letterSpacing: 0.2,
    flex: 1,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F87171',
  },
  liveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F87171',
    letterSpacing: 0.5,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  statValue: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.white,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textMuted,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  occupancyLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  occupancyLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  occupancyPct: {
    fontSize: 12,
    fontWeight: '700',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.cyan,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
  },
  detailBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.cyan,
    borderRadius: 14,
    minHeight: 48,
  },
  detailText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.cyan,
  },
  directionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.cyan,
    borderRadius: 14,
    minHeight: 48,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  directionPressed: {
    opacity: 0.9,
  },
  directionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#041014',
  },
});
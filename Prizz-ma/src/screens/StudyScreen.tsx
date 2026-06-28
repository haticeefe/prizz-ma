import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { colors } from '../theme/colors';
import type { Place } from '../types/place';

export function StudyScreen() {
  const insets = useSafeAreaInsets();
  const [venues, setVenues] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'venues'),
      where('isVisible', '==', true)
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Place[];
      setVenues(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const getOccupancyColor = (rate: number) => {
    if (rate >= 75) return '#F87171';
    if (rate >= 40) return '#FBBF24';
    return '#34D399';
  };

  const renderItem = ({ item }: { item: Place }) => {
    const emptySeats = item.totalSeats - item.occupiedSeats;
    const occColor = getOccupancyColor(item.occupancyRate);

    return (
      <View style={styles.card}>
        {/* Başlık */}
        <View style={styles.cardHeader}>
          <View style={styles.titleBlock}>
            <Text style={styles.venueName}>{item.name}</Text>
            <Text style={styles.venueSubtitle}>{item.subtitle}</Text>
          </View>
          <View style={styles.ratingBadge}>
            <Ionicons name="star" size={12} color="#FFD60A" />
            <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
          </View>
        </View>

        {/* İstatistikler */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="people" size={14} color={colors.cyan} />
            <Text style={styles.statText}>{emptySeats} boş masa</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flash" size={14} color="#FBBF24" />
            <Text style={styles.statText}>{item.outletCount} priz</Text>
          </View>
          <View style={[styles.occBadge, { backgroundColor: `${occColor}20`, borderColor: `${occColor}40` }]}>
            <Text style={[styles.occText, { color: occColor }]}>%{item.occupancyRate}</Text>
          </View>
        </View>

        {/* Doluluk çubuğu */}
        <View style={styles.barBg}>
          <View style={[styles.barFill, {
            width: `${item.occupancyRate}%`,
            backgroundColor: occColor,
          }]} />
        </View>

        {/* Etiketler */}
        <View style={styles.tagsRow}>
          {item.hasPriz && (
            <View style={styles.tag}>
              <Ionicons name="flash" size={11} color={colors.cyan} />
              <Text style={styles.tagText}>Priz Var</Text>
            </View>
          )}
          {item.isOpen247 && (
            <View style={styles.tag}>
              <Ionicons name="time" size={11} color={colors.cyan} />
              <Text style={styles.tagText}>7/24</Text>
            </View>
          )}
          {item.hasQuietZone && (
            <View style={styles.tag}>
              <Ionicons name="volume-mute" size={11} color={colors.cyan} />
              <Text style={styles.tagText}>Sessiz</Text>
            </View>
          )}
          {item.hasAC && (
            <View style={styles.tag}>
              <Ionicons name="snow" size={11} color={colors.cyan} />
              <Text style={styles.tagText}>Klima</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Çalışma Alanları</Text>
        <Text style={styles.subtitle}>{venues.length} mekan bulundu</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : (
        <FlatList
          data={venues}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    marginBottom: 12,
    gap: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleBlock: {
    flex: 1,
  },
  venueName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.white,
  },
  venueSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 214, 10, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  statText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  occBadge: {
    marginLeft: 'auto',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
  },
  occText: {
    fontSize: 12,
    fontWeight: '700',
  },
  barBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 3,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0, 229, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.cyan,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
});
import { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../config/firebase';
import { colors } from '../theme/colors';
import type { Place } from '../types/place';

export function CafesScreen() {
  const insets = useSafeAreaInsets();
  const [cafes, setCafes] = useState<Place[]>([]);
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
      // Sadece kafesi olanları göster
      setCafes(data.filter((v) => v.hasAffordableCoffee || v.coffeePrice > 0));
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
    const occColor = getOccupancyColor(item.occupancyRate);

    return (
      <View style={styles.card}>
        {/* Başlık + fiyat */}
        <View style={styles.cardHeader}>
          <View style={styles.titleBlock}>
            <Text style={styles.venueName}>{item.name}</Text>
            <Text style={styles.venueSubtitle}>{item.subtitle}</Text>
          </View>
          {item.coffeePrice > 0 && (
            <View style={styles.priceBadge}>
              <Ionicons name="cafe" size={14} color={colors.cyan} />
              <Text style={styles.priceText}>₺{item.coffeePrice}</Text>
            </View>
          )}
        </View>

        {/* Saat bilgisi */}
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.infoText}>
            {item.isOpen247 ? '7/24 Açık' : `${item.openTime} - ${item.closeTime}`}
          </Text>
        </View>

        {/* Doluluk */}
        <View style={styles.occupancyRow}>
          <Text style={styles.occupancyLabel}>Doluluk</Text>
          <Text style={[styles.occupancyValue, { color: occColor }]}>
            %{item.occupancyRate}
          </Text>
        </View>
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
          {item.hasAffordableCoffee && (
            <View style={styles.tag}>
              <Ionicons name="cafe" size={11} color={colors.cyan} />
              <Text style={styles.tagText}>Uygun Fiyat</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Text style={styles.title}>Kafeler</Text>
        <Text style={styles.subtitle}>{cafes.length} kafe bulundu</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      ) : cafes.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="cafe-outline" size={48} color={colors.textMuted} />
          <Text style={styles.emptyText}>Kafe bulunamadı</Text>
        </View>
      ) : (
        <FlatList
          data={cafes}
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
  priceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.cyan,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  occupancyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  occupancyLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  occupancyValue: {
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
    gap: 12,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
});
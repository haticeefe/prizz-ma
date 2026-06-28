// src/components/map/ProximityBanner.tsx
// Kullanıcı bir mekana 150m'den yaklaşınca haritanın üstünde
// kayarak gelen animasyonlu banner.
//
// Renk mantığı (mevcut getMarkerColor ile aynı eşikler):
//   occupancyRate < 50  → yeşil  (#34C759)
//   50 ≤ rate < 75      → sarı   (#FFD60A)
//   rate ≥ 75           → turuncu/kırmızı (#FF9500)

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import type { NearbyPlace } from '../../hooks/useUserLocation';
import { getMarkerColor } from '../../utils/placeUtils';

// ─── Tipler ────────────────────────────────────────────────────────────────────

interface ProximityBannerProps {
  nearby: NearbyPlace | null;
  /** Banner'daki "Detay" butonuna basılınca */
  onSelectPlace: (placeId: string) => void;
  /** Kapat (X) butonuna basılınca */
  onDismiss: () => void;
}

// ─── Yardımcılar ───────────────────────────────────────────────────────────────

function occupancyLabel(rate: number): string {
  if (rate < 50) return 'Müsait';
  if (rate < 75) return 'Orta Yoğun';
  return 'Kalabalık';
}

function distanceLabel(meters: number): string {
  if (meters < 30) return 'Hemen yanında';
  if (meters < 100) return `${meters}m yakında`;
  return `~${meters}m uzakta`;
}

// ─── Bileşen ───────────────────────────────────────────────────────────────────

export function ProximityBanner({ nearby, onSelectPlace, onDismiss }: ProximityBannerProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const prevId = useRef<string | null>(null);

  useEffect(() => {
    if (nearby && nearby.place.id !== prevId.current) {
      // Yeni mekana yaklaşıldı → yukarıdan kayarak gir
      prevId.current = nearby.place.id;
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 280,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (!nearby) {
      // Mekandan uzaklaşıldı → yukarı kayarak çık
      prevId.current = null;
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 230,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [nearby, translateY, opacity]);

  // Banner hiç açılmadıysa render etme
  if (!nearby && prevId.current === null) return null;

  const accentColor = nearby ? getMarkerColor(nearby.place.occupancyRate) : '#34C759';

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { transform: [{ translateY }], opacity },
      ]}
    >
      <BlurView intensity={70} tint="light" style={styles.blur}>
        {/* Sol: konum ikonu + mesafe */}
        <View style={styles.left}>
          <View style={[styles.iconCircle, { backgroundColor: accentColor + '22', borderColor: accentColor }]}>
            <Ionicons name="location" size={18} color={accentColor} />
          </View>
          <Text style={styles.distanceText}>
            {nearby ? distanceLabel(nearby.distanceMeters) : ''}
          </Text>
        </View>

        {/* Orta: mekan bilgisi */}
        <View style={styles.center}>
          <Text style={styles.placeName} numberOfLines={1}>
            {nearby?.place.name ?? ''}
          </Text>
          <View style={styles.row}>
            {/* Doluluk rozeti */}
            <View style={[styles.occupancyBadge, { backgroundColor: accentColor + '20', borderColor: accentColor }]}>
              <View style={[styles.dot, { backgroundColor: accentColor }]} />
              <Text style={[styles.occupancyText, { color: accentColor }]}>
                %{nearby?.place.occupancyRate} · {nearby ? occupancyLabel(nearby.place.occupancyRate) : ''}
              </Text>
            </View>
            {/* Priz ikonu */}
            {nearby?.place.hasPriz && (
              <View style={styles.featureTag}>
                <Ionicons name="flash" size={11} color="#FFD60A" />
                <Text style={styles.featureText}>Priz</Text>
              </View>
            )}
            {/* 7/24 ikonu */}
            {nearby?.place.isOpen247 && (
              <View style={styles.featureTag}>
                <Ionicons name="time-outline" size={11} color="rgba(30,30,30,0.6)" />
                <Text style={styles.featureText}>7/24</Text>
              </View>
            )}
          </View>
        </View>

        {/* Sağ: Detay butonu + kapat */}
        <View style={styles.right}>
          <TouchableOpacity
            style={[styles.detailBtn, { backgroundColor: accentColor }]}
            onPress={() => nearby && onSelectPlace(nearby.place.id)}
            activeOpacity={0.8}
          >
            <Text style={styles.detailBtnText}>Detay</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDismiss} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons name="close" size={16} color="rgba(30,30,30,0.5)" />
          </TouchableOpacity>
        </View>
      </BlurView>
    </Animated.View>
  );
}

// ─── Stiller ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position:  'absolute',
    top:       Platform.OS === 'ios' ? 110 : 90, // FilterBar'ın hemen altı
    left:      12,
    right:     12,
    zIndex:    20,
    // Gölge
    shadowColor:   '#000',
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius:  10,
    elevation:     8,
  },
  blur: {
    borderRadius:    16,
    overflow:        'hidden',
    flexDirection:   'row',
    alignItems:      'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap:             10,
    borderWidth:     1,
    borderColor:     'rgba(255,255,255,0.75)',
    backgroundColor: 'rgba(255,255,255,0.55)',
  },

  // Sol
  left: {
    alignItems: 'center',
    gap:        4,
    minWidth:   48,
  },
  iconCircle: {
    width:         36,
    height:        36,
    borderRadius:  18,
    borderWidth:   1.5,
    alignItems:    'center',
    justifyContent: 'center',
  },
  distanceText: {
    fontSize:   10,
    fontWeight: '500',
    color:      'rgba(30,30,30,0.55)',
    textAlign:  'center',
  },

  // Orta
  center: {
    flex: 1,
    gap:  4,
  },
  placeName: {
    fontSize:   14,
    fontWeight: '700',
    color:      '#1A1A1A',
  },
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    flexWrap:      'wrap',
    gap:           5,
  },
  occupancyBadge: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               4,
    paddingHorizontal: 7,
    paddingVertical:   3,
    borderRadius:      8,
    borderWidth:       1,
  },
  dot: {
    width:        6,
    height:       6,
    borderRadius: 3,
  },
  occupancyText: {
    fontSize:   11,
    fontWeight: '600',
  },
  featureTag: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               3,
    backgroundColor:   'rgba(0,0,0,0.06)',
    paddingHorizontal: 6,
    paddingVertical:   3,
    borderRadius:      6,
  },
  featureText: {
    fontSize: 11,
    color:    'rgba(30,30,30,0.65)',
    fontWeight: '500',
  },

  // Sağ
  right: {
    alignItems: 'center',
    gap:        6,
  },
  detailBtn: {
    borderRadius:      10,
    paddingHorizontal: 12,
    paddingVertical:   7,
  },
  detailBtnText: {
    fontSize:   12,
    fontWeight: '700',
    color:      '#1A1A1A',
  },
  closeBtn: {
    padding: 2,
  },
});

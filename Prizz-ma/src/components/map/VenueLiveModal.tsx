import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { Place } from '../../types/place';

const { height } = Dimensions.get('window');

type VenueLiveModalProps = {
  place: Place | null;
  visible: boolean;
  onClose: () => void;
};

export function VenueLiveModal({ place, visible, onClose }: VenueLiveModalProps) {
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 40,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!place) return null;

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.latitude},${place.longitude}`;
    Linking.openURL(url);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const rate = place.occupancyRate;

    let timeMsg = '';
    if (hour >= 5 && hour < 9) timeMsg = '🌅 Erken kuş! Sabahın köründe çalışmaya geldin.';
    else if (hour >= 9 && hour < 12) timeMsg = '☀️ Günaydın! Verimli bir sabah seni bekliyor.';
    else if (hour >= 12 && hour < 14) timeMsg = '🍽️ Öğle arası çalışmacısı! Kahven hazır mı?';
    else if (hour >= 14 && hour < 18) timeMsg = '📚 Öğleden sonra enerjisi! En verimli saatler bunlar.';
    else if (hour >= 18 && hour < 21) timeMsg = '🌆 Akşam seansı başlıyor! Konsantre ol.';
    else timeMsg = '🦉 Gece kuşu! Saatlerce çalışabilirsin burada.';

    let occupancyMsg = '';
    if (rate < 40) occupancyMsg = '🎉 Epey boş! Favori yerini kapmak için harika bir an.';
    else if (rate < 60) occupancyMsg = '👍 Orta yoğunlukta, yer bulmak zor olmaz.';
    else if (rate < 75) occupancyMsg = '⚡ Biraz kalabalık ama yer bulursun, hızlan!';
    else occupancyMsg = '🔴 Çok dolu! Şansını dene ya da başka bir yer düşün.';

    return `${timeMsg}\n\n${occupancyMsg}`;
  };

  const getProgressColor = (rate: number) => {
    if (rate < 40) return '#34C759';
    if (rate < 60) return '#FFD60A';
    if (rate < 75) return '#FF9500';
    return '#FF3B30';
  };

  return (
    <Modal transparent visible={visible} animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View style={[styles.content, { transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.header}>
            <View>
              <Text style={styles.name}>{place.name}</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <Ionicons name="close" size={26} color={colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.greetingBox}>
            <Text style={styles.greetingText}>{getGreeting()}</Text>
          </View>

          <View style={styles.occupancySection}>
            <View style={styles.occupancyLabelRow}>
              <Text style={styles.sectionLabel}>DOLULUK ORANI</Text>
              <Text style={[styles.occupancyValue, { color: getProgressColor(place.occupancyRate) }]}>
                %{place.occupancyRate}
              </Text>
            </View>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${place.occupancyRate}%`,
                    backgroundColor: getProgressColor(place.occupancyRate),
                  }
                ]}
              />
            </View>
          </View>

          <View style={styles.amenitiesGrid}>
            <AmenityItem icon="flash" label="Priz" active={place.hasPriz} />
            <AmenityItem icon="moon" label="Sessiz Alan" active={place.hasQuietZone} />
            <AmenityItem icon="snow" label="Klima" active={place.hasAC} />
            <AmenityItem icon="time" label="7/24 Açık" active={place.isOpen247} />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.detailsBtn} onPress={onClose}>
              <Text style={styles.detailsBtnText}>Detay Gör</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.directionsBtn} onPress={handleDirections}>
              <Ionicons name="map" size={18} color={colors.background} />
              <Text style={styles.directionsBtnText}>Yol Tarifi Al</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

function AmenityItem({ icon, label, active }: { icon: any; label: string; active: boolean }) {
  return (
    <View style={[styles.amenityItem, !active && styles.amenityInactive]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={20} color={active ? colors.cyan : colors.textMuted} />
      </View>
      <Text style={[styles.amenityLabel, !active && styles.amenityLabelInactive]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: colors.backgroundElevated,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 50,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  name: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.white,
    letterSpacing: -0.5,
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 59, 48, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FF3B30',
    letterSpacing: 1,
  },
  closeBtn: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 20,
    padding: 6,
  },
  greetingBox: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: 18,
    borderRadius: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: colors.cyan,
  },
  greetingText: {
    fontSize: 15,
    color: colors.white,
    fontWeight: '600',
    lineHeight: 22,
  },
  occupancySection: {
    marginBottom: 28,
  },
  occupancyLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.textSecondary,
    letterSpacing: 1.5,
  },
  occupancyValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  progressBg: {
    height: 12,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  amenitiesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 36,
  },
  amenityItem: {
    alignItems: 'center',
    width: '23%',
    gap: 8,
  },
  amenityInactive: {
    opacity: 0.4,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  amenityLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.white,
    textAlign: 'center',
  },
  amenityLabelInactive: {
    color: colors.textMuted,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsBtn: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  detailsBtnText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: '700',
  },
  directionsBtn: {
    flex: 1.6,
    height: 56,
    borderRadius: 16,
    backgroundColor: colors.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  directionsBtnText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
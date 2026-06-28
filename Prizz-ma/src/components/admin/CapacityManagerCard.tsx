import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useAdminManager } from '../../context/AdminManagerContext';
import { colors } from '../../theme/colors';
import { AdminCard } from './AdminCard';

export function CapacityManagerCard() {
  const { maxCapacity, emptyCount, fillSeat, freeSeat } = useAdminManager();
  const occupied = maxCapacity - emptyCount;
  const fillPercent = (occupied / maxCapacity) * 100;

  return (
    <AdminCard style={styles.card}>
      <Text style={styles.sectionLabel}>Kapasite Yönetimi</Text>
      <Text style={styles.capacityDisplay}>
        <Text style={styles.capacityHighlight}>{emptyCount}</Text>
        <Text style={styles.capacityMuted}> / {maxCapacity} Boş</Text>
      </Text>

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${fillPercent}%` }]} />
      </View>
      <Text style={styles.fillHint}>%{Math.round(fillPercent)} dolu</Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnRed, pressed && styles.pressed]}
          onPress={fillSeat}
        >
          <Text style={styles.btnText}>MASA DOLDUR</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.btn, styles.btnCyan, pressed && styles.pressed]}
          onPress={freeSeat}
        >
          <Text style={[styles.btnText, styles.btnTextDark]}>MASA BOŞALT</Text>
        </Pressable>
      </View>
    </AdminCard>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  capacityDisplay: {
    marginBottom: 14,
  },
  capacityHighlight: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.cyan,
  },
  capacityMuted: {
    fontSize: 22,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  track: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
    marginBottom: 6,
  },
  fill: {
    height: '100%',
    backgroundColor: colors.cyan,
    borderRadius: 6,
  },
  fillHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    minHeight: 52,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRed: {
    backgroundColor: colors.adminRed,
  },
  btnCyan: {
    backgroundColor: colors.cyan,
  },
  btnText: {
    fontSize: 13,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.5,
  },
  btnTextDark: {
    color: '#041014',
  },
  pressed: {
    opacity: 0.88,
  },
});

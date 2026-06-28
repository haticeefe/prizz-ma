import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export function AdminActionsSection() {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.outlineBtn, pressed && styles.pressed]}
        onPress={() => Alert.alert('Duyuru', 'Yeni duyuru formu yakında.')}
      >
        <Ionicons name="megaphone-outline" size={18} color={colors.cyan} />
        <Text style={styles.outlineText}>YENİ DUYURU EKLE</Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [styles.outlineBtn, pressed && styles.pressed]}
        onPress={() => Alert.alert('Harita', 'Mekan haritadan gizlenecek.')}
      >
        <Ionicons name="eye-off-outline" size={18} color={colors.textSecondary} />
        <Text style={styles.outlineTextMuted}>MEKANI HARİTADAN GİZLE</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
    marginBottom: 8,
  },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    minHeight: 50,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.adminCardBorder,
    backgroundColor: 'transparent',
  },
  outlineText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.cyan,
    letterSpacing: 0.4,
  },
  outlineTextMuted: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.3,
    textAlign: 'center',
    flexShrink: 1,
  },
  pressed: {
    opacity: 0.85,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
});

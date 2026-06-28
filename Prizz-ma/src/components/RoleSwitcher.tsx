import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import type { UserRole } from '../types/auth';

type RoleSwitcherProps = {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
};

const tabs: { id: UserRole; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'student', label: 'Kullanıcı Girişi', icon: 'person-circle-outline' },
  { id: 'admin', label: 'Yönetici Girişi', icon: 'business-outline' },
];

export function RoleSwitcher({ role, onRoleChange }: RoleSwitcherProps) {
  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const active = role === tab.id;
        return (
          <Pressable
            key={tab.id}
            onPress={() => onRoleChange(tab.id)}
            style={styles.tab}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Ionicons
              name={tab.icon}
              size={18}
              color={active ? colors.cyan : colors.textSecondary}
            />
            <Text style={[styles.label, active && styles.labelActive]}>
              {tab.label}
            </Text>
            {active && <View style={styles.underline} />}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    marginBottom: 22,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    gap: 6,
    position: 'relative',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.white,
    fontWeight: '600',
  },
  underline: {
    position: 'absolute',
    bottom: 0,
    left: '12%',
    right: '12%',
    height: 3,
    backgroundColor: colors.cyan,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
});
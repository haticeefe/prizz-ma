import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { colors } from '../theme/colors';

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [userData, setUserData] = useState<{
    displayName: string;
    email: string;
    role: string;
  } | null>(null);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) {
        setUserData(snap.data() as { displayName: string; email: string; role: string });
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        })
      );
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={colors.cyan} />
        </View>
        <Text style={styles.name}>{userData?.displayName ?? '—'}</Text>
        <Text style={styles.email}>{userData?.email ?? '—'}</Text>
        <View style={styles.roleBadge}>
          <Ionicons
            name={userData?.role === 'admin' ? 'shield-checkmark' : 'school'}
            size={14}
            color={colors.cyan}
          />
          <Text style={styles.roleText}>
            {userData?.role === 'admin' ? 'Yönetici' : 'Öğrenci'}
          </Text>
        </View>
      </View>

      {/* Menü */}
      <View style={styles.menuCard}>
        {[
          { icon: 'star-outline', label: 'Favori Mekanlarım' },
          { icon: 'chatbubble-outline', label: 'Yorumlarım' },
          { icon: 'settings-outline', label: 'Hesap Ayarları' },
          { icon: 'notifications-outline', label: 'Bildirimler' },
        ].map((item, index, arr) => (
          <Pressable
            key={item.label}
            style={[
              styles.menuItem,
              index < arr.length - 1 && styles.menuBorder,
            ]}
          >
            <Ionicons name={item.icon as any} size={20} color={colors.textSecondary} />
            <Text style={styles.menuText}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </Pressable>
        ))}
      </View>

      {/* Uygulama bilgisi */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Uygulama Versiyonu</Text>
          <Text style={styles.infoValue}>v2.4.0</Text>
        </View>
        <View style={[styles.infoRow, styles.infoBorder]}>
          <Text style={styles.infoLabel}>Geliştirici</Text>
          <Text style={styles.infoValue}>Hatice EFE</Text>
        </View>
      </View>

      {/* Çıkış butonu */}
      <Pressable
        style={({ pressed }) => [styles.logout, pressed && styles.logoutPressed]}
        onPress={handleLogout}
      >
        <Ionicons name="log-out-outline" size={20} color="#F87171" />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </Pressable>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    gap: 20,
  },
  avatarContainer: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },
  email: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 229, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.2)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 4,
  },
  roleText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.cyan,
  },
  menuCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  menuText: {
    flex: 1,
    fontSize: 15,
    color: colors.white,
    fontWeight: '500',
  },
  infoCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  infoBorder: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.06)',
  },
  infoLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: 'rgba(248, 113, 113, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.3)',
    borderRadius: 14,
    paddingVertical: 16,
  },
  logoutPressed: {
    opacity: 0.8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#F87171',
  },
});
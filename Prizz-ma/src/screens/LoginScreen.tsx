import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthInput } from '../components/AuthInput';
import { GlassCard } from '../components/GlassCard';
import { PrizmaLogo } from '../components/PrizmaLogo';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { colors } from '../theme/colors';
import type { RootStackParamList, UserRole } from '../types/auth';

type LoginScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Login'>;
};

export function LoginScreen({ navigation }: LoginScreenProps) {
  const insets = useSafeAreaInsets();
  const [role, setRole] = useState<UserRole>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const trimmedUser = username.trim();
    if (!trimmedUser || !password) {
      Alert.alert('Eksik bilgi', 'Lütfen kullanıcı adı ve şifrenizi girin.');
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, trimmedUser, password);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, 'users', uid));

      if (!userDoc.exists()) {
        await signOut(auth);
        Alert.alert('Hata', 'Kullanıcı profili bulunamadı.');
        return;
      }

      const userData = userDoc.data();
      const actualRole = userData.role;

      if (actualRole !== role) {
        await signOut(auth);
        Alert.alert(
          'Hatalı Giriş',
          role === 'admin'
            ? 'Bu hesap bir admin hesabı değil.'
            : 'Bu hesap bir öğrenci hesabı değil.'
        );
        return;
      }

      if (actualRole === 'admin') {
        navigation.replace('AdminTabs');
      } else {
        navigation.replace('MainTabs');
      }

    } catch (error: unknown) {
      Alert.alert('Giriş Hatası', 'E-posta veya şifre hatalı.');
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#050508', '#0A1018', '#050508']}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.glow, styles.glowTop]} />
      <View style={[styles.glow, styles.glowBottom]} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <PrizmaLogo />

          <GlassCard style={styles.card}>
            <RoleSwitcher role={role} onRoleChange={setRole} />

            <AuthInput
              label="Kullanıcı Adı / E-posta"
              icon="mail-outline"
              placeholder="örnek@prizma.com"
              value={username}
              onChangeText={setUsername}
              keyboardType="email-address"
              autoCapitalize="none"
              textContentType="username"
            />

            <AuthInput
              label="Şifre"
              icon="lock-closed-outline"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword
              textContentType="password"
            />

            <Pressable
              style={({ pressed }) => [styles.loginButton, pressed && styles.loginPressed]}
              onPress={handleLogin}
            >
              <Text style={styles.loginText}>Giriş Yap →</Text>
            </Pressable>

            <Pressable
              style={styles.forgotLink}
              onPress={() => Alert.alert('Şifremi Unuttum', 'Yakında eklenecek.')}
            >
              <Text style={styles.linkCyan}>Şifremi Unuttum</Text>
            </Pressable>
          </GlassCard>

          <View style={styles.registerRow}>
            <Text style={styles.registerMuted}>Hesabın yok mu? </Text>
            <Pressable onPress={() => navigation.navigate('Register')}>
              <Text style={styles.linkCyan}>Kayıt Ol</Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLine} />
            <Text style={styles.version}>v2.4.0</Text>
            <View style={styles.footerLine} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  glow: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(0, 255, 255, 0.06)',
  },
  glowTop: {
    top: -80,
    right: -60,
  },
  glowBottom: {
    bottom: 120,
    left: -100,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    gap: 28,
  },
  card: {
    marginTop: 8,
  },
  loginButton: {
    marginTop: 6,
    backgroundColor: colors.cyan,
    borderRadius: 14,
    minHeight: 54,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  loginPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  loginText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#041014',
    letterSpacing: 0.3,
  },
  forgotLink: {
    alignSelf: 'center',
    marginTop: 18,
    paddingVertical: 4,
  },
  linkCyan: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerMuted: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 'auto',
    paddingTop: 12,
  },
  footerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  version: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
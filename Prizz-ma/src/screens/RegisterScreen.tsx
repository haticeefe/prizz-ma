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
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, Timestamp } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { AuthInput } from '../components/AuthInput';
import { GlassCard } from '../components/GlassCard';
import { PrizmaLogo } from '../components/PrizmaLogo';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../types/auth';

type RegisterNavProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<RegisterNavProp>();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password) {
      Alert.alert('Eksik bilgi', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalı.');
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        uid: cred.user.uid,
        email: email.trim(),
        displayName: displayName.trim(),
        role: 'student',
        createdAt: Timestamp.now(),
      });
      navigation.replace('MainTabs');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('Hata', 'Bu e-posta zaten kullanımda.');
      } else {
        Alert.alert('Hata', 'Kayıt oluşturulamadı.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#050508', '#0A1018', '#050508']}
        style={StyleSheet.absoluteFill}
      />

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
            <Text style={styles.title}>Hesap Oluştur</Text>
            <Text style={styles.subtitle}>Prizz-ma'ya katıl!</Text>

            <AuthInput
              label="Ad Soyad"
              icon="person-outline"
              placeholder="Adın Soyadın"
              value={displayName}
              onChangeText={setDisplayName}
              autoCapitalize="words"
            />

            <AuthInput
              label="E-posta"
              icon="mail-outline"
              placeholder="örnek@prizma.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <AuthInput
              label="Şifre"
              icon="lock-closed-outline"
              placeholder="En az 6 karakter"
              value={password}
              onChangeText={setPassword}
              isPassword
            />

            <Pressable
              style={({ pressed }) => [styles.registerBtn, pressed && { opacity: 0.88 }]}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerBtnText}>
                {loading ? 'Kaydediliyor...' : 'Kayıt Ol →'}
              </Text>
            </Pressable>
          </GlassCard>

          <View style={styles.loginRow}>
            <Text style={styles.loginMuted}>Zaten hesabın var mı? </Text>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={styles.linkCyan}>Giriş Yap</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    gap: 28,
  },
  card: { marginTop: 8 },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  registerBtn: {
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
  registerBtnText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#041014',
    letterSpacing: 0.3,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginMuted: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  linkCyan: {
    color: colors.cyan,
    fontSize: 14,
    fontWeight: '600',
  },
});
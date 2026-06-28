import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import type { RootStackParamList } from '../../types/auth';

export function ManagerHeader() {
  const navigation = useNavigation();

  const handleSettings = () => {
    Alert.alert('Ayarlar', 'Bir işlem seçin', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Çıkış Yap',
        style: 'destructive',
        onPress: () => {
          const stack = navigation.getParent()?.getParent() as
            | NativeStackNavigationProp<RootStackParamList>
            | undefined;
          stack?.replace('Login');
        },
      },
    ]);
  };

  return (
    <View style={styles.row}>
      <Text style={styles.title}>Priz-ma Manager</Text>
      <Pressable onPress={handleSettings} hitSlop={12} style={styles.gearBtn}>
        <Ionicons name="settings-outline" size={24} color={colors.textSecondary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
    letterSpacing: 0.3,
  },
  gearBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: colors.inputBg,
    borderWidth: 1,
    borderColor: colors.adminCardBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

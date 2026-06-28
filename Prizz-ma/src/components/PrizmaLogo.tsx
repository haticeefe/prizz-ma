import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';

type PrizmaLogoProps = {
  showTitle?: boolean;
};

export function PrizmaLogo({ showTitle = true }: PrizmaLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/icon.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      {showTitle && (
        <Text style={styles.heroTitle}>PRIZZ-MA</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    width: 110,
    height: 110,
    borderRadius: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.cyan,
    letterSpacing: 4,
  },
});
import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

type GlassCardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function GlassCard({ children, style }: GlassCardProps) {
  return (
    <View style={[styles.outer, style]}>
      <BlurView intensity={28} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={['rgba(0, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.02)', 'rgba(0, 0, 0, 0.15)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.inner}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.cardGlass,
  },
  inner: {
    padding: 22,
  },
});

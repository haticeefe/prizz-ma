import { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';

type AdminCardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function AdminCard({ children, style }: AdminCardProps) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.adminCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.adminCardBorder,
    padding: 18,
  },
});

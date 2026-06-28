import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { RecentReviewsSection } from '../../components/admin/RecentReviewsSection';
import { colors } from '../../theme/colors';

const TAB_BAR_HEIGHT = 56;

export function AdminFeedScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + TAB_BAR_HEIGHT + 16 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Feed</Text>
        <Text style={styles.subtitle}>Kullanıcı yorumları ve geri bildirimler.</Text>
        <RecentReviewsSection />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.adminBackground,
  },
  scroll: {
    paddingHorizontal: 18,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
});

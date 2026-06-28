import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AdminActionsSection } from '../../components/admin/AdminActionsSection';
import { CapacityManagerCard } from '../../components/admin/CapacityManagerCard';
import { EditVenueSection } from '../../components/admin/EditVenueSection';
import { ManagerHeader } from '../../components/admin/ManagerHeader';
import { RecentReviewsSection } from '../../components/admin/RecentReviewsSection';
import { colors } from '../../theme/colors';

const TAB_BAR_HEIGHT = 56;

export function ManagerDashboardScreen() {
  const insets = useSafeAreaInsets();
  const bottomPad = insets.bottom + TAB_BAR_HEIGHT + 16;

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={[
          styles.scroll,
          { paddingTop: insets.top + 16, paddingBottom: bottomPad },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <ManagerHeader />
        <CapacityManagerCard />
        <EditVenueSection />
        <RecentReviewsSection />
        <AdminActionsSection />
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
});

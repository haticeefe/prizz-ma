import { StyleSheet, View, Pressable } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, CommonActions } from '@react-navigation/native';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AdminManagerProvider } from '../context/AdminManagerContext';
import { ManagerDashboardScreen } from '../screens/admin/ManagerDashboardScreen';
import { AdminVenueScreen } from '../screens/admin/AdminVenueScreen';
import { AdminCapacityScreen } from '../screens/admin/AdminCapacityScreen';
import { AdminFeedScreen } from '../screens/admin/AdminFeedScreen';
import { colors } from '../theme/colors';

export type AdminTabParamList = {
  Venue: undefined;
  Capacity: undefined;
  Feed: undefined;
  Admin: undefined;
};

const Tab = createBottomTabNavigator<AdminTabParamList>();

type TabIcon = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<keyof AdminTabParamList, { active: TabIcon; inactive: TabIcon }> = {
  Venue: { active: 'storefront', inactive: 'storefront-outline' },
  Capacity: { active: 'people', inactive: 'people-outline' },
  Feed: { active: 'chatbubbles', inactive: 'chatbubbles-outline' },
  Admin: { active: 'shield', inactive: 'shield-outline' },
};

function LogoutButton() {
  const navigation = useNavigation();

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
    <Pressable onPress={handleLogout} style={{ marginRight: 16 }}>
      <Ionicons name="log-out-outline" size={24} color={colors.cyan} />
    </Pressable>
  );
}

export function AdminTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <AdminManagerProvider>
      <Tab.Navigator
        initialRouteName="Admin"
        screenOptions={({ route }) => ({
          headerShown: true,
          headerStyle: {
            backgroundColor: colors.background,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(255,255,255,0.08)',
          },
          headerTintColor: colors.white,
          headerTitleStyle: { fontSize: 16, fontWeight: '600' },
          headerRight: () => <LogoutButton />,
          tabBarStyle: [
            styles.tabBar,
            { height: 56 + insets.bottom, paddingBottom: insets.bottom },
          ],
          tabBarBackground: () => (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ),
          tabBarActiveTintColor: colors.cyan,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarIcon: ({ focused, color, size }) => {
            const icons = tabIcons[route.name];
            const name = focused ? icons.active : icons.inactive;
            return (
              <View style={focused ? styles.iconActiveWrap : undefined}>
                <Ionicons name={name} size={size} color={color} />
              </View>
            );
          },
        })}
      >
        <Tab.Screen name="Venue" component={AdminVenueScreen} options={{ title: 'Venue' }} />
        <Tab.Screen name="Capacity" component={AdminCapacityScreen} options={{ title: 'Capacity' }} />
        <Tab.Screen name="Feed" component={AdminFeedScreen} options={{ title: 'Feed' }} />
        <Tab.Screen name="Admin" component={ManagerDashboardScreen} options={{ title: 'Admin' }} />
      </Tab.Navigator>
    </AdminManagerProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(13, 17, 23, 0.95)',
    elevation: 0,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },
  iconActiveWrap: {
    shadowColor: colors.cyan,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
});
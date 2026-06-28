import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapScreen } from '../screens/MapScreen';
import { StudyScreen } from '../screens/StudyScreen';
import { CafesScreen } from '../screens/CafesScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';

export type MainTabParamList = {
  Map: undefined;
  Study: undefined;
  Cafes: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

type TabIcon = keyof typeof Ionicons.glyphMap;

const tabIcons: Record<keyof MainTabParamList, { active: TabIcon; inactive: TabIcon }> = {
  Map: { active: 'map', inactive: 'map-outline' },
  Study: { active: 'book', inactive: 'book-outline' },
  Cafes: { active: 'cafe', inactive: 'cafe-outline' },
  Profile: { active: 'person', inactive: 'person-outline' },
};

export function MainTabNavigator() {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      initialRouteName="Map"
      screenOptions={({ route }) => ({
        headerShown: false,
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
      <Tab.Screen name="Map" component={MapScreen} options={{ title: 'Map' }} />
      <Tab.Screen name="Study" component={StudyScreen} options={{ title: 'Study' }} />
      <Tab.Screen name="Cafes" component={CafesScreen} options={{ title: 'Cafes' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: 'rgba(8, 10, 16, 0.88)',
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

export type UserRole = 'student' | 'admin';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  MainTabs: undefined;
  AdminTabs: undefined;
  StudentHome: undefined;
  VenueDetail: { venueId: string };
};
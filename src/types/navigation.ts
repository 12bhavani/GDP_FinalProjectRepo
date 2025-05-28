export type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
  Home: undefined;
  Calendar: undefined;
  Form: {
    date: string;
    slot: string;
  };
  Profile: undefined;
  AdminDashboard: undefined;
  ManageSlots: undefined;
  ViewAppointments: undefined;

  // 👇 Add these new screens
  AppointmentHistory: undefined;
  HealthReports: undefined;
  Messages: undefined;
};

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

  // ✅ Appointments
  AppointmentHistory: undefined;

  // ✅ Student
  HealthReports: undefined;
  Messages: undefined;
  Contact: undefined;   // 👈 Added
  TherapyAssistanceOnline: undefined;
  Chatbot: undefined;
};

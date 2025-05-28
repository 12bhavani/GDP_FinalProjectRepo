import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const staffData = [
  {
    name: 'Alyssa Beattie',
    title: 'Office Manager',
    email: 'abeattie@nwmissouri.edu',
    phone: '660.562.1348',
    img: 'https://www.nwmissouri.edu/wellness/images/people/Alyssa_Beattie.jpg',
  },
  {
    name: 'Carissa Everhart',
    title: 'Staff Nurse',
    email: 'ceverhart@nwmissouri.edu',
    phone: '660.562.1348',
    img: 'https://www.nwmissouri.edu/wellness/images/people/everhart.jpg',
  },
  {
    name: 'Mark Falke',
    title: 'Counselor',
    email: 'mfalke@nwmissouri.edu',
    phone: '660.562.1348',
    img: 'https://www.nwmissouri.edu/wellness/images/people/MarkFalke.jpg',
  },
  // Add more staff entries here if needed
];

const StaffDirectory = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.pageTitle}>Staff Directory</Text>

      <View style={styles.contactSection}>
        <Text style={styles.contactText}>
          <Text style={styles.bold}>University Wellness Services{'\n'}</Text>
          800 University Drive{'\n'}
          Maryville, MO 64468{'\n'}
          Phone: 660.562.1348{'\n'}
          Fax: 660.562.1585
        </Text>
        <TouchableOpacity onPress={() => Linking.openURL('https://wellness.nwmissouri.edu/login_directory.aspx')}>
          <Text style={styles.link}>Go to Wellness Portal</Text>
        </TouchableOpacity>
      </View>

      {staffData.map((staff, index) => (
        <View key={index} style={styles.card}>
          <Image source={{ uri: staff.img }} style={styles.avatar} />
          <View style={styles.info}>
            <Text style={styles.name}>{staff.name}</Text>
            <Text style={styles.role}>{staff.title}</Text>
            <Text>{staff.phone}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${staff.email}`)}>
              <Text style={styles.link}>{staff.email}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default StaffDirectory;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    paddingBottom: 40,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  contactSection: {
    backgroundColor: '#f0f9f0',
    padding: 16,
    marginBottom: 24,
    borderRadius: 8,
  },
  contactText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  bold: {
    fontWeight: 'bold',
  },
  link: {
    color: '#006400',
    fontWeight: '600',
    marginTop: 4,
  },
  card: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f6f6f6',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  role: {
    fontSize: 14,
    color: '#666',
    marginVertical: 2,
  },
});

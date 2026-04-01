import React, { useEffect, useRef } from 'react';
import Header from '../components/TAOHeader';
import { Video, Audio,ResizeMode } from 'expo-av';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  Dimensions,
} from 'react-native';
 
const { width } = Dimensions.get('window');
 
const TAO = () => {
  const videoRef = useRef(null);
 
  // ✅ Setup audio permissions and mode
  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Request audio permissions
        await Audio.requestPermissionsAsync();
 
        // Configure audio mode
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
        });
 
        console.log('Audio setup complete');
      } catch (error) {
        console.log('Audio setup error:', error);
      }
    };
 
    setupAudio();
  }, []);
 
  const handleWebsitePress = () => {
    Linking.openURL('https://us.taoconnect.org');
  };
 
  return (
    <View style={styles.screen}>
      <Header title="Therapy Assistance Online (TAO)" showBack={true} />

      <ScrollView style={styles.container}>
 
      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>
          What is Therapy Assistance Online (TAO) Treatment?
        </Text>
 
        <Text style={styles.bulletPoint}>
          • TAO is an interactive, web-based program that provides guided
          activities to{' '}
          <Text style={styles.highlight}>
            help overcome anxiety, depression and other common concerns
          </Text>
          .
        </Text>
 
        <Text style={styles.bulletPoint}>
          • TAO is based on well-researched and{' '}
          <Text style={styles.highlight}>highly effective</Text> strategies for
          helping anxiety, depression and other concerns.
        </Text>
 
        <Text style={styles.bulletPoint}>
          • You can watch engaging videos and complete beneficial exercises.
        </Text>
 
        <Text style={styles.subBulletPoint}>
          ◦ Exercises take approximately{' '}
          <Text style={styles.highlight}>10-20 minutes</Text> to complete.
        </Text>
 
        <Text style={styles.subBulletPoint}>
          ◦ Daily homework can be completed on a smartphone, tablet, or
          computer. These take about 1–2 minutes per entry and are most
          effective when done 2+ times per day.
        </Text>
 
        <Text style={styles.paragraph}>
          TAO allows you to access highly effective therapy modules whenever you
          need them, available 24/7. Some of these modules include:
        </Text>
      </View>
 
      {/* Video Section */}
      <View style={styles.videoSection}>
        <Text style={styles.sectionTitle}>TAO Introduction Video</Text>
        <Text style={styles.paragraph}>
          Learn more about how TAO can help you manage anxiety, depression, and
          other concerns through this introductory video.
        </Text>
 
        <View style={styles.videoContainer}>
          <Video
            ref={videoRef}
            source={require('../../assets/TAOVideo.mp4')} // ✅ Make sure this path is correct
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode={ResizeMode.CONTAIN}
            shouldPlay={true} // ✅ Auto-play video
            useNativeControls
            style={styles.video}
          />
        </View>
 
        {/* Student Sign-Up Section */}
        <View style={styles.signupSection}>
          <Text style={styles.signupTitle}>STUDENT SIGN-UP</Text>
        </View>
        <Text>Here are the steps to get you started in TAO:</Text>
        <Text style={styles.signupBullet}>
          • In your browser, go to{' '}
          <Text
            style={styles.signupLink}
            onPress={handleWebsitePress}
          >
            https://us.taoconnect.org/register
          </Text>{' '}
          and click on the ‘Sign Me Up’ button.
        </Text>
        <Text style={styles.signupBullet}>
          • Enter your name and university email address into the enrollment
          form.
        </Text>
        <Text style={styles.signupBullet}>
          • Leave the 'Enrollment Key' field blank and enter a password.
        </Text>
        <Text style={styles.signupBullet}>
          • Fill out the Demographic Information [optional] and agree to the TAO
          Self-Help Informed Consent [required].
        </Text>
        <Text style={styles.signupBullet}>• Click 'Sign Me Up!'</Text>
        <Text style={styles.signupBullet}>
          • You will receive a confirmation link via email. Click it and sign in
          with your university login credentials.
        </Text>
 
        <View style={styles.signupSection}>
          <Text
            style={styles.loginLink}
            onPress={() =>
              Linking.openURL('https://us.taoconnect.org/login')
            }
          >
            ALREADY HAVE AN ACCOUNT? LOGIN HERE {'>'}
          </Text>
        </View>
 
        {/* Employee Sign-Up Section */}
        <View style={styles.signupSection}>
          <Text style={styles.signupTitle}>EMPLOYEE SIGN-UP</Text>
        </View>
        <Text>Here are the steps to get you started in TAO:</Text>
        <Text style={styles.signupBullet}>
          • Click this link -{' '}
          <Text
            style={styles.signupLink}
            onPress={() =>
              Linking.openURL('https://us.taoconnect.org/login')
            }
          >
            TAO for Northwest Employees
          </Text>
        </Text>
        <Text style={styles.signupBullet}>
          • Complete the enrollment form (User Information, Demographic
          Information, and Informed Consent).
        </Text>
        <Text style={styles.signupBullet}>• Click "Sign Me Up!"</Text>
        <Text style={styles.signupBullet}>
          • You will receive a confirmation email saying your enrollment is
          complete. You can now log in to TAO using your Northwest username and
          password.
        </Text>
 
        <View style={styles.signupSection}>
          <Text
            style={styles.loginLink}
            onPress={() =>
              Linking.openURL('https://us.taoconnect.org/login')
            }
          >
            ALREADY HAVE AN ACCOUNT? LOGIN HERE {'>'}
          </Text>
        </View>
 
        <Text style={styles.note}>
          Note: The video above is a placeholder. In your actual implementation,
          you would embed the official TAO introduction video.
        </Text>
      </View>
 
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2025 Wellness Services | Therapy Assistance Online (TAO)
          </Text>
          <Text style={styles.footerText}>
            This page is based on content from Northwest Missouri State
            University's TAO page.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
 
// ✅ Styles
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    borderBottomWidth: 2,
    borderBottomColor: '#3498db',
    paddingBottom: 5,
  },
  bulletPoint: { fontSize: 16, marginBottom: 10, lineHeight: 22 },
  subBulletPoint: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
    marginLeft: 20,
  },
  paragraph: { fontSize: 16, marginBottom: 15, lineHeight: 22 },
  highlight: { fontWeight: 'bold', color: '#3498db' },
  videoSection: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  videoContainer: {
    width: width - 70,
    height: 200,
    marginTop: 15,
    borderRadius: 4,
    overflow: 'hidden',
  },
  video: { flex: 1 },
  note: { fontSize: 14, fontStyle: 'italic', marginTop: 10, color: '#666' },
  footer: {
    backgroundColor: '#2c3e50',
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: { color: 'white', textAlign: 'center', marginBottom: 5 },
  signupSection: {
    backgroundColor: '#006747',
    padding: 10,
    margin: 20,
    alignItems: 'center',
    borderRadius: 8,
  },
  signupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  signupBullet: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    lineHeight: 22,
  },
  signupLink: {
    color: '#1500ff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  loginLink: {
    color: 'white',
    fontWeight: 'bold',
    padding: 0,
    margin: 0,
    textAlign: 'center',
  },
});
 
export default TAO;
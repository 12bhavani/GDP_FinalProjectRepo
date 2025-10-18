// TAO.js
import React from 'react';
//import Header from '../components/TAOHeader';
 
// import { Video } from 'expo-av';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';
import { WebView } from 'react-native-webview';
const { width } = Dimensions.get('window');
 
const TAO = () => {
  const handleWebsitePress = () => {
    Linking.openURL('https://us.taoconnect.org');
  };
 
  return (
    <ScrollView style={styles.container}>
 
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
    {/* ✅ Header added here */}
{/*     <Header title="Therapy Assistance Online (TAO)" showBack={true} /> */}
    </View>
 
 
      {/* Content Section */}
      <View style={styles.contentSection}>
        <Text style={styles.sectionTitle}>What is Therapy Assistance Online (TAO) Treatment?</Text>
        
        <Text style={styles.bulletPoint}>
          • TAO is an interactive, web-based program that provides guided activities to{' '}
          <Text style={styles.highlight}>help overcome anxiety, depression and other common concerns</Text>.
        </Text>
        
        <Text style={styles.bulletPoint}>
          • TAO is based on well-researched and{' '}
          <Text style={styles.highlight}>highly effective</Text> strategies for helping anxiety, depression and other concerns.
        </Text>
        
        <Text style={styles.bulletPoint}>
          • You can watch engaging videos and complete beneficial exercises.
        </Text>
        
        <Text style={styles.subBulletPoint}>
          ◦ Exercises take approximately{' '}
          <Text style={styles.highlight}>10-20 minutes</Text> to complete.
        </Text>
        
        <Text style={styles.subBulletPoint}>
          ◦ Daily homework can be completed on a smart phone, tablet, or computer. These take about 1-2 minutes per entry and the treatment is most effective if you make an entry 2 or more times per day.
        </Text>
        
        <Text style={styles.paragraph}>
          TAO allows you to access highly effective therapy modules whenever you need it, available 24/7. Using TAO you will learn from different modules you chose to use! Some of these modules include:
        </Text>
      </View>
 
      Video Section
      <View style={styles.videoSection}>
        <Text style={styles.sectionTitle}>TAO Introduction Video</Text>
        <Text style={styles.paragraph}>
          Learn more about how TAO can help you manage anxiety, depression, and other concerns through this introductory video.
        </Text>
        
        <View style={styles.videoContainer}>
  {/* <Video
    source={require('../../assets/TAO Video.mp4')}
    rate={1.0}
    volume={1.0}
    isMuted={false}
    shouldPlay={false}
    useNativeControls
    style={styles.video}
  /> */}
</View>
 
        {/* Student Sign-Up Section */}
        <View style={styles.signupSection}>
          <Text style={styles.signupTitle}>STUDENT SIGN-UP</Text>
        </View>
        <Text>Here are the steps to get you started in TAO:</Text>
        <Text style={styles.signupBullet}>• In your browser, go to
          <Text> </Text>
          <Text style={styles.signupLink} onPress={handleWebsitePress}>
             https://us.taoconnect.org/register
          </Text>
          , and click on the ‘Sign Me Up’ button.
        </Text>
 
        <Text style={styles.signupBullet}>• Enter your name and university email address into the enrollment form.</Text>
        <Text style={styles.signupBullet}>• Leave the 'Enrollment Key' field blank and enter a password.</Text>
        <Text style={styles.signupBullet}>• Fill out the Demographic Information [optional] and agree to the TAO Self-Help Informed Consent [required].</Text>
        <Text style={styles.signupBullet}>• Click 'Sign Me Up!'</Text>
        <Text style={styles.signupBullet}>• You will receive a confirmation link via email. Click it and sign in with your university login credentials.</Text>
 
        {/* If already have an account */}
        <View style={styles.signupSection}>
          <Text style={styles.loginLink} onPress={() => Linking.openURL('https://us.taoconnect.org/login')}>
            ALREADY HAVE AN ACCOUNT? LOGIN HERE {'>'}
          </Text>
        </View>
 
        {/* Employee Sign-Up Section */}
        <View style={styles.signupSection}>
          <Text style={styles.signupTitle}>EMPLOYEE SIGN-UP</Text>
        </View>
        <Text>Here are the steps to get you started in TAO:</Text>
        <Text style={styles.signupBullet}>• Click this link -
          <Text></Text>
          <Text style={styles.signupLink} onPress={() => Linking.openURL('https://us.taoconnect.org/login')}>
            TAO for Northwest Employees
          </Text>
        </Text>
 
        <Text style={styles.signupBullet}>• Complete the enrollment form (User Information, Demographic Information, and Informed Consent).</Text>
        <Text style={styles.signupBullet}>• Click "Sign Me Up!"</Text>
        <Text style={styles.signupBullet}>• You will receive a confirmation email saying your enrollment is complete. You can now login to TAO using your Northwest username and password.</Text>
        
        {/* If already have an account */}
        <View style={styles.signupSection}>
          <Text style={styles.loginLink} onPress={() => Linking.openURL('https://us.taoconnect.org/login')}>
            ALREADY HAVE AN ACCOUNT? LOGIN HERE {'>'}
          </Text>
        </View>
 
        <Text style={styles.note}>
          Note: The video above is a placeholder. In your actual implementation, you would embed the official TAO introduction video.
        </Text>
      </View>
 
      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2025 Wellness Services | Therapy Assistance Online (TAO)
        </Text>
        <Text style={styles.footerText}>
          This page is based on content from Northwest Missouri State University's TAO page
        </Text>
      </View>
    </ScrollView>
  );
};
 
const styles = StyleSheet.create({
  TAOImage: {
    width: width - 60,
    height: 180,
    borderRadius: 8,
    marginBottom: 15,
  },
 
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3498db',
    marginRight: 10,
  },
  siteTitle: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  nav: {
    flexDirection: 'row',
  },
  navItem: {
    color: 'white',
    marginRight: 20,
    fontWeight: '500',
  },
  hero: {
    backgroundColor: '#1a6700f5',
    padding: 0,
    alignItems: 'center',
    margin: -1,
    marginTop: -10,
    borderRadius: 4,
  },
  taoLogo: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  taoFullName: {
    fontSize: 18,
    color: 'white',
    marginTop:-30,
    marginBottom: 10,
  },
  heroText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 15,
  },
  websiteButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 4,
    marginTop: 10,
  },
  websiteButtonText: {
    color: '#3498db',
    fontWeight: 'bold',
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
  bulletPoint: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
  },
  subBulletPoint: {
    fontSize: 16,
    marginBottom: 10,
    lineHeight: 22,
    marginLeft: 20,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 15,
    lineHeight: 22,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#3498db',
  },
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
  video: {
    flex: 1,
  },
  note: {
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 10,
    color: '#666',
  },
  footer: {
    backgroundColor: '#2c3e50',
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    color: 'white',
    textAlign: 'center',
    marginBottom: 5,
  },
 
  signupSection: {
    backgroundColor: '#006747',
    padding: 0,
    margin: 20,
    alignItems: 'center',
    borderRadius: 8,
  },
 
  signupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
  },
 
  signupBullet: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    lineHeight: 22,
  },
 
  signupLink: {
    color: '#1500ffff',
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

import React from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const TAO_BANNER_RATIO = 1924 / 626;
 
type HeaderProps = {
  title: string;
  showBack?: boolean;  
};
 
const Header = ({ title, showBack = true }: HeaderProps) => {
  const navigation = useNavigation();
 
  return (
    <View style={styles.header}>
      {showBack && navigation.canGoBack() && (
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      )}
      <Image
        source={require('../../assets/TAOimage.png')}
        style={styles.headerImage}
        resizeMode="contain"
      />
      <Text style={styles.headerText}>{title}</Text>
    </View>
  );
};
 
export default Header;
 
const styles = StyleSheet.create({
  header: {
    backgroundColor: '#006747',
    paddingTop: 50,
    paddingHorizontal: 0,
    paddingBottom: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 14,
    top: 56,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderRadius: 18,
    padding: 4,
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    aspectRatio: TAO_BANNER_RATIO,
    marginBottom: 8,
    borderRadius: 0,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    paddingBottom: 2,
  },
});
import React from 'react';
import { Dimensions, View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Original image is 1924 x 626
const IMAGE_WIDTH = SCREEN_WIDTH;
const IMAGE_HEIGHT = SCREEN_WIDTH * (626 / 1924);

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
        resizeMode="stretch"
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
    width: IMAGE_WIDTH,
    height: IMAGE_HEIGHT,
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    paddingBottom: 2,
  },
});
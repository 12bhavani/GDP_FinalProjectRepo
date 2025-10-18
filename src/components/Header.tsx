import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type HeaderProps = {
  title: string;
  showBack?: boolean;  // 👈 new prop
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
        source={require('../../assets/wellness_logo.png')}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 55,
    zIndex: 1,
  },
  headerImage: {
    width: '100%',
    height: 118,
    marginBottom: 15,
  },
  headerText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    paddingBottom: 20,
  },
});

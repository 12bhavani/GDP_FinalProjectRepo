// src/components/Header.tsx
import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

type HeaderProps = {
  title: string;
};

const Header = ({ title }: HeaderProps) => {
  return (
    <View style={styles.header}>
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

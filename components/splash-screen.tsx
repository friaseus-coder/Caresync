
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../designs/logo icono/logo splash screen.jpeg')}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  image: {
    width: '80%',
    height: '80%',
    resizeMode: 'contain',
  },
});

export default SplashScreen;

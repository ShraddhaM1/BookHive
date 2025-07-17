import React from 'react';
import { Image, StyleSheet, View, Dimensions } from 'react-native';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/splash_image.jpg')} // or wherever your image is
        style={styles.image}
        resizeMode="cover" // or "contain" if you want full image without cropping
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: height,
  },
});

export default SplashScreen;

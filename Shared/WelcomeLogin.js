import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Greeting = () => {
  return (
    <View style={styles.greetingContainer}>
      <Text>
        <Text style={styles.welcomeText}>Welcome</Text>
        {'\n'}
        <Text style={styles.Gourdtext}>Farmers!</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  greetingContainer: {
    paddingVertical: 0,
    marginTop: -13,
    // marginLeft: 20,
    marginBottom: 25,
    backgroundColor: '#fff',
  },
  welcomeText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'normal',
  },
  Gourdtext: {
    color: '#3baea0',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Greeting;
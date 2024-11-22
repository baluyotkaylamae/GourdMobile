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
    backgroundColor: '#E0F8E6',
  },
  welcomeText: {
    color: '#000000',
    fontSize: 30,
    fontWeight: 'normal',
  },
  Gourdtext: {
    color: '#3baea0',
    fontSize: 30,
    fontWeight: 'bold',
  },
});

export default Greeting;

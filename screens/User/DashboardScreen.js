import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import MonthlyPollination from './MonthlyPollination';
import TypiePie from './TypiePie';

const DashboardScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MonthlyPollination />
      <TypiePie />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
});

export default DashboardScreen;

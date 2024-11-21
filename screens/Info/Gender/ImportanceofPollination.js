import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ImportanceFlowers = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Importance of Male and Female Flowers in Pollination and Fruit Production</Text>
        
        <Text style={styles.content}>
        Both male and female flowers are essential for the plant's reproductive cycle and for fruit development. While male flowers supply the pollen, female flowers need this pollen to produce viable gourds. Without male flowers, pollination would not occur, and without female flowers, the plant would not produce any gourds.
        </Text>
        
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#E0F8E6",
    },
    scrollContent: {
      padding: 20,
    },
    header: {
      fontSize: 26,
      fontWeight: "600",
      marginBottom: 20,
      color: "#2D5F2E",
      textAlign: "center",
      fontFamily: "serif",
    },
    content: {
      fontSize: 16,
      color: "#555",
      lineHeight: 24,
      textAlign: "justify",
      fontFamily: "serif",
      marginTop: 10,
    },
    bulletPoint: {
      fontSize: 16,
      color: "#555",
      lineHeight: 24,
      textAlign: "justify",
      fontFamily: "serif",
      marginTop: 10,
    },
    bold: {
      fontWeight: "bold",
    },
});

export default ImportanceFlowers;
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PollinationChallenges = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Challenges in Pollination</Text>
        
        <Text style={styles.content}>
        Pollination can be challenging, particularly if there are not enough pollinators in the area. Factors like habitat loss, pesticide use, and climate change have led to declining pollinator populations, which can affect gourd production. Additionally, poor weather conditions such as excessive rain or extreme heat can hinder pollination, as bees and other insects may be less active in such conditions.
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

export default PollinationChallenges;
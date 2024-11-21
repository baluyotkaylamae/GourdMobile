import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PollinationProcess = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Pollination Process</Text>
        
        <Text style={styles.content}>
        Pollination in gourds usually depends on natural pollinators, such as bees and other insects, which transfer pollen from the male flowers to the female flowers. However, some factors can affect the pollination process, including a lack of pollinators due to environmental factors or local pesticide use. In these cases, hand-pollination is often used to ensure that female flowers receive the pollen they need for fruit production.
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Natural Pollinators:</Text> Bees and insects are the primary pollinators for gourds. They are attracted by the flowers' bright colors and gather pollen from male flowers, carrying it to female flowers.
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Hand-Pollination:</Text> When natural pollination is insufficient, hand-pollination can be done by using a small brush or even by gently rubbing a male flower against a female flower. This method helps guarantee that female flowers are fertilized, allowing for a successful harvest.
        </Text>
        <Text style={styles.bulletPoint}>
          The visual differences between male and female flowers make it easy to identify each type, which can be beneficial for both natural and hand-pollination efforts.
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

export default PollinationProcess;
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const SpongeGourd = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Types of Gourds in the Philippines</Text>
        
        <Text style={styles.content}>
        The Philippines is home to several gourd varieties, each with unique characteristics, culinary uses, and cultural importance. Here are the most common types of gourds grown and used in Filipino cuisine and traditional practices:
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Sponge Gourd (Patola)</Text>
        </Text>
        <Text style={styles.bulletPoint}>
          <Text style={styles.bold}>Scientific Name: Luffa aegyptiaca or Luffa cylindrica</Text>
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Description:</Text> Known as patola in Filipino, sponge gourd is a long, green gourd with a smooth or slightly ridged skin. When young, it is tender and edible; when mature, it develops fibrous interiors that can be dried and used as natural sponges.
        </Text>
        <Text style={styles.bulletPoint}>
        • <Text style={styles.bold}>Uses:</Text> Commonly used in Filipino soups like misua with patola, where it adds a mild, slightly sweet flavor. Mature sponge gourds are dried and turned into bath or cleaning sponges, making them useful beyond the kitchen.
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

export default SpongeGourd;
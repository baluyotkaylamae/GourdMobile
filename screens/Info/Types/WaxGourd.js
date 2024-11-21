import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const WaxGourd = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Types of Gourds in the Philippines</Text>
        
        <Text style={styles.content}>
        The Philippines is home to several gourd varieties, each with unique characteristics, culinary uses, and cultural importance. Here are the most common types of gourds grown and used in Filipino cuisine and traditional practices:
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Wax Gourd (Kundol)</Text>
        </Text>
        <Text style={styles.bulletPoint}>
          <Text style={styles.bold}>Scientific Name: Benincasa hispida</Text>
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Description:</Text> Wax gourd, called kundol in the Philippines, is a large gourd with a waxy coating on its skin, giving it a whitish appearance. The flesh is mild and firm, ideal for cooking.
        </Text>
        <Text style={styles.bulletPoint}>
        • <Text style={styles.bold}>Uses:</Text> Primarily used in sweets, such as kundol candies, as well as savory dishes like soups and stir-fries. It’s also valued for its cooling properties in traditional medicine.
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

export default WaxGourd;
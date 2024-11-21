import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const BottleGourd = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Types of Gourds in the Philippines</Text>
        
        <Text style={styles.content}>
        The Philippines is home to several gourd varieties, each with unique characteristics, culinary uses, and cultural importance. Here are the most common types of gourds grown and used in Filipino cuisine and traditional practices:
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Bottle Gourd (Upo)</Text>
        </Text>
        <Text style={styles.bulletPoint}>
          <Text style={styles.bold}>Scientific Name: Lagenaria siceraria</Text>
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Description:</Text> Bottle gourd, or upo, is a large, light green gourd with a smooth skin. It has a bulbous shape, resembling a bottle when mature, and has a soft texture when cooked.
        </Text>
        <Text style={styles.bulletPoint}>
        • <Text style={styles.bold}>Uses:</Text> Often featured in dishes like ginataang upo (bottle gourd cooked in coconut milk) or sautéed upo with shrimp. Its neutral flavor makes it versatile in various recipes, where it absorbs the flavors of other ingredients.
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

export default BottleGourd;
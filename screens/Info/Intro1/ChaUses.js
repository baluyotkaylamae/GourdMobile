import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

function ChaUses() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Characteristics and Uses of Gourds</Text>
        
        <Text style={styles.content}>
          Gourds have been valued across cultures for both their nutritional and practical qualities. Not only are they edible and nutritious, but once dried, many gourds develop a hard outer shell, making them suitable for a variety of non-food uses. Here’s a look at the most common uses of gourds:
        </Text>
        
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Culinary Uses:</Text> Gourds are widely used in cuisines around the world. Bitter gourd, for instance, is a popular ingredient in Asian dishes due to its unique bitter flavor and health benefits, while sponge gourd is often enjoyed in soups and stir-fries.</Text>
        
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Medicinal Uses:</Text> Many types of gourds are believed to have health benefits. For example, bitter gourd is known for its ability to help regulate blood sugar levels and is high in vitamins A and C, iron, and potassium.</Text>
        
        <Text style={styles.bulletPoint}>• <Text style={styles.bold}>Decorative and Practical Applications:</Text> In addition to being a source of food, dried gourds have been used for centuries as natural containers for water and seeds, as well as for crafting musical instruments and decorative items.</Text>
        
      </ScrollView>
    </View>
  );
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

export default ChaUses;

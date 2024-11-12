import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Anatomy = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Anatomy of a Gourd Plant</Text>
        
        <Text style={styles.content}>
          Gourds are robust, vining plants characterized by several key structures, each with a specific function that supports growth and fruit production:
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Roots:</Text> Gourd plants have extensive root systems that help them absorb water and nutrients from the soil, supporting their rapid growth. These roots anchor the plant and enable it to thrive in nutrient-poor soils.
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Stems and Tendrils:</Text> The stems of gourds are long, flexible, and often vine-like, allowing them to spread horizontally across the ground or climb vertical structures. Tendrils, small coiling structures along the stem, help the plant attach to supports like fences or trellises, promoting stability as the plant grows.
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Leaves:</Text> Gourd leaves are typically large, lobed, and broad, helping to maximize sunlight absorption. Their shape also provides shade to the developing fruits below, protecting them from excessive sunlight.
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Flowers:</Text> Gourd plants produce both male and female flowers. These flowers are essential for reproduction and are generally large and yellow, attracting pollinators. Male flowers emerge first, followed by female flowers with a small, immature fruit at the base.
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Fruits:</Text> Once pollination occurs, the female flower's ovary develops into a mature gourd. Gourds vary in shape, size, and color, depending on the type (e.g., bitter gourd, sponge gourd, bottle gourd).
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

export default Anatomy;
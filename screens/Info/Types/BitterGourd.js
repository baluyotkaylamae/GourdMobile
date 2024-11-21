import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const BitterGourd = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Types of Gourds in the Philippines</Text>
        
        <Text style={styles.content}>
        The Philippines is home to several gourd varieties, each with unique characteristics, culinary uses, and cultural importance. Here are the most common types of gourds grown and used in Filipino cuisine and traditional practices:
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Bitter Gourd (Ampalaya)</Text>
        </Text>
        <Text style={styles.bulletPoint}>
          <Text style={styles.bold}>Scientific Name: Momordica charantia</Text>
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Description:</Text> Bitter gourd, known locally as ampalaya, has a distinct wrinkled skin and is famous for its bitter taste. It is a vine plant with dark green fruits that are either short and thick or long and thin, depending on the variety.
        </Text>
        <Text style={styles.bulletPoint}>
        • <Text style={styles.bold}>Uses:</Text> Often used in Filipino dishes like ginisang ampalaya (sautéed bitter gourd) with eggs and sometimes paired with meats or seafood. It is also valued for its medicinal properties, as it is believed to help regulate blood sugar levels.
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

export default BitterGourd;
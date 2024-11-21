import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const NutritionalProfile = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Health Benefits and Nutritional Value</Text>
        
        <Text style={styles.content}>
       Gourds are not only versatile in the kitchen but also packed with essential nutrients and health benefits. Understanding their nutritional profiles and medicinal uses can encourage healthier dietary choices.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Nutritional Profile of Each Gourd</Text>
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Bitter Gourd (Ampalaya):</Text>
        </Text>
        <Text style={styles.content}>
        • Vitamins: Rich in Vitamin C, which boosts the immune system and promotes healthy skin.
        </Text>
        <Text style={styles.content}>
        • Minerals: Contains potassium, which helps regulate blood pressure, and iron, essential for blood health.
        </Text>
        <Text style={styles.content}>
        •	Antioxidants: High levels of flavonoids and phenolic compounds that may help reduce oxidative stress.
        </Text>

        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Sponge Gourd (Patola):</Text>
        </Text>
        <Text style={styles.content}>
        • Vitamins: A good source of Vitamins A and C, promoting vision health and immune function.
        </Text>
        <Text style={styles.content}>
        • Minerals: Contains calcium and magnesium, vital for bone health.
        </Text>
        <Text style={styles.content}>
        •	Antioxidants: Offers dietary fiber, which aids in digestion and can help maintain healthy cholesterol levels.
        </Text>

        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Bottle Gourd (Upo):</Text>
        </Text>
        <Text style={styles.content}>
        • Vitamins: High in Vitamin B, particularly B1 (thiamine) and B2 (riboflavin), which support energy metabolism.
        </Text>
        <Text style={styles.content}>
        • Minerals: Rich in potassium, which helps maintain fluid balance and supports heart health.
        </Text>
        <Text style={styles.content}>
        •	Antioxidants: Contains a significant amount of water, making it hydrating and low in calories, which is beneficial for weight management.
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

export default NutritionalProfile;
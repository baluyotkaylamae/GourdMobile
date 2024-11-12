import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

function GourdPhi() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Gourds in the Philippines</Text>
        <Text style={styles.content}>
          In the Philippines, gourds have long held a place of importance, especially in traditional cuisine and folk medicine. Bitter gourd, or ampalaya, is a prominent ingredient in Filipino dishes like Pinakbet, a mixed vegetable stew with a unique flavor profile, and Ginisang Ampalaya, a sautéed dish combining bitter gourd with eggs, garlic, and onions. Bottle gourd, or upo, is also popular in soups and stews, often cooked with garlic, tomatoes, and fish to create flavorful and nutritious meals. In addition to its culinary uses, bitter gourd is deeply embedded in Filipino medicinal practices. Known for its potential to help manage blood sugar levels, ampalaya has been a traditional remedy for diabetes and is still used in herbal medicine across the country.
        </Text>
        <Text style={styles.content}>
          The cultural significance of gourds in the Philippines extends beyond cuisine and health. While gourds are less commonly depicted in Philippine folklore, they symbolize abundance and resilience due to their ability to grow in challenging conditions. In contemporary Filipino culture, ampalaya is widely available as a dietary supplement and herbal tea, reflecting an ongoing appreciation for its health benefits. Gourds continue to bridge the past with the present, maintaining a strong presence in Filipino culture as both a practical resource and a symbol of natural health.
        </Text>
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
});

export default GourdPhi;

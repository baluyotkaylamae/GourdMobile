import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MaleFemaleFlowers = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Male vs Female Flowers</Text>
        
        <Text style={styles.content}>
        Gourd plants are unique in having distinct male and female flowers on the same plant, a feature that plays a critical role in fruit production:
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Male Flowers:</Text>These flowers are typically smaller and grow on long, slender stems. They produce pollen but do not bear fruit. Male flowers tend to bloom first and in greater numbers than female flowers, ensuring ample pollen is available for pollination.
        </Text>
        
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Female Flowers:</Text>Female flowers are distinguishable by the small, immature fruit (ovary) visible at the base of the bloom. This ovary will develop into a full-sized gourd if the flower is successfully pollinated. Female flowers are often slightly larger and bloom after the initial appearance of male flowers.
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

export default MaleFemaleFlowers;
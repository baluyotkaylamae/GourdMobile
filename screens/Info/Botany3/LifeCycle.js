import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const LifeCycle = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Life Cycle of a Gourd Plant</Text>
        
        <Text style={styles.content}>
          Gourd plants have a well-defined life cycle that includes four primary stages, each crucial for the plant’s growth and fruit production:
        </Text>
        
        <Text style={styles.bulletPoint}>
          1. <Text style={styles.bold}>Germination:</Text> Seeds sprout under warm, moist conditions. Small roots and shoots emerge as the plant begins to establish itself.
        </Text>
        
        <Text style={styles.bulletPoint}>
          2. <Text style={styles.bold}>Vegetative Growth:</Text> The young plant quickly develops stems, leaves, and tendrils, forming a dense vine that spreads over time. This stage focuses on building a robust structure for supporting future flowers and fruits.
        </Text>
        
        <Text style={styles.bulletPoint}>
          3. <Text style={styles.bold}>Flowering:</Text> The plant begins to produce flowers, which appear in abundance. The first to bloom are male flowers, followed by female flowers after a short period. This stage is essential for setting up the conditions needed for pollination.
        </Text>
        
        <Text style={styles.bulletPoint}>
          4. <Text style={styles.bold}>Pollination and Fruiting:</Text> During pollination, pollen from male flowers is transferred to female flowers by insects or through hand-pollination. Once pollination is successful, the female flowers develop into fruits, which continue to grow and mature over several weeks. The fruits are ready for harvest when they reach full size or when they dry, depending on the gourd type.
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

export default LifeCycle;
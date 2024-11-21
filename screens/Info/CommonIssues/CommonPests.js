import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Pests = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Common Issues and Pests Affecting Gourds</Text>
        
        <Text style={styles.content}>
        Growing gourds can come with a variety of challenges, particularly from pests and diseases that can affect plant health and fruit yield. Understanding these common issues and how to manage them is essential for successful gourd cultivation.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Common Pests</Text>
        </Text>
        
        <Text style={styles.bulletPoint}>
          1. <Text style={styles.bold}>Aphids:</Text>
        </Text>
        <Text style={styles.content}>
        • Description: Small, soft-bodied insects that cluster on new growth and under leaves.
        </Text>
        <Text style={styles.content}>
        • Impacts: They feed on plant sap, weakening the plant and potentially spreading viral diseases.
        </Text>
        <Text style={styles.content}>
        • Management: Introduce natural predators like ladybugs or use insecticidal soap to control infestations.
        </Text>
        <Text style={styles.bulletPoint}>
          2. <Text style={styles.bold}>Squash Bugs:</Text>
        </Text>
        <Text style={styles.content}>
        • Description: Dark brown or gray bugs that suck sap from the plant.
        </Text>
        <Text style={styles.content}>
        • Impacts: Can cause wilting, yellowing leaves, and reduced fruit development.
        </Text>
        <Text style={styles.content}>
        • Management: Hand-picking and using row cover during early growth can help prevent squash bug infestations.
        </Text>

        <Text style={styles.bulletPoint}>
          3. <Text style={styles.bold}>Cucumber Beetles:</Text>
        </Text>
        <Text style={styles.content}>
        • Description: Yellow or green beetles with black stripes or spots.
        </Text>
        <Text style={styles.content}>
        • Impacts: They damage leaves and flowers and can spread bacterial wilt disease.
        </Text>
        <Text style={styles.content}>
        • Management: Crop rotation, introducing beneficial insects, and using traps can help control their populations.
        </Text>

        <Text style={styles.bulletPoint}>
          4. <Text style={styles.bold}>Fruit Flies:</Text>
        </Text>
        <Text style={styles.content}>
        • Description: Small flies that lay eggs in ripe fruit.
        </Text>
        <Text style={styles.content}>
        • Impacts: Larvae cause decay and can lead to significant crop loss.
        </Text>
        <Text style={styles.content}>
        • Management: Use bait traps and remove overripe fruits to prevent infestations.
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

export default Pests;
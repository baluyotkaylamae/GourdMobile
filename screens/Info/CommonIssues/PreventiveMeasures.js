import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PreventiveMeasures = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Common Issues and Pests Affecting Gourds</Text>
        
        <Text style={styles.content}>
        Growing gourds can come with a variety of challenges, particularly from pests and diseases that can affect plant health and fruit yield. Understanding these common issues and how to manage them is essential for successful gourd cultivation.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Preventive Measures</Text>
        </Text>
        
        <Text style={styles.bulletPoint}>
        1. <Text style={styles.bold}>Crop Rotation:</Text> Changing planting locations each season can help disrupt pest life cycles and reduce disease incidence.
        </Text>
        <Text style={styles.bulletPoint}>
        2. <Text style={styles.bold}>Companion Planting:</Text> Growing pest-repelling plants alongside gourds can help deter common pests. For example, marigolds are known to repel nematodes and certain beetles.
        </Text>
        <Text style={styles.bulletPoint}>
        3. <Text style={styles.bold}>Regular Monitoring:</Text> Regularly inspect plants for early signs of pest infestations or disease symptoms. Early detection can lead to more effective control measures.
        </Text>
        <Text style={styles.bulletPoint}>
        4. <Text style={styles.bold}>Sanitation Practices:</Text> Keeping the garden free of debris and removing infected plants promptly can help prevent the spread of diseases.
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

export default PreventiveMeasures;
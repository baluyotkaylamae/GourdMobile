import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const Diseases = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Common Issues and Pests Affecting Gourds</Text>
        
        <Text style={styles.content}>
        Growing gourds can come with a variety of challenges, particularly from pests and diseases that can affect plant health and fruit yield. Understanding these common issues and how to manage them is essential for successful gourd cultivation.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Common Diseases</Text>
        </Text>
        
        <Text style={styles.bulletPoint}>
          1. <Text style={styles.bold}>Powdery Mildew:</Text>
        </Text>
        <Text style={styles.content}>
        • Description: A fungal disease that appears as white, powdery spots on leaves.
        </Text>
        <Text style={styles.content}>
        • Impacts: Affects photosynthesis and can lead to premature leaf drop.
        </Text>
        <Text style={styles.content}>
        • Management: Improve air circulation, avoid overhead watering, and apply fungicides if necessary.
        </Text>
        <Text style={styles.bulletPoint}>
          2. <Text style={styles.bold}>Downy Mildew:</Text>
        </Text>
        <Text style={styles.content}>
        • Description: A fungal disease characterized by yellow patches on the upper leaf surface and gray mold underneath.
        </Text>
        <Text style={styles.content}>
        • Impacts: Reduces photosynthesis and weakens the plant.
        </Text>
        <Text style={styles.content}>
        • Management: Rotate crops, choose resistant varieties, and apply fungicides as a preventive measure.
        </Text>

        <Text style={styles.bulletPoint}>
          3. <Text style={styles.bold}>Bacterial Wilt:</Text>
        </Text>
        <Text style={styles.content}>
        • Description: Caused by bacteria spread by cucumber beetles.
        </Text>
        <Text style={styles.content}>
        • Impacts: Causes sudden wilting of leaves and eventual plant death.
        </Text>
        <Text style={styles.content}>
        • Management: Control cucumber beetle populations and remove infected plants to prevent spread.
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

export default Diseases;
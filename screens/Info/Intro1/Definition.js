import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

function Definition() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Introduction</Text>
      <Text style={styles.content}>
        Gourds belong to the Cucurbitaceae family, which is a large group of plants commonly known as cucurbits. This family includes various species such as pumpkins, squash, melons, and cucumbers. Gourds are vining plants that grow quickly, often spreading with the help of large leaves and tendrils. Their fruits, typically known as "gourds," can have a wide range of shapes and colors. Many gourds are known for their hard, durable rinds, which make them useful beyond culinary applications.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F8E6",
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

export default Definition;

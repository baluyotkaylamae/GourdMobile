import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

function GourdWorld() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Gourds Around the World</Text>
        <Text style={styles.content}>
          Gourds are among the oldest cultivated plants in human history, with evidence of domestication stretching back over 10,000 years. Civilizations across Africa, Asia, and the Americas grew gourds not just as a food source but for their versatility. Once dried, the hard shells of gourds made them ideal natural containers, commonly used for storing water, grains, and seeds. The durability of dried gourds also led to their adaptation into tools and even musical instruments. In regions with limited access to manufactured goods, gourds became essential to daily life, especially in arid areas where other materials were scarce.
        </Text>
        <Text style={styles.content}>
          The unique shapes and smooth surface of gourds have also made them a popular medium for artistic and cultural expression worldwide. Many cultures would carve, paint, or decorate gourds, often for ritualistic or ceremonial purposes. In some traditions, they are still used as offerings or as part of cultural ceremonies. Gourds have also had a significant role in traditional music, especially as percussion instruments. For example, in West Africa, the shekere is a gourd-based instrument covered with beads that produce rhythmic sounds, while maracas in Latin America are crafted using small gourds. In India, dried gourds are used in stringed instruments like the tanpura and sitar, serving as resonators and adding depth to the sound.
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

export default GourdWorld;

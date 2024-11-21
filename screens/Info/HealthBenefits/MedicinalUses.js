import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const MedicinalUses = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Medicinal Uses</Text>
        
        <Text style={styles.content}>
        Gourds have been traditionally used in various cultures for their health benefits. Here are some notable medicinal uses:
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Blood Sugar Management:</Text> Bitter gourd is known for its potential to lower blood sugar levels, making it beneficial for individuals with diabetes. It contains compounds that mimic insulin and may improve glucose uptake.
        </Text>
        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Digestive Health:</Text> The high fiber content in sponge and bottle gourd aids digestion, prevents constipation, and promotes a healthy gut. Fiber-rich foods can help maintain bowel regularity and reduce the risk of digestive disorders.
        </Text>

        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Skin Health:</Text> Bitter gourd is often used in traditional medicine for its anti-inflammatory and antibacterial properties. It may help treat skin conditions like acne and psoriasis when consumed or applied topically.
        </Text>

        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Hydration and Detoxification:</Text> Bottle gourd’s high-water content helps keep the body hydrated, while its diuretic properties may support detoxification processes by promoting urination and flushing out toxins.
        </Text>

        <Text style={styles.bulletPoint}>
          • <Text style={styles.bold}>Weight Management:</Text> Due to their low calorie and high fiber content, gourds like sponge and bottle gourd can aid in weight loss by providing satiety without excessive caloric intake.
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

export default MedicinalUses;
import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const InfoMenu = ({ navigation }) => {
    const [expandedTopics, setExpandedTopics] = useState({});

    const toggleTopic = (topic) => {
        setExpandedTopics((prev) => ({
            ...prev,
            [topic]: !prev[topic],
        }));
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>Info Hub</Text>

            {/* Introduction to Gourds */}
            <TouchableOpacity style={styles.card} onPress={() => toggleTopic("Introduction")}>
                <Text style={styles.cardTitle}>🌱 Introduction to Gourds</Text>
                {expandedTopics["Introduction"] && (
                    <View style={styles.subtopics}>
                        <TouchableOpacity onPress={() => navigation.navigate("Definition")}>
                            <Text style={styles.subtopic}>Definition</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("ChaUses")}>
                            <Text style={styles.subtopic}>Characteristics and Uses of Gourds</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>

            {/* History and Cultural Significance */}
            <TouchableOpacity style={styles.card} onPress={() => toggleTopic("History")}>
                <Text style={styles.cardTitle}>🌿 History and Cultural Significance of Gourds</Text>
                {expandedTopics["History"] && (
                    <View style={styles.subtopics}>
                        <TouchableOpacity onPress={() => navigation.navigate("GourdWorld")}>
                            <Text style={styles.subtopic}>Gourds Around the World</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("GourdPhi")}>
                            <Text style={styles.subtopic}>Gourds in the Philippines</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>

            {/* Botany of Gourds */}
            <TouchableOpacity style={styles.card} onPress={() => toggleTopic("Botany")}>
                <Text style={styles.cardTitle}>🍃 Botany of Gourds</Text>
                {expandedTopics["Botany"] && (
                    <View style={styles.subtopics}>
                        <TouchableOpacity onPress={() => navigation.navigate("Anatomy")}>
                            <Text style={styles.subtopic}>Anatomy of a Gourd Plant</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("LifeCycle")}>
                            <Text style={styles.subtopic}>Life Cycle of a Gourd Plant</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>

            {/* Understanding Flower Gender in Gourds */}
            <TouchableOpacity style={styles.card} onPress={() => toggleTopic("FlowerGender")}>
                <Text style={styles.cardTitle}>🌸 Understanding Flower Gender in Gourds</Text>
                {expandedTopics["FlowerGender"] && (
                    <View style={styles.subtopics}>
                        <TouchableOpacity onPress={() => navigation.navigate("MaleFemaleFlowers")}>
                            <Text style={styles.subtopic}>Male vs. Female Flowers</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("ImportanceFlowers")}>
                            <Text style={styles.subtopic}>Importance of Male and Female Flowers in Pollination and Fruit Production</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("PollinationProcess")}>
                            <Text style={styles.subtopic}>Pollination Process</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("PollinationChallenges")}>
                            <Text style={styles.subtopic}>Challenges in Pollination</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>

            {/* Types of Gourds in the Philippines */}
            <TouchableOpacity style={styles.card} onPress={() => toggleTopic("TypesInPhilippines")}>
                <Text style={styles.cardTitle}>🎋 Types of Gourds in the Philippines</Text>
                {expandedTopics["TypesInPhilippines"] && (
                    <View style={styles.subtopics}>
                        <TouchableOpacity onPress={() => navigation.navigate("BitterGourd")}>
                            <Text style={styles.subtopic}>Bitter Gourd (Ampalaya)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("SpongeGourd")}>
                            <Text style={styles.subtopic}>Sponge Gourd (Patola)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("BottleGourd")}>
                            <Text style={styles.subtopic}>Bottle Gourd (Upo)</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("WaxGourd")}>
                            <Text style={styles.subtopic}>Wax Gourd (Kundol)</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>

            {/* Health Benefits and Nutritional Value */}
            <TouchableOpacity style={styles.card} onPress={() => toggleTopic("HealthBenefits")}>
                <Text style={styles.cardTitle}>❤️ Health Benefits and Nutritional Value</Text>
                {expandedTopics["HealthBenefits"] && (
                    <View style={styles.subtopics}>
                        <TouchableOpacity onPress={() => navigation.navigate("NutritionalProfile")}>
                            <Text style={styles.subtopic}>Nutritional Profile of Each Gourd</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("MedicinalUses")}>
                            <Text style={styles.subtopic}>Medicinal Uses</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>

            {/* Common Issues and Pests Affecting Gourds */}
            <TouchableOpacity style={styles.card} onPress={() => toggleTopic("CommonIssues")}>
                <Text style={styles.cardTitle}>🐞 Common Issues and Pests Affecting Gourds</Text>
                {expandedTopics["CommonIssues"] && (
                    <View style={styles.subtopics}>
                        <TouchableOpacity onPress={() => navigation.navigate("Pests")}>
                            <Text style={styles.subtopic}>Common Pests</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("Diseases")}>
                            <Text style={styles.subtopic}>Common Diseases</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("PreventiveMeasures")}>
                            <Text style={styles.subtopic}>Preventive Measures</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFFFFF",
    },
    header: {
        fontSize: 26,
        fontWeight: "600",
        marginBottom: 20,
        color: "#2D5F2E",
        textAlign: "center",
        fontFamily: "serif",
    },
    card: {
        backgroundColor: "#FFFFFF",
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: 15,
        marginVertical: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 5 },
        shadowRadius: 10,
        elevation: 5,
        borderWidth: 1,
        borderColor: "#9ECD91",
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: "500",
        color: "#3C8C3D",
        fontFamily: "serif",
    },
    subtopics: {
        marginTop: 10,
        paddingLeft: 10,
        backgroundColor: "#DAF2DE",
        borderRadius: 10,
        padding: 10,
    },
    subtopic: {
        fontSize: 16,
        color: "#555",
        marginVertical: 5,
    },
});

export default InfoMenu;

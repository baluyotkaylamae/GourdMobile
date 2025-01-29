import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AdminMenu = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Categories")}>
                <Text style={styles.buttonText}>View Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("GourdType")}>
                <Text style={styles.buttonText}> View Gourd Types</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("GourdVarieties")}>
                <Text style={styles.buttonText}> View Gourd Varieties</Text>
            </TouchableOpacity>


            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Users")}>
                <Text style={styles.buttonText}>Manage Users</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Dashboard")}>
                <Text style={styles.buttonText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("PostManagement")}>
                <Text style={styles.buttonText}>Post Management</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#E0F8E6",
    },
    title: {
        fontSize: 36, // Increased font size for emphasis
        fontWeight: "700", // Changed to semi-bold for better readability
        color: "#2c3e50",
        marginBottom: 50,
        textTransform: "uppercase",
        letterSpacing: 3,
        textAlign: "center", // Centered text alignment
    },
    button: {
        backgroundColor: "#55c2a7",
        borderRadius: 30,
        paddingVertical: 15,
        marginVertical: 12, // Adjusted margin for better spacing
        width: "80%",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4, // Increased elevation for better shadow effect
        transition: 'background-color 0.3s ease', // Smooth transition for hover effect (if applicable)
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600", // Changed to medium for a cleaner look
        textTransform: "uppercase",
        letterSpacing: 1.2, // Adjusted letter spacing
    },
});

export default AdminMenu;

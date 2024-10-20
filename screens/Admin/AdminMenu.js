import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AdminMenu = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Admin Dashboard</Text>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Categories")}>
                <Text style={styles.buttonText}>View Categories</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Users")}>
                <Text style={styles.buttonText}>Manage Users</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Charts")}>
                <Text style={styles.buttonText}>View Charts</Text>
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
        backgroundColor: "#e8faf6", 
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: "#2c3e50", 
        marginBottom: 40,
        textTransform: "uppercase", 
        letterSpacing: 2,
    },
    button: {
        backgroundColor: "#55c2a7", 
        borderRadius: 30, 
        paddingVertical: 15, 
        paddingHorizontal: 20,
        marginVertical: 10,
        width: "80%",
        alignItems: "center",
        shadowColor: "#000", 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3, 
    },
    buttonText: {
        color: "#fff", 
        fontSize: 18,
        fontWeight: "bold",
        textTransform: "uppercase", 
        letterSpacing: 1.5, 
    },
});

export default AdminMenu;

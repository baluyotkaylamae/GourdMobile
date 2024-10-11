// UserProfile.js
import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions"; // Ensure this path is correct

const UserProfile = () => {
    const context = useContext(AuthGlobal);
    const [userProfile, setUserProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            const fetchUserProfile = async () => {
                setLoading(true);
                try {
                    const token = await AsyncStorage.getItem("jwt");
                    const userId = context.stateUser.user?.userId;
                    if (userId && token) {
                        const response = await axios.get(`${baseURL}users/${userId}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        });
                        setUserProfile(response.data.user);
                    } else {
                        console.error("User ID or token is missing");
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error.message || error);
                } finally {
                    setLoading(false);
                }
            };

            if (!context.stateUser.isAuthenticated) {
                navigation.navigate("Login");
                return;
            }

            fetchUserProfile();
        }, [context.stateUser.isAuthenticated])
    );

    const handleLogout = async () => {
        await AsyncStorage.removeItem("jwt");
        logoutUser(context.dispatch);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007BFF" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: userProfile.image || 'https://via.placeholder.com/100' }} // Fallback image for testing
                style={styles.profileImage}
                onError={(error) => console.error("Image loading error:", error.nativeEvent.error)} // Log error if image fails to load
            />
            <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Name: {userProfile.name || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Email: {userProfile.email || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Phone: {userProfile.phone || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Street: {userProfile.street || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Apartment: {userProfile.apartment || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Zip: {userProfile.zip || 'N/A'}</Text>
                <Text style={styles.infoLabel}>City: {userProfile.city || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Country: {userProfile.country || 'N/A'}</Text>
            </View>
            <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() => navigation.navigate("UpdateProfile", { userProfile })}
            >
                <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.logoutButton}
                onPress={handleLogout}
            >
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#93e4c1', // Using the first color for background
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderColor: '#3baea0', // Using the second color for border
        borderWidth: 2,
        backgroundColor: '#ffffff', // Fallback background for image
    },
    infoContainer: {
        marginBottom: 20,
        width: '100%',
        backgroundColor: '#ffffff', // White background for info section
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2, // For Android shadow
    },
    infoLabel: {
        color: '#118a7e', // Using the third color for text
        fontSize: 16, // Slightly larger font for better readability
        fontWeight: '500', // Lighter font weight for a modern look
        marginVertical: 5,
    },
    editProfileButton: {
        backgroundColor: '#1f6f78', // Using the fourth color for button
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 10,
        width: '100%', // Full width for buttons
        paddingVertical: 12, // More padding for buttons
    },
    editProfileText: {
        color: 'white',
        fontWeight: 'bold', // Bold text for buttons
    },
    logoutButton: {
        backgroundColor: '#FF4D4D', // Keeping the same color for logout button
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '100%',
        paddingVertical: 12, // More padding for buttons
    },
    logoutText: {
        color: 'white',
        fontWeight: 'bold', // Bold text for buttons
    },
});

export default UserProfile;

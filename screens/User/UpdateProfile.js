// UpdateProfile.js
import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import InputPrfl from "../../Shared/Form/InputPrfl"; // Ensure this path is correct
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import AuthGlobal from "../../Context/Store/AuthGlobal";

const UpdateProfile = ({ route, navigation }) => {
    const { userProfile } = route.params;
    const context = useContext(AuthGlobal);
    const [updatedProfile, setUpdatedProfile] = useState(userProfile);
    const [loading, setLoading] = useState(false);

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("jwt");
            const userId = context.stateUser.user?.userId;
            if (userId) {
                await axios.put(`${baseURL}users/${userId}`, updatedProfile, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                navigation.navigate("UserProfile"); // Navigate back to UserProfile after saving
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <>
                    <Image
                        source={{ uri: updatedProfile.image }} // Display the user's profile picture
                        style={styles.profileImage}
                    />
                    {['name', 'email', 'phone'].map((field) => (
                        <View style={styles.infoContainer} key={field}>
                            <Text style={styles.infoLabel}>{field.charAt(0).toUpperCase() + field.slice(1)}</Text>
                            <InputPrfl
                                placeholder={`Enter your ${field}`}
                                onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, [field]: text })}
                                value={updatedProfile[field]}
                            />
                        </View>
                    ))}
                    <TouchableOpacity style={styles.saveProfileButton} onPress={handleSaveProfile}>
                        <Text style={styles.saveProfileText}>Save Profile</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    infoContainer: {
        marginBottom: 20,
        width: '100%',
    },
    infoLabel: {
        color: '#262422',
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 5,
    },
    saveProfileButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    saveProfileText: {
        color: 'white',
    },
});

export default UpdateProfile;

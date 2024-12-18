import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import { logoutUser } from "../../Context/Actions/Auth.actions"; // Ensure this path is correct

const UserDetails = ({ route }) => {
    const context = useContext(AuthGlobal);
    const [userDetails, setUserDetails] = useState(null); // Start with null to indicate loading
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { userId } = route.params; // Get the user ID from route params

    useEffect(() => {
        const fetchUserDetails = async () => {
            setLoading(true);
            try {
                const token = await AsyncStorage.getItem('jwt');
                if (userId && token) {
                    const response = await axios.get(`${baseURL}users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserDetails(response.data.user || {});
                } else {
                    console.error('User ID or token is missing');
                }
            } catch (error) {
                console.error('Error fetching user details:', error.response ? error.response.data : error.message);
            } finally {
                setLoading(false);
            }
        };

        if (!context.stateUser.isAuthenticated) {
            navigation.navigate('Login');
            return;
        }

        fetchUserDetails();
    }, [userId, context.stateUser.isAuthenticated]);

    // const handleLogout = async () => {
    //     await AsyncStorage.removeItem("jwt");
    //     logoutUser(context.dispatch);
    // };

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('jwt');
            const userId = context.stateUser?.user?.userId; // Assuming you store userId in context
    
            // Send logout request to the backend
            await axios.post(`${baseURL}users/logout`, { userId }, {
                headers: { Authorization: `Bearer ${token}` },
            });
    
            // Remove token from AsyncStorage
            await AsyncStorage.removeItem('jwt');
            logoutUser(context.dispatch); // Dispatch logout action
            navigation.navigate('Login'); // Navigate to login screen
        } catch (error) {
            console.error('Logout error:', error.response ? error.response.data : error.message);
        }
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
                source={{ uri: userDetails?.image || 'https://via.placeholder.com/100' }} // Safe access with optional chaining
                style={styles.profileImage}
            />
            <View style={styles.infoContainer}>
                <Text style={styles.infoLabel}>Name: {userDetails?.name || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Email: {userDetails?.email || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Phone: {userDetails?.phone || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Street: {userDetails?.street || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Apartment: {userDetails?.apartment || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Zip: {userDetails?.zip || 'N/A'}</Text>
                <Text style={styles.infoLabel}>City: {userDetails?.city || 'N/A'}</Text>
                <Text style={styles.infoLabel}>Country: {userDetails?.country || 'N/A'}</Text>
            </View>

            <TouchableOpacity
                style={styles.editProfileButton}
                onPress={() => navigation.navigate('UpdateProfile', { userDetails })}
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
        padding: 20,
        backgroundColor: '#E0F8E6',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginBottom: 20,
    },
    infoContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 16,
        marginVertical: 5,
    },
    editProfileButton: {
        backgroundColor: '#007BFF',
        padding: 12,
        borderRadius: 5,
        marginBottom: 10,
        alignItems: 'center',
    },
    editProfileText: {
        color: '#fff',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#FF5733',
        padding: 12,
        borderRadius: 5,
        alignIt: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        alignIt: 'center',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',   
    },
});

export default UserDetails;

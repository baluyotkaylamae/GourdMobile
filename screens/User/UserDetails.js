import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import { logoutUser } from "../../Context/Actions/Auth.actions"; // Ensure this path is correct

const UserDetails = ({ route }) => {
    const context = useContext(AuthGlobal);
    const [userDetails, setUserDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const { userId } = route.params;

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

    const handleLogout = async () => {
        try {
            const token = await AsyncStorage.getItem('jwt');
            const userId = context.stateUser?.user?.userId;

            await axios.post(`${baseURL}users/logout`, { userId }, {
                headers: { Authorization: `Bearer ${token}` },
            });

            await AsyncStorage.removeItem('jwt');
            logoutUser(context.dispatch);
            navigation.navigate('Login');
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
        <ScrollView contentContainerStyle={styles.container}>
            <Image
                source={{ uri: userDetails?.image || 'https://via.placeholder.com/120' }}
                style={styles.profileImage}
            />
            <Text style={styles.userName}>{userDetails?.name || 'Anonymous User'}</Text>
            <View style={styles.infoCard}>
                <Text style={styles.infoText}>Email: {userDetails?.email || 'N/A'}</Text>
                <Text style={styles.infoText}>Phone: {userDetails?.phone || 'N/A'}</Text>
                <Text style={styles.infoText}>Street: {userDetails?.street || 'N/A'}</Text>
                <Text style={styles.infoText}>Apartment: {userDetails?.apartment || 'N/A'}</Text>
                <Text style={styles.infoText}>Zip: {userDetails?.zip || 'N/A'}</Text>
                <Text style={styles.infoText}>City: {userDetails?.city || 'N/A'}</Text>
                <Text style={styles.infoText}>Country: {userDetails?.country || 'N/A'}</Text>
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('UpdateProfile', { userDetails })}
            >
                <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={handleLogout}>
                <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        alignItems: 'center',
        backgroundColor: '#E0F8E6',
        paddingVertical: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 15,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    infoCard: {
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        marginBottom: 20,
    },
    infoText: {
        fontSize: 16,
        color: '#555',
        marginVertical: 5,
        
    },
    button: {
        width: '90%',
        backgroundColor: '#007BFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default UserDetails;

import React, { useContext, useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import { logoutUser } from "../../Context/Actions/Auth.actions";
import InputPrfl from "../../Shared/Form/InputPrfl";

const UserProfile = (props) => {
    const context = useContext(AuthGlobal);
    const [userProfile, setUserProfile] = useState('');
    const [image, setImage] = useState(null);
    const [editing, setEditing] = useState(false);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            if (context.stateUser.isAuthenticated === false || context.stateUser.isAuthenticated === null) {
                navigation.navigate("Login");
            }
            AsyncStorage.getItem("jwt")
                .then((res) => {
                    axios
                        .get(`${baseURL}users/${context.stateUser.user.userId}`, {
                            headers: { Authorization: `Bearer ${res}` },
                        })
                        .then((user) => {
                            setUserProfile(user.data);
                            setImage(user.data.image);
                        });
                })
                .catch((error) => console.log(error));
            return () => {
                setUserProfile('');
            };
        }, [context.stateUser.isAuthenticated])
    );

    const handleEditProfile = () => {
        setEditing(true);
    };

    const handleSaveProfile = () => {
        AsyncStorage.getItem("jwt")
            .then((token) => {
                axios
                    .put(`${baseURL}users/${context.stateUser.user.userId}`, userProfile, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((response) => {
                        console.log("Profile updated successfully:", response.data);
                        setEditing(false);
                    })
                    .catch((error) => {
                        console.error("Error updating profile:", error);
                    });
            })
            .catch((error) => {
                console.error("Error retrieving JWT token:", error);
            });
    };

    const handleChangeName = (text) => {
        setUserProfile({ ...userProfile, name: text });
    };

    const handleChangeEmail = (text) => {
        setUserProfile({ ...userProfile, email: text });
    };

    const handleChangePhone = (text) => {
        setUserProfile({ ...userProfile, phone: text });
    };

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: image ? image : 'https://via.placeholder.com/139x139' }}
                    style={styles.profileImage}
                />
            </View>

            <View>
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Name</Text>
                    <View style={styles.inputContainer}>
                        <InputPrfl
                            placeholder="Enter your name"
                            onChangeText={handleChangeName}
                            value={editing ? userProfile.name : userProfile ? userProfile.name : ''}
                            editable={editing}
                        />
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Email</Text>
                    <View style={styles.inputContainer}>
                        <InputPrfl
                            placeholder="Enter your email"
                            onChangeText={handleChangeEmail}
                            value={editing ? userProfile.email : userProfile ? userProfile.email : ''}
                            editable={editing}
                        />
                    </View>
                </View>

                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Phone Number</Text>
                    <View style={styles.inputContainer}>
                        <InputPrfl
                            placeholder="Enter your phone number"
                            onChangeText={handleChangePhone}
                            value={editing ? userProfile.phone : userProfile ? userProfile.phone : ''}
                            editable={editing}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.actionContainer}>
                {editing ? (
                    <TouchableOpacity style={styles.updateProfileButton} onPress={handleSaveProfile}>
                        <Text style={styles.updateProfileText}>Save Profile</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.updateProfileButton} onPress={handleEditProfile}>
                        <Text style={styles.updateProfileText}>Edit Profile</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={styles.logoutContainer}
                    onPress={() => {
                        AsyncStorage.removeItem("jwt");
                        logoutUser(context.dispatch);
                    }}
                >
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
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
    profileContainer: {
        marginBottom: 20,
    },
    profileImage: {
        width: 139,
        height: 139,
        borderRadius: 70,
        backgroundColor: '#B99960',
    },
    infoContainer: {
        marginBottom: 20,
    },
    infoLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
    updateProfileButton: {
        backgroundColor: '#664229',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    updateProfileText: {
        color: 'white',
        fontWeight: '600',
    },
    logoutContainer: {
        padding: 10,
        borderRadius: 5,
        borderColor: '#664229',
        borderWidth: 1,
    },
    logoutText: {
        color: '#664229',
        fontWeight: '600',
    },
});

export default UserProfile;

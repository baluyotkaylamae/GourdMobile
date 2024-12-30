import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, ActivityIndicator } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import InputPrfl from "../../Shared/Form/InputPrfl";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import AuthGlobal from "../../Context/Store/AuthGlobal";
import * as ImagePicker from "expo-image-picker";
import { Camera } from 'expo-camera';
import mime from 'mime';

const UpdateProfile = ({ route, navigation }) => {
    const { userDetails } = route.params;
    const context = useContext(AuthGlobal);
    const [updatedProfile, setUpdatedProfile] = useState(userDetails);
    const [loading, setLoading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    useEffect(() => {
        const requestPermissions = async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (mediaLibraryStatus.status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        };
        requestPermissions();
    }, []);

    const handleImagePick = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUpdatedProfile({ ...updatedProfile, image: result.assets[0].uri });
        }
    };

    const takePhoto = async () => {
        if (hasCameraPermission === null) {
            alert("Camera permission is needed.");
            return;
        }
        if (!hasCameraPermission) {
            alert("No access to the camera.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setUpdatedProfile({ ...updatedProfile, image: result.assets[0].uri });
        }
    };

    const handleSaveProfile = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem("jwt");
            const userId = context.stateUser.user?.userId;
    
            if (userId) {
                const formData = new FormData();
    
                for (const key in updatedProfile) {
                    if (key === 'image' && updatedProfile.image) {
                        formData.append("image", {
                            uri: updatedProfile.image,
                            type: mime.getType(updatedProfile.image) || 'image/jpeg',
                            name: updatedProfile.image.split("/").pop(),
                        });
                    } else {
                        formData.append(key, updatedProfile[key]);
                    }
                }
    
                const response = await axios.put(`${baseURL}users/${userId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
    
                console.log("Update response:", response.data);
                navigation.navigate("User Profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#007BFF" />
                ) : (
                    <>
                        <TouchableOpacity onPress={handleImagePick}>
                            <Image
                                source={{ uri: updatedProfile.image || 'https://via.placeholder.com/120' }} // Default image URL
                                style={styles.profileImage}
                            />
                        </TouchableOpacity>

                        {/* Buttons for Image Picker and Camera */}
                        <View style={styles.imageContainer}>
                            <TouchableOpacity style={styles.imagePicker} onPress={handleImagePick}>
                                <Icon style={{ color: "white" }} name="photo" />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.imagePicker} onPress={takePhoto}>
                                <Icon style={{ color: "white" }} name="camera" />
                            </TouchableOpacity>
                        </View>

                        {['name', 'email', 'phone', 'street', 'apartment', 'zip', 'city', 'country'].map((field) => (
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
                        
                        {/* Back to Profile Button */}
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("User Profile")}>
                            <Text style={styles.backButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#E0F8E6',
    },
    container: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    backButton: {
        alignItems: 'center',
        backgroundColor: 'red', 
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 20, 
        width: '90%', 
    },
    backButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        borderColor: '#3baea0',
        borderWidth: 2,
        backgroundColor: '#ffffff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    imagePicker: {
        backgroundColor: "#1f6f78",
        padding: 10,
        borderRadius: 100,
        marginHorizontal: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 2,
    },
    infoContainer: {
        marginBottom: 15,
        width: '90%',
    },
    infoLabel: {
        color: '#118a7e',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    saveProfileButton: {
        backgroundColor: '#118a7e',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        width: '90%',
    },
    saveProfileText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UpdateProfile;

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

const UpdateProfile = ({ route, navigation }) => {
    const { userProfile } = route.params;
    const context = useContext(AuthGlobal);
    const [updatedProfile, setUpdatedProfile] = useState(userProfile);
    const [loading, setLoading] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState(null);

    // Request permissions for camera and media library
    useEffect(() => {
        (async () => {
            const cameraStatus = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(cameraStatus.status === 'granted');

            const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (mediaLibraryStatus.status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    const handleImagePick = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
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
        } else if (hasCameraPermission === false) {
            alert("No access to the camera.");
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
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
                let formData = new FormData();

                for (const key in updatedProfile) {
                    if (key === 'image' && updatedProfile.image) {
                        formData.append("image", {
                            uri: updatedProfile.image,
                            type: 'image/jpeg',
                            name: updatedProfile.image.split('/').pop(),
                        });
                    } else {
                        formData.append(key, updatedProfile[key]);
                    }
                }

                await axios.put(`${baseURL}users/${userId}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                });

                navigation.navigate("User Profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.container}>
                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : (
                    <>
                        <TouchableOpacity onPress={handleImagePick}>
                            <Image
                                source={{ uri: updatedProfile.image || 'https://example.com/default-image.png' }} // Use your default image URL
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
    },
    container: {
        flex: 1,
        width: '90%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30,
        backgroundColor: 'white',
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    imageContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
    imagePicker: {
        backgroundColor: "#664229",
        padding: 8,
        borderRadius: 100,
        marginHorizontal: 5,
    },
    infoContainer: {
        marginBottom: 15,
        width: '100%',
    },
    infoLabel: {
        color: '#262422',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    saveProfileButton: {
        backgroundColor: '#007BFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 30,
        width: '100%',
    },
    saveProfileText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UpdateProfile;

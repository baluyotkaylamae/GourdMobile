import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from '@react-navigation/native';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import FormContainer from "../../Shared/Form/FormContainer";
import InputUser from "../../Shared/Form/InputUser";
import HeaderReg from "../../Shared/HeaderReg";
import RegGreeting from "../../Shared/RegGreeting";
import Error from "../../Shared/Error";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker"; // Ensure this is imported
import { Camera } from 'expo-camera'; // Import Camera
import Icon from "react-native-vector-icons/FontAwesome";
import mime from "mime";

const { height, width } = Dimensions.get("window");

const Register = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [street, setStreet] = useState("");
    const [apartment, setApartment] = useState("");
    const [zip, setZip] = useState("");
    const [city, setCity] = useState("");
    const [country, setCountry] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [hasCameraPermission, setHasCameraPermission] = useState(null);
    const [image, setImage] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasCameraPermission(status === 'granted');
        })();
    }, []);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
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
            setImage(result.assets[0].uri);
        }
    };

    const register = () => {
        if (!email || !name || !phone || !password) {
            setError("Please fill in the form correctly");
            return;
        }
    
        const formData = new FormData();
        formData.append("image", {
            uri: image,
            type: mime.getType(image),
            name: image.split("/").pop(),
        });
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("phone", phone);
        formData.append("street", street);
        formData.append("apartment", apartment);
        formData.append("zip", zip);
        formData.append("city", city);
        formData.append("country", country);
        formData.append("isAdmin", false);
    
        const config = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        };
    
        axios
            .post(`${baseURL}users/register`, formData, config)
            .then((res) => {
                if (res.status === 201) {
                    Toast.show({
                        topOffset: 60,
                        type: "success",
                        text1: "Registration Succeeded",
                        text2: "Please Login into your account",
                    });
    
                    // Clear all input fields
                    setEmail("");
                    setName("");
                    setPhone("");
                    setStreet("");
                    setApartment("");
                    setZip("");
                    setCity("");
                    setCountry("");
                    setPassword("");
                    setImage(null);
    
                    setTimeout(() => {
                        navigation.navigate("Login");
                    }, 500);
                }
            })
            .catch((error) => {
                Toast.show({
                    position: 'bottom',
                    bottomOffset: 20,
                    type: "error",
                    text1: "Something went wrong",
                    text2: "Please try again",
                });
                console.error(error.message);
            });
    };

    return (
        <KeyboardAwareScrollView
            style={{ height: '80%' }}
            viewIsInsideTabBar={true}
            extraHeight={200}
            enableOnAndroid={true}
            showsVerticalScrollIndicator={false}
            backgroundColor={"#FFFFFF"}
        >
            <HeaderReg />
            <RegGreeting />
            <FormContainer>
                <InputUser
                    placeholder={"Email"}
                    name={"email"}
                    id={"email"}
                    onChangeText={(text) => setEmail(text.toLowerCase())}
                />
                <InputUser
                    placeholder={"Name"}
                    name={"name"}
                    id={"name"}
                    onChangeText={(text) => setName(text)}
                />
                <InputUser
                    placeholder={"Phone Number"}
                    name={"phone"}
                    id={"phone"}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setPhone(text)}
                />
                <InputUser
                    placeholder={"Street"}
                    name={"street"}
                    id={"street"}
                    onChangeText={(text) => setStreet(text)}
                />
                <InputUser
                    placeholder={"Apartment"}
                    name={"apartment"}
                    id={"apartment"}
                    onChangeText={(text) => setApartment(text)}
                />
                <InputUser
                    placeholder={"ZiP"}
                    name={"zip"}
                    id={"zip"}
                    keyboardType={"numeric"}
                    onChangeText={(text) => setZip(text)}
                />
                <InputUser
                    placeholder={"City"}
                    name={"city"}
                    id={"city"}
                    onChangeText={(text) => setCity(text)}
                />
                <InputUser
                    placeholder={"Country"}
                    name={"country"}
                    id={"country"}
                    onChangeText={(text) => setCountry(text)}
                />
                <InputUser
                    placeholder={"Password"}
                    name={"password"}
                    id={"password"}
                    secureTextEntry={true}
                    onChangeText={(text) => setPassword(text)}
                />
                <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
                    {image && <Image style={styles.image} source={{ uri: image }} />}
                    
                    <TouchableOpacity style={styles.imagePicker} onPress={takePhoto}>
                        <Icon style={{ color: "white" }} name="camera" />
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={styles.buttonGroup}>
                    {error ? <Error message={error} /> : null}
                </View>

                <View>
                    <EasyButton
                        login
                        primary
                        onPress={register}
                        style={styles.loginButton}
                    >
                        <Text style={{ color: "white", fontWeight: "bold", letterSpacing: 1 }}>Sign up</Text>
                    </EasyButton>
                </View>

                <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
                    <Text
                        onPress={() => navigation.navigate("Login")}
                        style={[styles.registerButton, { color: "black", fontWeight: "bold", letterSpacing: 0, marginTop: -15 }]}
                    >
                        Already have an account
                    </Text>
                </View>
            </FormContainer>
        </KeyboardAwareScrollView>
    );
};

const styles = StyleSheet.create({
    buttonGroup: {
        width: "80%",
        margin: 10,
        alignItems: "center",
    },
    imageContainer: {
        width: 100,
        height: 100,
        borderStyle: "solid",
        borderWidth: 2,
        justifyContent: "center",
        borderColor: "#1f6f78",
        marginTop: 20,
        alignSelf: 'center',
        position: 'relative',
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
    imagePicker: {
        position: "absolute",
        bottom: 5,
        right: 5,
        backgroundColor: "#1f6f78",
        padding: 8,
        borderRadius: 100,
        elevation: 20,
    },
    loginButton: {
        backgroundColor: "#1f6f78",
    },
    registerButton: {
        backgroundColor: "#FFFFFF",
    },
});

export default Register;

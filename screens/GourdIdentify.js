import React, { useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";

function GourdIdentify() {
    const [images, setImages] = useState([null, null]);
    const [gender, setGender] = useState(""); // Placeholder for gender result
    const [gourdType, setGourdType] = useState(""); // Placeholder for gourd type result

    const handleImagePick = async (index) => {
        const options = [
            { text: "Cancel", style: "cancel" },
            {
                text: "Camera",
                onPress: async () => {
                    const result = await ImagePicker.launchCameraAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        quality: 1,
                    });
                    if (!result.canceled) {
                        updateImage(result.assets[0].uri, index);
                    }
                },
            },
            {
                text: "Gallery",
                onPress: async () => {
                    const result = await ImagePicker.launchImageLibraryAsync({
                        mediaTypes: ImagePicker.MediaTypeOptions.Images,
                        quality: 1,
                    });
                    if (!result.canceled) {
                        updateImage(result.assets[0].uri, index);
                    }
                },
            },
        ];
        Alert.alert("Select Image", "Choose an option", options);
    };

    const updateImage = (uri, index) => {
        const updatedImages = [...images];
        updatedImages[index] = uri;
        setImages(updatedImages);
    };

    const removeImage = (index) => {
        const updatedImages = [...images];
        updatedImages[index] = null;
        setImages(updatedImages);
    };

    const handleIdentify = () => {
        // Placeholder logic for setting results
        setGender("Male"); // Replace with TensorFlow result later
        setGourdType("Bottle Gourd"); // Replace with TensorFlow result later
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {images.map((image, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.imageWrapper}
                        onPress={() => handleImagePick(index)}
                    >
                        {image ? (
                            <>
                                <Image source={{ uri: image }} style={styles.image} />
                                <TouchableOpacity
                                    style={styles.removeButton}
                                    onPress={() => removeImage(index)}
                                >
                                    <Text style={styles.removeText}>X</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <Text style={styles.placeholderText}>Add Image</Text>
                        )}
                    </TouchableOpacity>
                ))}
            </View>
            <TouchableOpacity style={styles.identifyButton} onPress={handleIdentify}>
                <Text style={styles.identifyText}>Identify</Text>
            </TouchableOpacity>
            <View style={styles.resultContainer}>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Gender:</Text>
                    <TextInput
                        style={styles.resultBox}
                        editable={false}
                        value={gender}
                    />
                </View>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>    
                        
                        
                        Type:</Text>
                    <TextInput
                        style={styles.resultBox}
                        editable={false}
                        value={gourdType}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#E0F8E6",
        padding: 20,
        justifyContent: "flex-start", // Align content at the top
    },
    imageContainer: {
        flexDirection: "row",
        justifyContent: "center", // Align images closer together
        alignItems: "center",
        marginBottom: 20,
    },
    imageWrapper: {
        width: 150,
        height: 150,
        backgroundColor: "#D0E8D8",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 10, // Add spacing between images
        position: "relative",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    placeholderText: {
        color: "#666",
        textAlign: "center",
    },
    removeButton: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "rgba(0,0,0,0.5)",
        borderRadius: 15,
        width: 25,
        height: 25,
        justifyContent: "center",
        alignItems: "center",
    },
    removeText: {
        color: "white",
        fontWeight: "bold",
    },
    identifyButton: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    identifyText: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
    },
    resultContainer: {
        marginTop: 20,
    },
    resultRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    resultLabel: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333333",
        marginRight: 10,
    },
    resultBox: {
        flex: 1,
        backgroundColor: "#FFFFFF",
        borderColor: "#CCCCCC",
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        fontSize: 16,
        color: "#333333",
    },
});

export default GourdIdentify;

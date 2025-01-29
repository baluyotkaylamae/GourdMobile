// import React, { useState } from "react";
// import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput } from "react-native";
// import * as ImagePicker from "expo-image-picker";

// function GourdIdentify() {
//     const [images, setImages] = useState([null, null]);
//     const [gender, setGender] = useState(""); // Placeholder for gender result
//     const [gourdType, setGourdType] = useState(""); // Placeholder for gourd type result

//     const handleImagePick = async (index) => {
//         const options = [
//             { text: "Cancel", style: "cancel" },
//             {
//                 text: "Camera",
//                 onPress: async () => {
//                     const result = await ImagePicker.launchCameraAsync({
//                         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                         quality: 1,
//                     });
//                     if (!result.canceled) {
//                         updateImage(result.assets[0].uri, index);
//                     }
//                 },
//             },
//             {
//                 text: "Gallery",
//                 onPress: async () => {
//                     const result = await ImagePicker.launchImageLibraryAsync({
//                         mediaTypes: ImagePicker.MediaTypeOptions.Images,
//                         quality: 1,
//                     });
//                     if (!result.canceled) {
//                         updateImage(result.assets[0].uri, index);
//                     }
//                 },
//             },
//         ];
//         Alert.alert("Select Image", "Choose an option", options);
//     };

//     const updateImage = (uri, index) => {
//         const updatedImages = [...images];
//         updatedImages[index] = uri;
//         setImages(updatedImages);
//     };

//     const removeImage = (index) => {
//         const updatedImages = [...images];
//         updatedImages[index] = null;
//         setImages(updatedImages);
//     };

//     const handleIdentify = () => {
//         // Placeholder logic for setting results
//         setGender("Male"); // Replace with TensorFlow result later
//         setGourdType("Bottle Gourd"); // Replace with TensorFlow result later
//     };

//     return (
//         <View style={styles.container}>
//             <View style={styles.imageContainer}>
//                 {images.map((image, index) => (
//                     <TouchableOpacity
//                         key={index}
//                         style={styles.imageWrapper}
//                         onPress={() => handleImagePick(index)}
//                     >
//                         {image ? (
//                             <>
//                                 <Image source={{ uri: image }} style={styles.image} />
//                                 <TouchableOpacity
//                                     style={styles.removeButton}
//                                     onPress={() => removeImage(index)}
//                                 >
//                                     <Text style={styles.removeText}>X</Text>
//                                 </TouchableOpacity>
//                             </>
//                         ) : (
//                             <Text style={styles.placeholderText}>Add Image</Text>
//                         )}
//                     </TouchableOpacity>
//                 ))}
//             </View>
//             <TouchableOpacity style={styles.identifyButton} onPress={handleIdentify}>
//                 <Text style={styles.identifyText}>Identify</Text>
//             </TouchableOpacity>
//             <View style={styles.resultContainer}>
//                 <View style={styles.resultRow}>
//                     <Text style={styles.resultLabel}>Gender:</Text>
//                     <TextInput
//                         style={styles.resultBox}
//                         editable={false}
//                         value={gender}
//                     />
//                 </View>
//                 <View style={styles.resultRow}>
//                     <Text style={styles.resultLabel}>    


//                         Type:</Text>
//                     <TextInput
//                         style={styles.resultBox}
//                         editable={false}
//                         value={gourdType}
//                     />
//                 </View>
//             </View>
//         </View>
//     );
// }


import React, { useState, useEffect } from "react";
import { View, Animated, Text, StyleSheet, Image, TouchableOpacity, Alert, TextInput, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO } from "@tensorflow/tfjs-react-native";
import * as FileSystem from "expo-file-system";
import jpeg from 'jpeg-js';

console.log("TensorFlow.js version:", tf.version.tfjs);

function GourdIdentify() {
    const [image, setImage] = useState(null); // Only one image state
    const [gender, setGender] = useState("");
    const [gourdType, setGourdType] = useState("");
    const [variety, setVariety] = useState("");
    const [loading, setLoading] = useState(false);
    const [model, setModel] = useState(null);
    const [isIdentifying, setIsIdentifying] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const loadModel = async () => {
            try {
                setLoading(true);
                console.log("Initializing TensorFlow...");
                await tf.ready();
                console.log("TensorFlow is ready.");
                console.log("Loading model...");
                const model = await tf.loadLayersModel(
                    "https://raw.githubusercontent.com/baluyotkaylamae/Gourd2.0/refs/heads/main/model.json"
                );
                console.log("Model loaded successfully.");
                setModel(model);
            } catch (error) {
                console.error("Error loading model:", error);
            } finally {
                setLoading(false);
            }
        };
        loadModel();
    }, []);

    const handleImagePick = async () => {
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
                        setImage(result.assets[0].uri);
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
                        setImage(result.assets[0].uri);
                    }
                },
            },
        ];
        Alert.alert("Select Image", "Choose an option", options);
    };

    const handleIdentify = async () => {
        setShowToast(true);
        if (!model) {
            Alert.alert("Error", "Model is not loaded yet. Please try again.");
            return;
        }
        if (!image) {
            Alert.alert("Error", "Please select an image to identify.");
            return;
        }

        setLoading(true);
        try {
            const imgB64 = await FileSystem.readAsStringAsync(image, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
            const imgArray = new Uint8Array(imgBuffer);

            const { width, height, data } = jpeg.decode(imgArray, { useTArray: true });

            const rgbData = [];
            for (let i = 0; i < data.length; i += 4) {
                rgbData.push(data[i]);      // Red
                rgbData.push(data[i + 1]);  // Green
                rgbData.push(data[i + 2]);  // Blue
            }

            let imageTensor = tf.tensor3d(rgbData, [height, width, 3], 'int32'); // Initial tensor creation
            console.log("Initial tensor shape:", imageTensor.shape);
            console.log("Initial tensor dtype:", imageTensor.dtype);

            imageTensor = tf.image.resizeBilinear(imageTensor, [224, 224]); // Resize to match model's input size
            console.log("Resized tensor shape:", imageTensor.shape);

            imageTensor = tf.tensor(imageTensor.arraySync());
            console.log("Tensor re-initialized explicitly:", imageTensor);

            // imageTensor = imageTensor.div(tf.scalar(255));

            const expandedTensor = tf.expandDims(imageTensor, 0);
            console.log("Expanded tensor:", expandedTensor);

            // Run inference
            const predictions = await model.predict(expandedTensor).data();
            console.log("Predictions:", predictions);

            // Find the highest predicted class
            const predictedIndex = predictions.indexOf(Math.max(...predictions));
            console.log(`Predicted class index: ${predictedIndex}`);

            switch (predictedIndex) {
                case 0:
                    setGender("Male");
                    setGourdType("Bitter Gourd");
                    setVariety("Bilog");
                    break;
                case 1:
                    setGender("Female");
                    setGourdType("Bitter Gourd");
                    setVariety("Bilog");
                    break;
                case 2:
                    setGender("Male");
                    setGourdType("Sponge Gourd");
                    setVariety("smooth");
                    break;
                case 3:
                    setGender("Female");
                    setGourdType("Sponge Gourd");
                    setVariety("smooth");
                    break;
                case 4:
                    setGender("Male");
                    setGourdType("Bottle Gourd");
                    setVariety("Variety 1");
                    break;
                case 5:
                    setGender("Male");
                    setGourdType("Bitter Gourd");
                    setVariety("Bilog");
                    break;
                case 6:
                    setGender("Female");
                    setGourdType("Bitter Gourd");
                    setVariety("Bilog");
                    break;
                default:
                    Alert.alert("Error", "Unable to identify the image.");
            }
        } catch (error) {
            console.error("Error during identification:", error);
            Alert.alert("Error", "Failed to process the image.");
        } finally {
            setLoading(false);
            setShowToast(false);
        }

    };

    const handleReset = () => {
        setImage(null);
        setGender('');
        setGourdType('');
        setVariety('');
    };

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {image && showToast && (
                    <Animated.View style={styles.toastContainer}>
                        <View style={styles.toastContent}>
                            <ActivityIndicator size="small" color="#fff" />
                            <Text style={styles.toastText}>Identifying your gourd...</Text>
                        </View>
                    </Animated.View>
                )}
                <TouchableOpacity
                    style={styles.imageWrapper}
                    onPress={handleImagePick}
                >
                    {image ? (
                        <>
                            <Image source={{ uri: image }} style={styles.image} />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => setImage(null)}
                            >
                                <Text style={styles.removeText}>X</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <Text style={styles.placeholderText}>Add Image</Text>
                    )}
                </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.identifyButton}
                    onPress={handleIdentify}
                    disabled={loading || !model}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.identifyText}>Identify</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleReset}
                >
                    <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.resultContainer}>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Gender:</Text>
                    <TextInput style={styles.resultBox} editable={false} value={gender} />
                </View>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Type:</Text>
                    <TextInput style={styles.resultBox} editable={false} value={gourdType} />
                </View>
                <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Variety:</Text>
                    <TextInput style={styles.resultBox} editable={false} value={variety} />
                </View>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginTop: 20,
        gap: 10,
    },
    identifyButton: {
        flex: 1,
        backgroundColor: '#5cb85c',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    identifyText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
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
        height: 40,
        borderColor: "#4CAF50",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#333333",
    },

    toastContainer: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 9999,
        elevation: 5,
    },
    toastContent: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: 25,
        padding: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    toastText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    resetButton: {
        flex: 1,
        backgroundColor: '#dc3545',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    resetText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default GourdIdentify;

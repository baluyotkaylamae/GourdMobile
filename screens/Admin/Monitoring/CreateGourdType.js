import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
    TouchableOpacity,
} from "react-native";
import EasyButton from "../../../Shared/StyledComponents/EasyButton";
import baseURL from "../../../assets/common/baseurl";
import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const GourdTypeItem = ({ item, deleteGourdType, editGourdType }) => {
    return (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <View style={styles.iconContainer}>
                <EasyButton
                    danger
                    medium
                    onPress={() => deleteGourdType(item._id)}
                    style={styles.icon}
                >
                    <Icon name="trash" size={20} color="white" />
                </EasyButton>
                <EasyButton
                    primary
                    medium
                    onPress={() => editGourdType(item)}
                    style={styles.icon}
                >
                    <Icon name="pencil" size={20} color="white" />
                </EasyButton>
            </View>
        </View>
    );
};

const GourdTypeList = () => {
    const [gourdTypes, setGourdTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [gourdTypeName, setGourdTypeName] = useState("");
    const [gourdTypeDescription, setGourdTypeDescription] = useState("");
    const [selectedGourdType, setSelectedGourdType] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = await AsyncStorage.getItem("jwt");
            setToken(storedToken);

            try {
                const response = await axios.get(`${baseURL}GourdType`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                setGourdTypes(response.data);
            } catch (err) {
                setError("Error fetching gourd types");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            setGourdTypes([]);
            setToken("");
        };
    }, []);

    const deleteGourdType = async (id) => {
        try {
            await axios.delete(`${baseURL}GourdType/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGourdTypes(gourdTypes.filter((type) => type._id !== id));
            Alert.alert("Success", "Gourd type deleted successfully");
        } catch (err) {
            setError("Error deleting gourd type");
        }
    };

    const openModal = (gourdType) => {
        setSelectedGourdType(gourdType);
        setGourdTypeName(gourdType.name);
        setGourdTypeDescription(gourdType.description);
        setModalVisible(true);
    };

    const updateGourdType = async () => {
        if (!selectedGourdType) return;

        const updatedGourdType = {
            _id: selectedGourdType._id,
            name: gourdTypeName || selectedGourdType.name,
            description: gourdTypeDescription || selectedGourdType.description,
        };

        try {
            const response = await axios.put(
                `${baseURL}gourdType/${selectedGourdType._id}`,
                updatedGourdType,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setGourdTypes(gourdTypes.map((type) =>
                type._id === response.data._id ? response.data : type
            ));
            setModalVisible(false);
            setGourdTypeName("");
            setGourdTypeDescription("");
        } catch (err) {
            setError("Error updating gourd type");
        }
    };

    const addGourdType = async () => {
        const newGourdType = {
            name: gourdTypeName,
            description: gourdTypeDescription,
        };

        try {
            const response = await axios.post(`${baseURL}gourdType`, newGourdType, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setGourdTypes([...gourdTypes, response.data]);
            setCreateModalVisible(false);
            setGourdTypeName("");
            setGourdTypeDescription("");
        } catch (err) {
            setError("Error creating gourd type");
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>{error}</Text>;

    return (
        <View style={{ backgroundColor: '#E0F8E6', flex: 1 }}>
            <FlatList
                data={gourdTypes}
                renderItem={({ item }) => (
                    <GourdTypeItem
                        item={item}
                        deleteGourdType={deleteGourdType}
                        editGourdType={openModal}
                    />
                )}
                keyExtractor={(item) => item._id}
            />

            {/* Floating Button for Adding Gourd Type */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setCreateModalVisible(true)}
            >
                <Icon name="plus" size={24} color="white" />
            </TouchableOpacity>

            {/* Edit Gourd Type Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            value={gourdTypeName}
                            style={styles.input}
                            onChangeText={setGourdTypeName}
                            placeholder="Gourd Type Name"
                            placeholderTextColor="#888"
                        />
                        <TextInput
                            value={gourdTypeDescription}
                            style={styles.input}
                            onChangeText={setGourdTypeDescription}
                            placeholder="Description"
                            placeholderTextColor="#888"
                        />
                        <EasyButton
                            medium
                            primary
                            onPress={updateGourdType}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
                        </EasyButton>
                    </View>
                </View>
            </Modal>

            {/* Create Gourd Type Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={createModalVisible}
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            value={gourdTypeName}
                            style={styles.input}
                            onChangeText={setGourdTypeName}
                            placeholder="Gourd Type Name"
                            placeholderTextColor="#888"
                        />
                        <TextInput
                            value={gourdTypeDescription}
                            style={styles.input}
                            onChangeText={setGourdTypeDescription}
                            placeholder="Description"
                            placeholderTextColor="#888"
                        />
                        <EasyButton
                            medium
                            primary
                            onPress={addGourdType}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Create</Text>
                        </EasyButton>
                    </View>
                </View>
            </Modal>
        </View>
    );
};


const styles = StyleSheet.create({
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 15,
        marginVertical: 8,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    itemText: {
        fontSize: 16,
        fontWeight: '500',
        color: "#2c3e50",
    },
    iconContainer: {
        flexDirection: 'row',
    },
    icon: {
        marginLeft: 10,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 25,
        right: 20,
        backgroundColor: '#50ADBF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#E0F8E6', // Adds a dark overlay
    },
    modalView: {
        width: '80%',
        backgroundColor: "#f9f9f9",
        borderRadius: 20,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    input: {
        width: '100%',
        height: 50,
        paddingHorizontal: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        backgroundColor: "#fff",
        fontSize: 16,
        color: "#333",
    },
});


export default GourdTypeList;

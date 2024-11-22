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

const Item = ({ item, deleteCategory, editCategory }) => {
    return (
        <View style={styles.item}>
            <Text style={styles.itemText}>{item.name}</Text>
            <View style={styles.iconContainer}>
                <EasyButton
                    danger
                    medium
                    onPress={() => deleteCategory(item._id)}
                    style={styles.icon}
                >
                    <Icon name="trash" size={20} color="white" />
                </EasyButton>
                <EasyButton
                    primary
                    medium
                    onPress={() => editCategory(item)}
                    style={styles.icon}
                >
                    <Icon name="pencil" size={20} color="white" />
                </EasyButton>
            </View>
        </View>
    );
};

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [categoryDescription, setCategoryDescription] = useState("");
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [token, setToken] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = await AsyncStorage.getItem("jwt");
            setToken(storedToken);

            try {
                const response = await axios.get(`${baseURL}category`, {
                    headers: { Authorization: `Bearer ${storedToken}` },
                });
                setCategories(response.data);
            } catch (err) {
                setError("Error fetching categories");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            setCategories([]);
            setToken("");
        };
    }, []);

    const deleteCategory = async (id) => {
        try {
            await axios.delete(`${baseURL}category/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories(categories.filter((category) => category._id !== id));
            Alert.alert("Success", "Category deleted successfully");
        } catch (err) {
            setError("Error deleting category");
        }
    };

    const openModal = (category) => {
        setSelectedCategory(category);
        setCategoryName(category.name);
        setCategoryDescription(category.description);
        setModalVisible(true);
    };

    const updateCategory = async () => {
        if (!selectedCategory) return;

        const updatedCategory = {
            _id: selectedCategory._id,
            name: categoryName || selectedCategory.name,
            description: categoryDescription || selectedCategory.description,
        };

        try {
            const response = await axios.put(
                `${baseURL}category/${selectedCategory._id}`,
                updatedCategory,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setCategories(categories.map((category) =>
                category._id === response.data._id ? response.data : category
            ));
            setModalVisible(false);
            setCategoryName("");
            setCategoryDescription("");
        } catch (err) {
            setError("Error updating category");
        }
    };

    const addCategory = async () => {
        const newCategory = {
            name: categoryName,
            description: categoryDescription,
        };

        try {
            const response = await axios.post(`${baseURL}category`, newCategory, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCategories([...categories, response.data]);
            setCreateModalVisible(false);
            setCategoryName("");
            setCategoryDescription("");
        } catch (err) {
            setError("Error creating category");
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>{error}</Text>;

    return (
        <View style={{ backgroundColor: '#E0F8E6', flex: 1 }}>
            <FlatList
                data={categories}
                renderItem={({ item }) => (
                    <Item
                        item={item}
                        deleteCategory={deleteCategory}
                        editCategory={openModal}
                    />
                )}
                keyExtractor={(item) => item._id}
            />

            {/* Floating Button for Adding Category */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setCreateModalVisible(true)}
            >
                <Icon name="plus" size={24} color="white" />
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            value={categoryName}
                            style={styles.input}
                            onChangeText={setCategoryName}
                            placeholder="Category Name"
                            placeholderTextColor="#888"
                        />
                        <TextInput
                            value={categoryDescription}
                            style={styles.input}
                            onChangeText={setCategoryDescription}
                            placeholder="Description"
                            placeholderTextColor="#888"
                        />
                        <EasyButton
                            medium
                            primary
                            onPress={updateCategory}
                        >
                            <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
                        </EasyButton>
                    </View>
                </View>
            </Modal>

            {/* Create Category Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={createModalVisible}
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            value={categoryName}
                            style={styles.input}
                            onChangeText={setCategoryName}
                            placeholder="Category Name"
                            placeholderTextColor="#888"
                        />
                        <TextInput
                            value={categoryDescription}
                            style={styles.input}
                            onChangeText={setCategoryDescription}
                            placeholder="Description"
                            placeholderTextColor="#888"
                        />
                        <EasyButton
                            medium
                            primary
                            onPress={addCategory}
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

export default CategoryList;

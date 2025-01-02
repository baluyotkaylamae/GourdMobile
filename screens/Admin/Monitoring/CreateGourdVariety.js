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
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import DropDownPicker from 'react-native-dropdown-picker';

const Item = ({ item, deleteVariety, editVariety }) => {
    return (
        <View style={styles.item}>
            <Text style={styles.itemText}>
                {item.name} - {item.gourdType?.name || "Unknown"}
            </Text>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.iconContainer}>
                <EasyButton
                    danger
                    medium
                    onPress={() => deleteVariety(item._id)}
                    style={styles.icon}
                >
                    <Icon name="trash" size={20} color="white" />
                </EasyButton>
                <EasyButton
                    primary
                    medium
                    onPress={() => editVariety(item)}
                    style={styles.icon}
                >
                    <Icon name="pencil" size={20} color="white" />
                </EasyButton>
            </View>
        </View>
    );
};

const VarietyList = () => {
    const [varieties, setVarieties] = useState([]);
    const [gourdTypes, setGourdTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [varietyName, setVarietyName] = useState("");
    const [varietyDescription, setVarietyDescription] = useState("");
    const [gourdType, setGourdType] = useState(null);
    const [selectedVariety, setSelectedVariety] = useState(null);
    const [token, setToken] = useState("");
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const storedToken = await AsyncStorage.getItem("jwt");
            setToken(storedToken);

            try {
                const [varietiesResponse, gourdTypesResponse] = await Promise.all([
                    axios.get(`${baseURL}GourdVariety`, {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    }),
                    axios.get(`${baseURL}GourdType`, {
                        headers: { Authorization: `Bearer ${storedToken}` },
                    }),
                ]);
                setVarieties(varietiesResponse.data);
                setGourdTypes(gourdTypesResponse.data);
            } catch (err) {
                setError("Error fetching varieties or gourd types");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => {
            setVarieties([]);
            setGourdTypes([]);
            setToken("");
        };
    }, []);

    const deleteVariety = async (id) => {
        try {
            await axios.delete(`${baseURL}GourdVariety/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVarieties(varieties.filter((variety) => variety._id !== id));
            Alert.alert("Success", "Variety deleted successfully");
        } catch (err) {
            setError("Error deleting variety");
        }
    };

    const openModal = (variety) => {
        setSelectedVariety(variety);
        setVarietyName(variety.name);
        setVarietyDescription(variety.description);
        setGourdType(variety.gourdType?._id || null);
        setModalVisible(true);
    };

    const updateVariety = async () => {
        if (!selectedVariety) return;

        const updatedVariety = {
            _id: selectedVariety._id,
            name: varietyName || selectedVariety.name,
            description: varietyDescription || selectedVariety.description,
            gourdType: gourdType || selectedVariety.gourdType?._id,
        };

        try {
            const response = await axios.put(
                `${baseURL}GourdVariety/${selectedVariety._id}`,
                updatedVariety,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setVarieties(varieties.map((variety) =>
                variety._id === response.data._id ? response.data : variety
            ));
            setModalVisible(false);
            setVarietyName("");
            setVarietyDescription("");
            setGourdType(null);
        } catch (err) {
            setError("Error updating variety");
        }
    };

    const addVariety = async () => {
        const newVariety = {
            name: varietyName,
            description: varietyDescription,
            gourdType,
        };

        try {
            const response = await axios.post(`${baseURL}GourdVariety`, newVariety, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setVarieties([...varieties, response.data]);
            setCreateModalVisible(false);
            setVarietyName("");
            setVarietyDescription("");
            setGourdType("");
        } catch (err) {
            setError("Error creating variety");
        }
    };

    if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
    if (error) return <Text>{error}</Text>;

    return (
        <View style={{ backgroundColor: "#F0F0F0", flex: 1 }}>
            <FlatList
                data={varieties}
                renderItem={({ item }) => (
                    <Item
                        item={item}
                        deleteVariety={deleteVariety}
                        editVariety={openModal}
                    />
                )}
                keyExtractor={(item) => item._id}
            />

            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setCreateModalVisible(true)}
            >
                <Icon name="plus" size={24} color="white" />
            </TouchableOpacity>

            {/* Edit Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            value={varietyName}
                            style={styles.input}
                            onChangeText={setVarietyName}
                            placeholder="Variety Name"
                        />
                        <TextInput
                            value={varietyDescription}
                            style={styles.input}
                            onChangeText={setVarietyDescription}
                            placeholder="Description"
                        />
                        <DropDownPicker
                            open={dropdownOpen} // Use the separate open state
                            value={gourdType}
                            items={gourdTypes.map((gourd) => ({
                                label: gourd.name,
                                value: gourd._id,
                            }))}
                            setOpen={setDropdownOpen} // Set open state using setDropdownOpen
                            setValue={setGourdType}
                            placeholder="Select Gourd Type"
                            style={styles.input}
                        />
                        <EasyButton medium primary onPress={updateVariety}>
                            <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
                        </EasyButton>
                    </View>
                </View>
            </Modal>

            {/* Create Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={createModalVisible}
                onRequestClose={() => setCreateModalVisible(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            value={varietyName}
                            style={styles.input}
                            onChangeText={setVarietyName}
                            placeholder="Variety Name"
                        />
                        <TextInput
                            value={varietyDescription}
                            style={styles.input}
                            onChangeText={setVarietyDescription}
                            placeholder="Description"
                        />
                        <DropDownPicker
                            open={dropdownOpen} // Use the separate open state
                            value={gourdType}
                            items={gourdTypes.map((gourd) => ({
                                label: gourd.name,
                                value: gourd._id,
                            }))}
                            setOpen={setDropdownOpen} // Set open state using setDropdownOpen
                            setValue={setGourdType}
                            placeholder="Select Gourd Type"
                            style={styles.input}
                        />
                        <EasyButton medium primary onPress={addVariety}>
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
        padding: 10,
        marginBottom: 10,
        backgroundColor: "#fff",
        borderRadius: 5,
    },
    itemText: {
        fontSize: 16,
        fontWeight: "bold",
    },
    description: {
        fontSize: 14,
        color: "#555",
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    icon: {
        marginLeft: 10,
    },
    floatingButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#28a745",
        borderRadius: 50,
        padding: 15,
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    input: {
        width: 250,
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingLeft: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});

export default VarietyList;

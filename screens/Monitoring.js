import React, { useEffect, useState, useContext } from "react";
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
import EasyButton from "../Shared/StyledComponents/EasyButton";
import baseURL from "../assets/common/baseurl";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/FontAwesome";
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from "@react-native-community/datetimepicker";
import AuthGlobal from '../Context/Store/AuthGlobal';

const MonitoringScreen = () => {
  const context = useContext(AuthGlobal);
  const userId = context.stateUser.user?.userId;

  const [gourdTypes, setGourdTypes] = useState([]);
  const [gourdVarieties, setGourdVarieties] = useState([]);
  const [monitorings, setMonitorings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(null); // 'pollination' or 'finalization'
  const [GourdTypeOpen, setGourdTypeOpen] = useState(false);
  const [VarietyOpen, setVarietyOpen] = useState(false);
  const [StatusOpen, setStatusOpen] = useState(false);

  const [monitoringData, setMonitoringData] = useState({
    gourdType: "",
    variety: "",
    dateOfPollination: new Date(),
    pollinatedFlowers: 0,
    fruitsHarvested: "",
    dateOfFinalization: new Date(),
    status: "In Progress",
  });

  const statusOptions = [
    { label: "In Progress", value: "In Progress" },
    { label: "Completed", value: "Completed" },
    { label: "Failed", value: "Failed" },
  ];

  const fetchGourdData = async () => {
    const storedToken = await AsyncStorage.getItem("jwt");
    try {
      const [gourdTypesResponse, gourdVarietiesResponse] = await Promise.all([
        axios.get(`${baseURL}GourdType`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
        axios.get(`${baseURL}GourdVariety`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        }),
      ]);
      setGourdTypes(gourdTypesResponse.data);
      setGourdVarieties(gourdVarietiesResponse.data);
    } catch (err) {
      setError("Error fetching gourd types or varieties");
    }
  };

  const fetchMonitoringRecords = async () => {
    const storedToken = await AsyncStorage.getItem("jwt");
    try {
      const monitoringResponse = await axios.get(`${baseURL}Monitoring/${userId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setMonitorings(monitoringResponse.data);
    } catch (err) {
      setError("Failed to fetch monitoring records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMonitoringRecords();
    fetchGourdData();

    return () => {
      setGourdTypes([]);
      setGourdVarieties([]);
      setMonitorings([]);
    };
  }, [userId]);

  useEffect(() => {
    console.log("Monitoring Data State:", monitoringData);
    console.log("Selected Gourd Type:", monitoringData.gourdType);
    console.log("Selected Gourd Variety:", monitoringData.variety);
  }, [monitoringData]);

  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(null);
    if (selectedDate) {
      if (datePickerVisible === "pollination") {
        setMonitoringData({ ...monitoringData, dateOfPollination: selectedDate });
      } else if (datePickerVisible === "finalization") {
        setMonitoringData({ ...monitoringData, dateOfFinalization: selectedDate });
      }
    }
  };

  const addMonitoring = async () => {
    if (!monitoringData.gourdType || !monitoringData.variety) {
      console.error("Gourd Type or Variety is not set");
      return;
    }

    const newMonitoring = {
      userID: userId,
      gourdType: monitoringData.gourdType._id,
      variety: monitoringData.variety._id,
      dateOfPollination: monitoringData.dateOfPollination || new Date(),
      pollinatedFlowers: monitoringData.pollinatedFlowers,
      fruitsHarvested: monitoringData.fruitsHarvested,
      dateOfFinalization: monitoringData.dateOfFinalization || new Date(),
      status: monitoringData.status,
    };

    try {
      const storedToken = await AsyncStorage.getItem("jwt");
      const response = await axios.post(`${baseURL}Monitoring`, newMonitoring, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
      });

      const createdMonitoring = {
        ...response.data,
        gourdType: gourdTypes.find((gourd) => gourd._id === response.data.gourdType),
        variety: gourdVarieties.find((variety) => variety._id === response.data.variety),
      };

      setMonitorings([...monitorings, createdMonitoring]);
      setCreateModalVisible(false);
      resetMonitoringData();
      await fetchGourdData(); // Fetch updated gourd types and varieties
    } catch (err) {
      setError("Error creating monitoring");
    }
  };

  const updateMonitoring = async () => {
    if (!monitoringData.gourdType) return;

    const updatedMonitoring = {
      gourdType: monitoringData.gourdType._id,
      variety: monitoringData.variety._id,
      dateOfPollination: monitoringData.dateOfPollination || new Date(),
      pollinatedFlowers: monitoringData.pollinatedFlowers,
      fruitsHarvested: monitoringData.fruitsHarvested,
      dateOfFinalization: monitoringData.dateOfFinalization || new Date(),
      status: monitoringData.status,
    };

    try {
      const storedToken = await AsyncStorage.getItem("jwt");
      const response = await axios.put(
        `${baseURL}Monitoring/${monitoringData._id}`,
        updatedMonitoring,
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setMonitorings(
        monitorings.map((monitoring) =>
          monitoring._id === response.data._id
            ? {
                ...response.data,
                gourdType: gourdTypes.find((gourd) => gourd._id === response.data.gourdType),
                variety: gourdVarieties.find((variety) => variety._id === response.data.variety),
              }
            : monitoring
        )
      );
      setModalVisible(false);
      resetMonitoringData();
    } catch (err) {
      setError("Error updating monitoring");
    }
  };

  const deleteMonitoring = async (id) => {
    try {
      const storedToken = await AsyncStorage.getItem("jwt");
      await axios.delete(`${baseURL}Monitoring/${id}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setMonitorings(monitorings.filter((monitoring) => monitoring._id !== id));
      Alert.alert("Success", "Monitoring deleted successfully");
    } catch (err) {
      setError("Error deleting monitoring");
    }
  };

  const resetMonitoringData = () => {
    setMonitoringData({
      gourdType: "",
      variety: "",
      dateOfPollination: new Date(),
      pollinatedFlowers: 0,
      fruitsHarvested: "",
      dateOfFinalization: new Date(),
      status: "In Progress",
    });
  };

  const openEditModal = (item) => {
    console.log("Opening Edit Modal with item:", item);
    setMonitoringData({
      ...item,
      gourdType: gourdTypes.find((gourd) => gourd._id === item.gourdType._id),
      variety: gourdVarieties.find((variety) => variety._id === item.variety._id),
      dateOfPollination: new Date(item.dateOfPollination),
      dateOfFinalization: new Date(item.dateOfFinalization),
    });
    setModalVisible(true);
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMonitoringRecords();
    await fetchGourdData();
  };

  useEffect(() => {
    if (modalVisible) {
      console.log("Monitoring Data State when modal is opened:", monitoringData);
    }
  }, [modalVisible]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error}</Text>;
  
  return (
    <View style={{ backgroundColor: "#F0F0F0", flex: 1 }}>
      <FlatList
        data={monitorings}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.variety?.name || "Unknown"} - {item.gourdType?.name || "Unknown"}
            </Text>
            <Text style={styles.description}>{item.status}</Text>
            <View style={styles.iconContainer}>
              <EasyButton
                danger
                medium
                onPress={() => deleteMonitoring(item._id)}
                style={styles.icon}
              >
                <Icon name="trash" size={20} color="white" />
              </EasyButton>
              <EasyButton
                primary
                medium
                onPress={() => openEditModal(item)}
                style={styles.icon}
              >
                <Icon name="pencil" size={20} color="white" />
              </EasyButton>
            </View>
          </View>
        )}
        keyExtractor={(item) => item._id}
        onRefresh={handleRefresh}
        refreshing={refreshing}
      />

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setCreateModalVisible(true)}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DropDownPicker
              open={GourdTypeOpen}
              value={monitoringData.gourdType ? monitoringData.gourdType._id : null}
              items={gourdTypes.map((gourd) => ({
                label: gourd.name,
                value: gourd._id,
              }))}
              setOpen={setGourdTypeOpen}
              setValue={(callbackOrValue) => {
                const value = typeof callbackOrValue === "function"
                  ? callbackOrValue(monitoringData.gourdType ? monitoringData.gourdType._id : null)
                  : callbackOrValue;
                setMonitoringData((prevState) => ({
                  ...prevState,
                  gourdType: gourdTypes.find((gourd) => gourd._id === value),
                  // variety: null,
                }));
              }}
              placeholder="Select Gourd Type"
              style={styles.input}
              dropDownStyle={styles.dropdown}
            />

            <DropDownPicker
              open={VarietyOpen}
              value={monitoringData.variety ? monitoringData.variety._id : null}
              items={gourdVarieties
                .filter((variety) => variety.gourdType._id === (monitoringData.gourdType ? monitoringData.gourdType._id : null))
                .map((variety) => ({
                  label: variety.name,
                  value: variety._id,
                }))}
              setOpen={setVarietyOpen}
              setValue={(callbackOrValue) => {
                const value = typeof callbackOrValue === "function"
                  ? callbackOrValue(monitoringData.variety ? monitoringData.variety._id : null)
                  : callbackOrValue;
                setMonitoringData((prevState) => ({
                  ...prevState,
                  variety: gourdVarieties.find((variety) => variety._id === value),
                }));
              }}
              placeholder="Select Gourd Variety"
              style={styles.input}
              dropDownStyle={styles.dropdown}
            />

            <TouchableOpacity
              style={styles.input}
              onPress={() => setDatePickerVisible("pollination")}
            >
              <Text>{new Date(monitoringData.dateOfPollination).toDateString()}</Text>
            </TouchableOpacity>
            <Text>Number of pollinated flowers</Text>
            <View style={styles.counterContainer}>

              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setMonitoringData({ ...monitoringData, pollinatedFlowers: Math.max(0, monitoringData.pollinatedFlowers - 1) })}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text>{monitoringData.pollinatedFlowers}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setMonitoringData({ ...monitoringData, pollinatedFlowers: monitoringData.pollinatedFlowers + 1 })}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              value={monitoringData.fruitsHarvested}
              style={styles.input}
              onChangeText={(value) => setMonitoringData({ ...monitoringData, fruitsHarvested: value })}
              placeholder="Fruits Harvested"
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setDatePickerVisible("finalization")}
            >
              <Text>{new Date(monitoringData.dateOfFinalization).toDateString()}</Text>
            </TouchableOpacity>
            <DropDownPicker
              open={StatusOpen}
              value={monitoringData.status}
              items={statusOptions}
              setOpen={setStatusOpen}
              setValue={(callbackOrValue) => {
                const value = typeof callbackOrValue === "function"
                  ? callbackOrValue(monitoringData.status)
                  : callbackOrValue;
                setMonitoringData((prevState) => ({
                  ...prevState,
                  status: value,
                }));
              }}
              placeholder="Select Status"
              style={styles.input}
              dropDownStyle={styles.dropdown}
            />
            <EasyButton medium primary onPress={addMonitoring}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Create</Text>
            </EasyButton>
          </View>
        </View>
        {datePickerVisible && (
          <DateTimePicker
            value={datePickerVisible === "pollination" ? monitoringData.dateOfPollination : monitoringData.dateOfFinalization}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>

            <DropDownPicker
              open={GourdTypeOpen}
              value={monitoringData.gourdType._id}
              items={gourdTypes.map((gourd) => ({
                label: gourd.name,
                value: gourd._id,
              }))}
              setOpen={setGourdTypeOpen}
              setValue={(callbackOrValue) => {
                const value = typeof callbackOrValue === "function"
                  ? callbackOrValue(monitoringData.gourdType._id)
                  : callbackOrValue;
                setMonitoringData((prevState) => ({
                  ...prevState,
                  gourdType: gourdTypes.find((gourd) => gourd._id === value),
                  variety: null,
                }));
              }}
              placeholder="Select Gourd Type"
              style={styles.input}
              dropDownStyle={styles.dropdown}
            />

            <DropDownPicker
              open={VarietyOpen}
              value={monitoringData.variety._id}
              items={gourdVarieties
                .filter((variety) => variety.gourdType._id === monitoringData.gourdType._id)
                .map((variety) => ({
                  label: variety.name,
                  value: variety._id,
                }))}
              setOpen={setVarietyOpen}
              setValue={(callbackOrValue) => {
                const value = typeof callbackOrValue === "function"
                  ? callbackOrValue(monitoringData.variety._id)
                  : callbackOrValue;
                setMonitoringData((prevState) => ({
                  ...prevState,
                  variety: gourdVarieties.find((variety) => variety._id === value),
                }));
              }}
              placeholder="Select Gourd Variety"
              style={styles.input}
              dropDownStyle={styles.dropdown}
            />
            <TouchableOpacity
              style={styles.input}
              onPress={() => setDatePickerVisible("pollination")}
            >
              <Text>{new Date(monitoringData.dateOfPollination).toDateString()}</Text>
            </TouchableOpacity>
            <Text>Number of pollinated flowers</Text>
            <View style={styles.counterContainer}>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setMonitoringData({ ...monitoringData, pollinatedFlowers: Math.max(0, monitoringData.pollinatedFlowers - 1) })}
              >
                <Text>-</Text>
              </TouchableOpacity>
              <Text>{monitoringData.pollinatedFlowers}</Text>
              <TouchableOpacity
                style={styles.counterButton}
                onPress={() => setMonitoringData({ ...monitoringData, pollinatedFlowers: monitoringData.pollinatedFlowers + 1 })}
              >
                <Text>+</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              value={monitoringData.fruitsHarvested.toString()}
              style={styles.input}
              onChangeText={(value) => {
                console.log("Fruits Harvested Input:", value);
                setMonitoringData({ ...monitoringData, fruitsHarvested: value });
              }}
              placeholder="Fruits Harvested"
            />
            
            <TouchableOpacity
              style={styles.input}
              onPress={() => setDatePickerVisible("finalization")}
            >
              <Text>{new Date(monitoringData.dateOfFinalization).toDateString()}</Text>
            </TouchableOpacity>
            <DropDownPicker
              open={StatusOpen}
              value={monitoringData.status}
              items={statusOptions}
              setOpen={setStatusOpen}
              setValue={(callbackOrValue) => {
                const value = typeof callbackOrValue === "function"
                  ? callbackOrValue(monitoringData.status)
                  : callbackOrValue;
                setMonitoringData((prevState) => ({
                  ...prevState,
                  status: value,
                }));
              }}
              placeholder="Select Status"
              style={styles.input}
              dropDownStyle={styles.dropdown}
            />
            <EasyButton medium primary onPress={updateMonitoring}>
              <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
            </EasyButton>
          </View>
        </View>
        {datePickerVisible && (
          <DateTimePicker
            value={datePickerVisible === "pollination" ? monitoringData.dateOfPollination : monitoringData.dateOfFinalization}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "white",
    margin: 15,
    padding: 20,
    borderRadius: 8,
    elevation: 3,
  },
  itemText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  description: {
    color: "gray",
    marginTop: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  icon: {
    marginLeft: 10,
  },
  floatingButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#3498db",
    padding: 20,
    borderRadius: 50,
    elevation: 5,
  },
  modalView: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 10,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdown: {
    width: "100%",
    backgroundColor: "#FFF",
    zIndex: 10000, // Ensure dropdown is on top of other elements
    position: "absolute", // Ensure it is positioned relative to its parent container
    top: 100, // Adjust the top offset to ensure it doesn't overlap with the gourd variety input box
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  counterContainer: { flexDirection: "row", alignItems: "center" },
  counterButton: { margin: 5, padding: 10, backgroundColor: "#ccc", borderRadius: 5 },
});

export default MonitoringScreen;

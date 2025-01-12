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
import { useFocusEffect } from "@react-navigation/native";

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
  const [selectedGourdType, setSelectedGourdType] = useState(null);

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
      const today = new Date();
      const filteredData = monitoringResponse.data.filter(item => {
        const finalizationDate = new Date(item.dateOfFinalization);
        return finalizationDate > today;
      });
      setMonitorings(filteredData);
    } catch (err) {
      setError("Failed to fetch monitoring records.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      setError(null);
      fetchMonitoringRecords();
      fetchGourdData();

      return () => {
        // Cleanup if necessary
        setGourdTypes([]);
        setGourdVarieties([]);
        setMonitorings([]);
      };
    }, [userId])
  );

  useEffect(() => {
    console.log("Monitoring Data State:", monitoringData);
    console.log("Selected Gourd Type:", monitoringData.gourdType);
    console.log("Selected Gourd Variety:", monitoringData.variety);
  }, [monitoringData]);

  const handleDateChange = (event, selectedDate) => {
    setDatePickerVisible(null);
    if (selectedDate) {
      if (datePickerVisible === "pollination") {
        const finalizationDate = new Date(selectedDate);
        finalizationDate.setDate(selectedDate.getDate() + 21);
        setMonitoringData((prevState) => ({
          ...prevState,
          dateOfPollination: selectedDate,
          dateOfFinalization: finalizationDate,
        }));
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
    const today = new Date();
    const finalizationDate = new Date(today);
    finalizationDate.setDate(today.getDate() + 21);

    setMonitoringData({
      gourdType: "",
      variety: "",
      dateOfPollination: today,
      pollinatedFlowers: 0,
      fruitsHarvested: "",
      dateOfFinalization: finalizationDate,
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

  const handleModalClose = () => {
    resetMonitoringData(); // Clear the monitoringData
    setModalVisible(false); // Close the modal
    setCreateModalVisible(false); // Close the create modal
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMonitoringRecords();
    await fetchGourdData();
  };

  const confirmDeleteMonitoring = (id) => {
    Alert.alert(
      "Delete Monitoring",
      "Are you sure you want to delete this monitoring?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => deleteMonitoring(id),
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  useEffect(() => {
    if (modalVisible) {
      console.log("Monitoring Data State when modal is opened:", monitoringData);
    }
  }, [modalVisible]);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>{error}</Text>;

  const filteredMonitorings = selectedGourdType
    ? monitorings.filter((item) => item.gourdType._id === selectedGourdType)
    : monitorings;

  return (
    <View style={{ backgroundColor: "#F0F0F0", flex: 1 }}>
      <View style={{ zIndex: 3000, margin: 10 }}>
        <DropDownPicker
          open={GourdTypeOpen}
          value={selectedGourdType}
          items={[
            { label: "All", value: null },
            ...gourdTypes.map((gourd) => ({
              label: gourd.name,
              value: gourd._id,
            })),
          ]}
          setOpen={setGourdTypeOpen}
          setValue={(callbackOrValue) => {
            const value = typeof callbackOrValue === "function"
              ? callbackOrValue(selectedGourdType)
              : callbackOrValue;
            setSelectedGourdType(value);
          }}
          placeholder="Select Gourd Type"
          style={styles.input}
          dropDownStyle={styles.dropdown}
        />
      </View>

      <FlatList
        data={filteredMonitorings}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>
              {item.variety?.name || "Unknown"} - {item.gourdType?.name || "Unknown"}
            </Text>
            <Text style={styles.description}>
              {new Date(item.dateOfPollination).toDateString()}
            </Text>
            <Text
              style={[
                styles.description,
                item.status === "In Progress" && { color: "orange" },
                item.status === "Completed" && { color: "green" },
                item.status === "Failed" && { color: "red" },
              ]}
            >
              {item.status}
            </Text>
            <View style={styles.iconContainer}>
              <EasyButton
                primary
                medium
                onPress={() => openEditModal(item)}
                style={styles.icon}
              >
                <Icon name="pencil" size={20} color="white" />
              </EasyButton>
              <EasyButton
                danger
                medium
                onPress={() => confirmDeleteMonitoring(item._id)}
                style={styles.icon}
              >
                <Icon name="trash" size={20} color="white" />
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
        onPress={() => {
          resetMonitoringData();
          setCreateModalVisible(true);
        }}
      >
        <Icon name="plus" size={24} color="white" />
      </TouchableOpacity>

      {/* Create Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={createModalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ zIndex: 2000 }}>
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
                  }));
                }}
                placeholder="Select Gourd Type"
                style={styles.input}
                dropDownStyle={styles.dropdown}
              />
            </View>

            <View style={{ zIndex: 1000 }}>
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
            </View>

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
              value="0"
              style={styles.input}
              editable={false}
              placeholder="Fruits Harvested"
            />
            <Text style={styles.input}>{new Date(monitoringData.dateOfFinalization).toDateString()}</Text>
            <DropDownPicker
              open={StatusOpen}
              value="In Progress"
              items={statusOptions}
              setOpen={setStatusOpen}
              setValue={(callbackOrValue) => {
                const value = typeof callbackOrValue === "function"
                  ? callbackOrValue("In Progress")
                  : callbackOrValue;
                setMonitoringData((prevState) => ({
                  ...prevState,
                  status: value,
                }));
              }}
              placeholder="Select Status"
              style={styles.input}
              dropDownStyle={styles.dropdown}
              disabled={true} // Disable the dropdown
            />
            <View style={styles.buttonRow}>
              <EasyButton medium primary onPress={addMonitoring}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Create</Text>
              </EasyButton>
              <EasyButton medium style={styles.cancelButton} onPress={handleModalClose}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
              </EasyButton>
            </View>
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
        onRequestClose={handleModalClose}
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
              disabled={true} // Disable the dropdown
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
              disabled={true} // Disable the dropdown
            />

            <Text style={styles.input}>{new Date(monitoringData.dateOfPollination).toDateString()}</Text>
            <Text>Number of pollinated flowers</Text>
            <TextInput
              value={monitoringData.pollinatedFlowers.toString()}
              style={styles.input}
              onChangeText={(value) => setMonitoringData({ ...monitoringData, pollinatedFlowers: parseInt(value) })}
              placeholder="Number of Pollinated Flowers"
              keyboardType="numeric"
            />

            <TextInput
              value={monitoringData.fruitsHarvested.toString()}
              style={styles.input}
              onChangeText={(value) => setMonitoringData({ ...monitoringData, fruitsHarvested: value })}
              placeholder="Fruits Harvested"
              keyboardType="numeric"
              editable={false}
            />

            <Text style={styles.input}>{new Date(monitoringData.dateOfFinalization).toDateString()}</Text>

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
              disabled={true}
            />
            <View style={styles.buttonRow}>
              <EasyButton medium primary onPress={() => {
                if (parseInt(monitoringData.fruitsHarvested) > monitoringData.pollinatedFlowers) {
                  Alert.alert("Error", "Fruits harvested cannot exceed the number of pollinated flowers.");
                } else {
                  updateMonitoring();
                }
              }}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Update</Text>
              </EasyButton>
              <EasyButton medium danger onPress={handleModalClose}>
                <Text style={{ color: "white", fontWeight: "bold" }}>Cancel</Text>
              </EasyButton>
            </View>
          </View>
        </View>
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "red",
    marginLeft: 10,
  },
});

export default MonitoringScreen;

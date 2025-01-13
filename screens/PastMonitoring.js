import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../assets/common/baseurl';
import AuthGlobal from '../Context/Store/AuthGlobal';
import { useFocusEffect } from '@react-navigation/native';

const MonitoringTab = ({ data, onUpdate }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [harvestInput, setHarvestInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setHarvestInput(String(item.fruitsHarvested)); // Prefill with current value
    setErrorMessage(""); // Clear any previous error message
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (selectedItem && harvestInput) {
      if (parseInt(harvestInput) > selectedItem.pollinatedFlowers) {
        setErrorMessage("Fruits harvested cannot be equal to or greater than pollinated flowers.");
        return;
      }
      await onUpdate(selectedItem._id, harvestInput);
      setModalVisible(false);
    }
  };

  const renderMonitoringItem = ({ item }) => (
    <View style={styles.monitoringCard}>
      <Text style={styles.monitoringTitle}>{item.gourdType.name}</Text>
      <Text style={styles.monitoringDetail}>Variety: {item.variety.name}</Text>
      <Text style={styles.monitoringDetail}>Pollinated Flowers: {item.pollinatedFlowers}</Text>
      <Text style={styles.monitoringDetail}>Fruits Harvested: {item.fruitsHarvested}</Text>
      <Text style={styles.monitoringDetail}>Date of Pollination: {new Date(item.dateOfPollination).toLocaleDateString()}</Text>
      <Text style={styles.monitoringDetail}>Date of Finalization: {new Date(item.dateOfFinalization).toLocaleDateString()}</Text>
      <Text style={styles.monitoringDetail}>
        Status: <Text style={[item.status === 'In Progress' && { color: 'blue' }, item.status === 'Completed' && { color: 'green' }, item.status === 'Failed' && { color: 'red' }]}>{item.status}</Text>
      </Text>
      {item.status === 'In Progress' && (
        <TouchableOpacity
          style={styles.updateButton}
          onPress={() => handleOpenModal(item)}
        >
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <>
      <FlatList
        data={data}
        renderItem={renderMonitoringItem}
        keyExtractor={(item) => item._id}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Fruits Harvested</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={harvestInput}
              onChangeText={(value) => {
                setHarvestInput(value);
                setErrorMessage(""); // Clear error when input changes
              }}
            />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
              <Button
                title="Update"
                onPress={handleUpdate}
                color="green"
                disabled={!harvestInput || parseInt(harvestInput) > selectedItem?.pollinatedFlowers}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const PastMonitoring = () => {
  const context = useContext(AuthGlobal);
  const [monitoringData, setMonitoringData] = useState([]);
  const [pastMonitoringData, setPastMonitoringData] = useState([]);
  const [failedMonitoringData, setFailedMonitoringData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('current');

  const fetchMonitoringData = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("jwt");
      const userId = context.stateUser?.user?.userId;
      const response = await axios.get(`${baseURL}Monitoring`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
  
      const today = new Date();
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(today.getDate() - 7);
  
      const updatedData = await Promise.all(
        response.data.map(async (item) => {
          const finalizationDate = new Date(item.dateOfFinalization);
          const isMoreThanSevenDays = finalizationDate <= sevenDaysAgo;
  
          // Update status to "Completed" or "Failed" based on the conditions after 7 days
          if (item.userID._id === userId && isMoreThanSevenDays) {
            if (item.fruitsHarvested > 0 && item.status !== "Completed") {
              try {
                await axios.put(
                  `${baseURL}Monitoring/${item._id}`,
                  { status: "Completed" },
                  { headers: { Authorization: `Bearer ${storedToken}` } }
                );
              } catch (error) {
                console.error(`Error updating status to Completed for item ${item._id}:`, error);
              }
              return { ...item, status: "Completed" };
            }
  
            if (item.fruitsHarvested === 0 && item.status !== "Failed") {
              try {
                await axios.put(
                  `${baseURL}Monitoring/${item._id}`,
                  { status: "Failed" },
                  { headers: { Authorization: `Bearer ${storedToken}` } }
                );
              } catch (error) {
                console.error(`Error updating status to Failed for item ${item._id}:`, error);
              }
              return { ...item, status: "Failed" };
            }
          }
          return item;
        })
      );
  
      // Filter data into different tabs based on status and dates
      const currentData = updatedData.filter(item => {
        const finalizationDate = new Date(item.dateOfFinalization);
        return (
          item.userID._id === userId &&
          finalizationDate <= today &&
          finalizationDate >= sevenDaysAgo &&
          item.status === "In Progress"
        );
      });
  
      const pastData = updatedData.filter(item => {
        return (
          item.userID._id === userId &&
          item.status === "Completed"
        );
      });
  
      const failedData = updatedData.filter(item => {
        return item.userID._id === userId && item.status === "Failed";
      });
  
      setMonitoringData(currentData);
      setPastMonitoringData(pastData);
      setFailedMonitoringData(failedData);
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };
  
  

  useFocusEffect(
    useCallback(() => {
      fetchMonitoringData();
    }, [context.stateUser])
  );

  const onUpdate = async (id, fruitsHarvested) => {
    try {
      const storedToken = await AsyncStorage.getItem("jwt");
      await axios.put(
        `${baseURL}Monitoring/${id}`,
        { fruitsHarvested },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      fetchMonitoringData(); // Refresh data after updating
    } catch (error) {
      console.error("Error updating monitoring data:", error);
    }
  };

  return (
    loading ? <ActivityIndicator size="large" color="#0000ff" /> :
      error ? <Text>{error}</Text> :
        <View style={styles.container}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'current' && { backgroundColor: '#007BFF' }]}
              onPress={() => setSelectedTab('current')}
            >
              <Text style={styles.tabButtonText}>On Going</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'past' && { backgroundColor: 'green' }]}
              onPress={() => setSelectedTab('past')}
            >
              <Text style={styles.tabButtonText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'failed' && { backgroundColor: 'red' }]}
              onPress={() => setSelectedTab('failed')}
            >
              <Text style={styles.tabButtonText}>Failed</Text>
            </TouchableOpacity>
          </View>
          {selectedTab === 'current' ? (
            <MonitoringTab data={monitoringData} onUpdate={onUpdate} />
          ) : selectedTab === 'past' ? (
            <MonitoringTab data={pastMonitoringData} onUpdate={onUpdate} />
          ) : (
            <MonitoringTab data={failedMonitoringData} onUpdate={onUpdate} />
          )}
        </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  tabButton: {
    padding: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    width: '30%', // Adjust the width of the button
    alignItems: 'center', // Center the text inside the button
  },
  activeTabButton: {
    backgroundColor: '#007BFF',
  },
  tabButtonText: {
    color: '#000',
  },
  monitoringCard: {
    marginTop: 10,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  monitoringTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  monitoringDetail: {
    fontSize: 14,
    marginVertical: 2,
  },
  updateButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  updateButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center', // Center the buttons horizontally
    alignItems: 'center', // Align the buttons vertically
    gap: 10, // Add spacing between buttons (use margin if `gap` is unsupported)
    marginTop: 15,
  },
});

export default PastMonitoring;

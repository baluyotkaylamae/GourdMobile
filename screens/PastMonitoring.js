import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../assets/common/baseurl';
import AuthGlobal from '../Context/Store/AuthGlobal';

const MonitoringTab = ({ data }) => {
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
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderMonitoringItem}
      keyExtractor={(item) => item._id}
    />
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

  useEffect(() => {
    const fetchMonitoringData = async () => {
      setLoading(true);
      try {
        const storedToken = await AsyncStorage.getItem("jwt");
        const userId = context.stateUser?.user?.userId;
        // console.log("User ID:", userId); // Debugging statement
        const response = await axios.get(`${baseURL}Monitoring`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        // console.log("Fetched data:", response.data); // Debugging statement
        const today = new Date();
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        const currentData = response.data.filter(item => {
          const finalizationDate = new Date(item.dateOfFinalization);
          return item.userID._id === userId && finalizationDate <= today && finalizationDate >= sevenDaysAgo && item.status === 'In Progress';
        });

        const pastData = response.data.filter(item => {
          const finalizationDate = new Date(item.dateOfFinalization);
          return item.userID._id === userId && finalizationDate < sevenDaysAgo && item.fruitsHarvested >= 1;
        });

        const failedData = response.data.filter(item => {
          const finalizationDate = new Date(item.dateOfFinalization);
          return item.userID._id === userId && finalizationDate < sevenDaysAgo && item.fruitsHarvested === 0;
        });

        // console.log("Current Data:", currentData); // Debugging statement
        // console.log("Past Data:", pastData); // Debugging statement
        // console.log("Failed Data:", failedData); // Debugging statement

        setMonitoringData(currentData);
        setPastMonitoringData(pastData);
        setFailedMonitoringData(failedData);

        // Update status of past monitoring data
        pastData.forEach(async (item) => {
          if (item.status !== 'Completed') {
            await updateMonitoringStatus(item._id, 'Completed');
          }
        });

        // Update status of failed monitoring data
        failedData.forEach(async (item) => {
          if (item.status !== 'Failed') {
            await updateMonitoringStatus(item._id, 'Failed');
          }
        });
      } catch (error) {
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMonitoringData();
  }, [context.stateUser]);

  const updateMonitoringStatus = async (id, status) => {
    try {
      const storedToken = await AsyncStorage.getItem("jwt");
      const response = await axios.put(
        `${baseURL}Monitoring/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );
      setPastMonitoringData((prevData) =>
        prevData.map((item) =>
          item._id === response.data._id ? { ...item, status: response.data.status } : item
        )
      );
      setFailedMonitoringData((prevData) =>
        prevData.map((item) =>
          item._id === response.data._id ? { ...item, status: response.data.status } : item
        )
      );
    } catch (err) {
      // console.error("Error updating monitoring status:", err);
    }
  };

  return (
    loading ? <ActivityIndicator size="large" color="#0000ff" /> :
      error ? <Text>{error}</Text> :
        <View style={styles.container}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'current' && styles.activeTabButton, selectedTab === 'current' && { backgroundColor: '#007BFF' }]}
              onPress={() => setSelectedTab('current')}
            >
              <Text style={styles.tabButtonText}>On Going</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'past' && styles.activeTabButton, selectedTab === 'past' && { backgroundColor: 'green' }]}
              onPress={() => setSelectedTab('past')}
            >
              <Text style={styles.tabButtonText}>Completed</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabButton, selectedTab === 'failed' && styles.activeTabButton, selectedTab === 'failed' && { backgroundColor: 'red' }]}
              onPress={() => setSelectedTab('failed')}
            >
              <Text style={styles.tabButtonText}>Failed</Text>
            </TouchableOpacity>
          </View>
          {selectedTab === 'current' ? (
            <MonitoringTab data={monitoringData} />
          ) : selectedTab === 'past' ? (
            <MonitoringTab data={pastMonitoringData} />
          ) : (
            <MonitoringTab data={failedMonitoringData} />
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
});

export default PastMonitoring;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import baseURL from "../../assets/common/baseurl";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [categoryCounts, setCategoryCounts] = useState([]); // Store post counts by category
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('jwt');
      if (!storedToken) {
        alert('You are not logged in');
        return;
      }

      // Fetch user count
      const userResponse = await fetch(`${baseURL}dashboards/users/count`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user count');
      }
      const userData = await userResponse.json();
      setUserCount(userData.count);

      // Fetch post count by category
      const categoryResponse = await fetch(`${baseURL}dashboards/posts/countByCategory`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });
      if (!categoryResponse.ok) {
        throw new Error('Failed to fetch post count by category');
      }
      const categoryData = await categoryResponse.json();
      setCategoryCounts(categoryData.counts); // Assuming the API returns an array of category counts

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error fetching data');
      setLoading(false);
    }
  };

  // Generate the chart data for categories
  const categoryChartData = {
    labels: categoryCounts.map(item => item.categoryName), // Assuming category data has 'categoryName'
    datasets: [
      {
        data: categoryCounts.map(item => item.count), // Assuming category count is in 'count'
        color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      }
    ]
  };

  const userChartData = {
    labels: ['Users'],
    datasets: [
      {
        data: [userCount],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2,
      }
    ]
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#6200ee" style={styles.loadingIndicator} />
        ) : (
          <>
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Total Users</Text>
              <BarChart
                data={userChartData}
                width={Dimensions.get('window').width - 40}
                height={220}
                chartConfig={chartConfig}
                fromZero={true}
                style={styles.chartStyle}
              />
            </View>

            {/* Display posts by category */}
            <View style={styles.chartContainer}>
              <Text style={styles.chartTitle}>Posts by Category</Text>
              <BarChart
                data={categoryChartData}
                width={Dimensions.get('window').width - 40}
                height={220}
                chartConfig={chartConfig}
                fromZero={true}
                style={styles.chartStyle}
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#C3E8C9',
  backgroundGradientTo: '#C3E8C9',
  decimalPlaces: 0, // Optional, set the number of decimal places to show
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,  // Ensures the content of ScrollView takes all available space
    paddingBottom: 30,
    backgroundColor: '#f0f0f0',
  },
  container: {
    paddingHorizontal: 1,
    paddingTop: 30,
    backgroundColor: '#4DA674',
    minHeight: Dimensions.get('window').height, // Ensures the container has enough height for scrolling
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#EAF8E7',
    textAlign: 'center', // Center align the title
  },
  loadingIndicator: {
    marginTop: 50, // Added margin to position the loader better
  },
  chartContainer: {
    marginBottom: 30,
    backgroundColor: '#C1E6BA',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderColor: '#ddd',
    borderWidth: 2,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center', // Center align the titles
  },
  chartStyle: {
    borderRadius: 12,
  },
});

export default Dashboard;

import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { PieChart } from 'react-native-gifted-charts';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TypiePie = () => {
  const [gourdTypesData, setGourdTypesData] = useState([]);
  const [error, setError] = useState(null);
  const context = useContext(AuthGlobal);

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      fetchGourdTypesData();
    }
  }, [context.stateUser.isAuthenticated]);

  const fetchGourdTypesData = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('jwt');
      if (!storedToken) {
        setError('No authentication token found');
        return;
      }

      const userId = context.stateUser?.user?.userId;
      if (!userId) {
        setError('User ID is missing');
        return;
      }

      console.log('User ID:', userId);

      const response = await axios.get(`${baseURL}Monitoring/${userId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (Array.isArray(response.data)) {
        const gourdTypesMap = {};

        response.data.forEach((record) => {
          const gourdType = record.gourdType?.name;
          const pollinatedFlowers = record.pollinatedFlowers || 0;

          if (pollinatedFlowers > 0) {
            if (gourdTypesMap[gourdType]) {
              gourdTypesMap[gourdType] += pollinatedFlowers;
            } else {
              gourdTypesMap[gourdType] = pollinatedFlowers;
            }
          }
        });

        const totalPollinatedFlowers = Object.values(gourdTypesMap).reduce((a, b) => a + b, 0);

        const colorPalette = [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF'
        ];

        const formattedData = Object.keys(gourdTypesMap).map((key, index) => ({
          value: gourdTypesMap[key],
          label: key,
          percentage: ((gourdTypesMap[key] / totalPollinatedFlowers) * 100).toFixed(2),
          color: colorPalette[index % colorPalette.length]
        }));

        setGourdTypesData(formattedData);
        setError(null);
      } else {
        setError('Data is not in expected array format');
      }
    } catch (error) {
      console.log('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
      setError('Failed to fetch gourd types data');
    }
  };

  const renderDot = (color) => {
    return (
      <View
        style={{
          height: 10,
          width: 10,
          borderRadius: 5,
          backgroundColor: color,
          marginRight: 10,
        }}
      />
    );
  };

  const renderLegendComponent = () => {
    return (
      <View style={styles.legendContainer}>
        {gourdTypesData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            {renderDot(item.color)}
            <Text style={styles.legendText}>{item.label}: {item.percentage}%</Text>
          </View>
        ))}
      </View>
    );
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.header}>Gourd Types Pollinated</Text>
        <View style={styles.chartContainer}>
          <View style={styles.perspectiveContainer}>
            <PieChart
              data={gourdTypesData}
              showText
              textColor="black"
              radius={100}
              textSize={15}
              focusOnPress
              showValuesAsLabels
              showTextBackground
              textBackgroundRadius={20}
            />
          </View>
        </View>
        {renderLegendComponent()}
        {error && <Text style={styles.error}>{error}</Text>}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  chartContainer: {
    padding: 20,
    alignItems: 'center',
  },
  perspectiveContainer: {
    perspective: 1000,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  legendText: {
    fontSize: 14,
  },
});

export default TypiePie;

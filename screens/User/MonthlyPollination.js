import React, { useState, useEffect, useContext } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { LineChart } from 'react-native-gifted-charts';
import axios from 'axios';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import AsyncStorage from '@react-native-async-storage/async-storage';

const screenWidth = Dimensions.get('window').width;

const MonthlyPollination = () => {
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [error, setError] = useState(null);
  const context = useContext(AuthGlobal);

  useEffect(() => {
    if (context.stateUser.isAuthenticated === true) {
      fetchMonthlyStats();
    }
  }, [context.stateUser.isAuthenticated]);

  const fetchMonthlyStats = async () => {
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

      const response = await axios.get(`${baseURL}Monitoring/${userId}`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      if (Array.isArray(response.data)) {
        const monthlyDataMap = {};

        response.data.forEach((record) => {
          const date = new Date(record.dateOfPollination);
          const monthName = date.toLocaleString('default', { month: 'short' });
          const year = date.getFullYear();
          const monthYear = `${monthName} ${year}`;

          if (monthlyDataMap[monthYear]) {
            monthlyDataMap[monthYear] += record.pollinatedFlowers || 0;
          } else {
            monthlyDataMap[monthYear] = record.pollinatedFlowers || 0;
          }
        });

        const formattedData = Object.keys(monthlyDataMap).map((key) => ({
          value: monthlyDataMap[key],
          dataPointText: monthlyDataMap[key].toString(),
          label: key
        }));

        formattedData.sort((a, b) => {
          const [monthA, yearA] = a.label.split(' ');
          const [monthB, yearB] = b.label.split(' ');

          const monthNames = [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
          ];

          const monthIndexA = monthNames.indexOf(monthA);
          const monthIndexB = monthNames.indexOf(monthB);

          return yearA === yearB
            ? monthIndexA - monthIndexB
            : yearA - yearB;
        });

        setMonthlyStats([{ value: 0, label: '' }, ...formattedData]);
        setError(null);
      } else {
        setError('Data is not in expected array format');
      }
    } catch (error) {
      setError('Failed to fetch statistics');
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.header}>Monthly Pollinated Flowers</Text>
        <ScrollView horizontal>
          <View>
            <LineChart
              initialSpacing={0}
              data={monthlyStats}
              spacing={50}
              textColor1="yellow"
              textShiftY={-8}
              textShiftX={-10}
              textFontSize={13}
              thickness={5}
              hideRules
              yAxisColor="#0BA5A4"
              showVerticalLines
              verticalLinesColor="rgba(14,164,164,0.5)"
              xAxisColor="#0BA5A4"
              color="#0BA5A4"
              xAxisLabelTextStyle={{ color: 'gray', fontSize: 8 }}
              yAxisTextStyle={{ color: 'gray', fontSize: 10 }}
              yAxisLabelPrefix=""
              yAxisLabelSuffix=""
              noOfSections={4}
              startAtZero
              adjustForEmptyLabel={true}
              width={screenWidth + monthlyStats.length * 30} // Adjusted width for scrolling
            />
          </View>
        </ScrollView>
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
});

export default MonthlyPollination;

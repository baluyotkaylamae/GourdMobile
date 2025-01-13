import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import AuthGlobal from '../Context/Store/AuthGlobal';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../assets/common/baseurl';
import { useNavigation } from '@react-navigation/native';
import { logoutUser } from '../Context/Actions/Auth.actions';

const CustomDrawerContent = (props) => {
  const context = useContext(AuthGlobal);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('jwt');
        const userId = context.stateUser?.user?.userId;
        if (userId && token) {
          const response = await axios.get(`${baseURL}users/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUserDetails(response.data.user || {});
        } else {
          console.error('User ID or token is missing');
        }
      } catch (error) {
        console.error('Error fetching user details:', error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    if (context.stateUser.isAuthenticated) {
      fetchUserDetails();
    }
  }, [context.stateUser.isAuthenticated]);

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('jwt');
      const userId = context.stateUser?.user?.userId;

      await axios.post(`${baseURL}users/logout`, { userId }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await AsyncStorage.removeItem('jwt');
      logoutUser(context.dispatch);
      navigation.navigate('Login');
    } catch (error) {
      console.error('Logout error:', error.response ? error.response.data : error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <DrawerContentScrollView {...props}>
       <TouchableOpacity 
        onPress={() => navigation.navigate('Home', { screen: 'Home' })}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Gourdtify</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.userInfoContainer}>
        <Image source={{ uri: userDetails?.image || 'https://via.placeholder.com/50' }} style={styles.userImage} />
        <Text style={styles.userName}>{userDetails?.name || 'Guest'}</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    backgroundColor: '#4DA674',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF3B30',
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomDrawerContent;
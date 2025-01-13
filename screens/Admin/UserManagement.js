import React, { useState, useEffect } from 'react';
import baseURL from "../../assets/common/baseurl";
import { View, Text, Button, StyleSheet, Alert, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserManagement = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('jwt');
      if (!storedToken) {
        alert('You are not logged in');
        return;
      }

      const response = await fetch(`${baseURL}users/`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        }
      });

      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        alert('Failed to fetch users');
      }
    } catch (error) {
      alert('Error fetching users');
    }
  };

  const handleDeleteUser = async (userId) => {
    const storedToken = await AsyncStorage.getItem('jwt');
    if (!storedToken) {
      alert('You are not logged in');
      return;
    }

    try {
      const response = await fetch(`${baseURL}users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        }
      });

      if (response.ok) {
        Alert.alert('Success', 'User deleted successfully', [
          { text: 'OK', onPress: () => fetchUsers() }
        ]);
      } else {
        alert('Failed to delete user');
      }
    } catch (error) {
      alert('Error deleting user');
    }
  };

  const handleToggleAdmin = async (userId, isAdmin) => {
    const storedToken = await AsyncStorage.getItem('jwt');
    if (!storedToken) {
      alert('You are not logged in');
      return;
    }
  
    try {
      const response = await fetch(`${baseURL}users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin: !isAdmin }), // Toggling the admin status
      });
  
      if (response.ok) {
        Alert.alert('Success', 'User admin status updated', [
          { text: 'OK', onPress: () => fetchUsers() }
        ]);
      } else {
        alert('Failed to update admin status');
      }
    } catch (error) {
      alert('Error updating admin status');
    }
  };
  

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <Text style={styles.userName}>{item.name}</Text>
      <Text style={styles.userEmail}>{item.email}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, item.isAdmin ? styles.revokeButton : styles.makeAdminButton]}
          onPress={() => handleToggleAdmin(item._id, item.isAdmin)}
        >
          <Text style={styles.buttonText}>{item.isAdmin ? 'Revoke Admin' : 'Make Admin'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]} 
          onPress={() => handleDeleteUser(item._id)}
        >
          <Text style={styles.buttonText}>Delete User</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>User Management</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E0F8E6',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  userItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '48%',
    alignItems: 'center',
  },
  makeAdminButton: {
    backgroundColor: '#4CAF50',
  },
  revokeButton: {
    backgroundColor: '#FFC107',
  },
  deleteButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default UserManagement;

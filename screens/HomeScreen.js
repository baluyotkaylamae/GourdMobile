import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../assets/common/baseurl'; // Adjust the path if necessary
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import the icon library

const HomeScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatTime = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const seconds = Math.floor((now - postDate) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(seconds / 3600);
    const days = Math.floor(seconds / 86400);

    if (seconds < 60) return `${seconds} sec ago`;
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hr ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return postDate.toLocaleDateString();
  };

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await axios.get(`${baseURL}posts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Fetched posts:', response.data);
      const shuffledPosts = shuffleArray(response.data);
      setPosts(shuffledPosts);
    } catch (error) {
      console.error('Error fetching posts:', error.response ? error.response.data : error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPosts();
    });
    return unsubscribe;
  }, [navigation]);

  const renderPost = ({ item }) => (
    <View style={styles.postContainer}>
      <Text style={styles.postTitle}>{item.title}</Text>
      {item.content.split('\n').map((line, index) => (
        <Text key={index}>{line}</Text>
      ))}
      <Text style={styles.postCategory}>Category: {item.category?.name || 'Uncategorized'}</Text>
      <Text style={styles.postUser}>Posted by: {item.user?.name || 'Unknown'}</Text>
      <Text style={styles.postDate}>{formatTime(item.createdAt)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Gourdify Apps</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" />
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPost}
          keyExtractor={(item) => item._id}
          style={styles.postsList}
        />
      )}

      {/* Floating Plus Icon Button */}
      <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('CreatePost')}>
        <Icon name="add" size={30} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  postContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postCategory: {
    color: '#777',
  },
  postUser: {
    fontStyle: 'italic',
  },
  postDate: {
    color: '#aaa',
    fontSize: 12,
  },
  postsList: {
    marginTop: 20,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    padding: 10,
    elevation: 5,
  },
});

export default HomeScreen;

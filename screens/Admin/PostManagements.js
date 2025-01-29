import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, Button, StyleSheet, ActivityIndicator, Image, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from "../../assets/common/baseurl";
import Swiper from 'react-native-swiper';

const AdminPostManagement = () => {
  const [posts, setPosts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postStatus, setPostStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("jwt");
      const response = await axios.get(`${baseURL}posts`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleOpenModal = (post) => {
    setSelectedPost(post);
    setPostStatus(post.status || 'Pending');
    setModalVisible(true);
  };

  const handleUpdateStatus = async () => {
    if (selectedPost && postStatus) {
      try {
        const storedToken = await AsyncStorage.getItem("jwt");
        await axios.put(
          `${baseURL}posts/status/${selectedPost._id}`,
          { status: postStatus },
          {
            headers: { Authorization: `Bearer ${storedToken}` },
          }
        );
        fetchPosts();
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating post status:', error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    Alert.alert(
      "Delete Post",
      "Are you sure you want to delete this post?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const storedToken = await AsyncStorage.getItem("jwt");
              await axios.delete(`${baseURL}posts/${postId}`, {
                headers: { Authorization: `Bearer ${storedToken}` },
              });
              fetchPosts(); // Refresh post list
            } catch (error) {
              console.error('Error deleting post:', error);
            }
          },
        },
      ]
    );
  };

  const renderPostItem = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text style={styles.postDetail}>Author: {item.user?.name}</Text>
      <Text style={styles.postDetail}>Content: {item.content}</Text>
      <Text style={styles.postDetail}>Status: {item.status}</Text>
      
      {item.images && item.images.length > 0 && (
        <View style={{ flex: 1 }}>
          <Swiper style={{ height: 200 }} autoplay autoplayTimeout={10}>
            {item.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} />
            ))}
          </Swiper>
        </View>
      )}

      <View style={styles.buttonContainer}>
        {item.status === 'Pending' && (
          <TouchableOpacity
            style={styles.updateButton}
            onPress={() => handleOpenModal(item)}
          >
            <Text style={styles.updateButtonText}>Update Status</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeletePost(item._id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    loading ? <ActivityIndicator size="large" color="#FF6347" style={styles.loadingIndicator} /> :
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item._id}
      />
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Update Post Status</Text>
            <Picker
              selectedValue={postStatus}
              onValueChange={(itemValue) => setPostStatus(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Pending" value="Pending" />
              <Picker.Item label="Approved" value="Approved" />
              <Picker.Item label="Rejected" value="Rejected" />
            </Picker>
            <View style={styles.modalButtons}>
              <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF6347" />
              <Button
                title="Update"
                onPress={handleUpdateStatus}
                color="#28A745"
                disabled={postStatus === selectedPost?.status}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f7f7f7' },
  postCard: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  postTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  postDetail: { fontSize: 14, marginVertical: 3, color: '#666' },
  image: { width: '100%', height: 200, borderRadius: 8, marginTop: 10, resizeMode: 'cover' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  updateButton: {
    paddingVertical: 10,
    backgroundColor: '#28A745',
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  updateButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  deleteButton: {
    paddingVertical: 10,
    backgroundColor: '#FF6347',
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  deleteButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContainer: {
    width: '85%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    elevation: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 12 },
  picker: { height: 50, width: '100%', color: '#333' },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
  loadingIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
  },
});

export default AdminPostManagement;

import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';

const createPost = ({ navigation }) => { // Accept navigation prop
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const { stateUser } = useContext(AuthGlobal);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        const response = await axios.get(`${baseURL}category/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const formattedCategories = response.data.map((category) => ({
          label: category.name,
          value: category._id,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error.response ? error.response.data : error.message);
      }
    };

    fetchCategories();
  }, []);

  const createPost = async () => {
    if (!title || !content || !stateUser.user.userId || !selectedCategory) {
      console.error('Title, content, user ID, and category are required.');
      return;
    }
  
    const postData = {
      title,
      content,
      user: stateUser.user.userId,
      category: selectedCategory,
      likes: 0,
      comments: [],
    };
  
    try {
      const token = await AsyncStorage.getItem('jwt');
      const response = await axios.post(`${baseURL}posts/`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      console.log('Post created successfully:', response.data);
  
      // Clear input fields
      setTitle('');
      setContent('');
      setSelectedCategory(null);
  
      // Navigate back to HomeScreen after successful post creation
      navigation.navigate('Home'); // Change to 'Home'
      // or navigation.popToTop(); // Alternative to clear stack
    } catch (error) {
      console.error('Error creating post:', error.response ? error.response.data : error.message);
    }
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Create a Post</Text>
        <View style={styles.formContainer}>
          <TextInput
            placeholder="Post Title"
            value={title}
            onChangeText={(text) => setTitle(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="Post Content"
            value={content}
            onChangeText={(text) => setContent(text)}
            style={[styles.input, styles.contentInput]}
            multiline
          />
          <DropDownPicker
            open={open}
            value={selectedCategory}
            items={categories}
            setOpen={setOpen}
            setValue={setSelectedCategory}
            setItems={setCategories}
            placeholder="Select a Category"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
          />
          <Button title="Create Post" onPress={createPost} color="#4CAF50" />
        </View>
      </View>
    </TouchableWithoutFeedback>
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
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  contentInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  dropdown: {
    marginBottom: 15,
    borderColor: '#ccc',
    borderRadius: 10,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
});

export default createPost;

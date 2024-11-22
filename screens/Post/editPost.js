import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import FormContainer from "../../Shared/Form/FormContainer";
import InputUser from "../../Shared/Form/InputUser";
import HeaderReg from "../../Shared/HeaderReg";
import Error from "../../Shared/Error";
import axios from "axios";
import baseURL from "../../assets/common/baseurl";
import Toast from "react-native-toast-message";
import * as ImagePicker from "expo-image-picker";
import mime from "mime";
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditPost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();
  const route = useRoute(); // Get the route params for the post ID

  const { postId } = route.params; // Post ID from navigation params

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (!token) throw new Error("No token found in AsyncStorage");

        // Fetch the post data
        const response = await axios.get(`${baseURL}posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const postData = response.data;
        setTitle(postData.title);
        setContent(postData.content);
        setSelectedCategory(postData.category._id);
        setImages(postData.images || []);
      } catch (error) {
        console.error('Error fetching post details:', error.message);
        setError('Error fetching post details.');
      }
    };

    const fetchCategories = async () => {
      try {
        const token = await AsyncStorage.getItem('jwt');
        if (!token) throw new Error("No token found in AsyncStorage");

        const response = await axios.get(`${baseURL}category`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const formattedCategories = response.data.map((category) => ({
          label: category.name,
          value: category._id,
        }));
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error.message);
      }
    };

    fetchPostDetails();
    fetchCategories();
  }, [postId]);

  const pickImages = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const selectedImages = result.assets.map(asset => asset.uri);
      setImages(selectedImages);
    }
  };

  const updatePost = async () => {
    if (!title || !content || !selectedCategory) {
      setError("Please fill in all fields.");
      return;
    }

    let formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", selectedCategory);

    images.forEach((imageUri) => {
      const newImageUri = `file:///${imageUri.split("file:/").join("")}`;
      formData.append("images", {
        uri: newImageUri,
        type: mime.getType(newImageUri) || 'image/jpeg',
        name: newImageUri.split("/").pop(),
      });
    });

    try {
      const token = await AsyncStorage.getItem('jwt');
      if (!token) throw new Error("No token found in AsyncStorage");

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.put(`${baseURL}posts/${postId}`, formData, config);
      if (res.status === 200) {
        Toast.show({
          topOffset: 60,
          type: "success",
          text1: "Post Updated Successfully",
          text2: "Your post has been updated.",
        });

        // Clear the input fields
        setTitle('');
        setContent('');
        setSelectedCategory(null);
        setImages([]);
        setTimeout(() => {
          navigation.navigate("Home");
        }, 500);
      }
    } catch (error) {
      console.error('Error updating post:', error.message);
      setError(error.response?.data?.message || 'Something went wrong');
      Toast.show({
        position: 'bottom',
        bottomOffset: 20,
        type: "error",
        text1: "Error Updating Post",
        text2: error.response?.data?.message || "Please try again",
      });
    }
  };

  return (
    <FlatList
      data={[{}]}
      keyExtractor={(item, index) => index.toString()}
      renderItem={() => (
        <View style={styles.container}>
          <HeaderReg />
          <FormContainer>
            <InputUser
              placeholder={"Title"}
              name={"title"}
              id={"title"}
              onChangeText={setTitle}
              value={title}
            />
            <InputUser
              placeholder={"Content"}
              name={"content"}
              id={"content"}
              multiline
              numberOfLines={4}
              onChangeText={setContent}
              value={content}
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
            <TouchableOpacity style={styles.imageContainer} onPress={pickImages}>
              {images.length > 0 ? (
                images.map((uri, index) => (
                  <Image key={index} style={styles.image} source={{ uri }} />
                ))
              ) : (
                <Text>Select Images</Text>
              )}
            </TouchableOpacity>

            {error ? <Error message={error} /> : null}

            <EasyButton
              login
              primary
              onPress={updatePost}
              style={styles.loginButton}
            >
              <Text style={{ color: "white", fontWeight: "bold", letterSpacing: 1 }}>Update Post</Text>
            </EasyButton>
          </FormContainer>
        </View>
      )}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E0F8E6",
  },

  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#1f6f78",
    marginTop: 20,
    alignSelf: 'center',
    position: 'relative',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    margin: 5,
  },
  loginButton: {
    backgroundColor: "#1f6f78",
  },
  dropdown: {
    marginBottom: 15,
  },
  dropdownContainer: {
    borderColor: '#ccc',
  },
});

export default EditPost;

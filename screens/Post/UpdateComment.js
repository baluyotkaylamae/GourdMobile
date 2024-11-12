import React, { useState, useEffect } from 'react';
import baseURL from "../../assets/common/baseurl";
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UpdateComment = ({ route, navigation }) => {
    const { postId, commentId, currentContent } = route.params;
    console.log(commentId, currentContent, postId); 
  
    const [updatedContent, setUpdatedContent] = useState(currentContent);
  
    const handleSave = async () => {
      if (!postId || !commentId) {
        alert('Post ID or Comment ID is missing!');
        return;
      }
  
      try {
        const storedToken = await AsyncStorage.getItem('jwt');
        if (!storedToken) {
          alert('You are not logged in');
          return;
        }
  
        const response = await fetch(`${baseURL}posts/${postId}/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: updatedContent }),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Alert.alert('Success', 'Comment updated successfully', [
            { text: 'OK', onPress: () => navigation.goBack() }
          ]);
        } else {
          alert('Failed to update comment');
        }
      } catch (error) {
        alert('Error updating comment');
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.label}>Update your comment:</Text>
        <TextInput
          style={styles.input}
          value={updatedContent}
          onChangeText={setUpdatedContent}
          multiline={true}
        />
        <Button title="Save" onPress={handleSave} />
      </View>
    );
  };
  

    const styles = StyleSheet.create({
        container: {
            padding: 20,
        },
        label: {
            fontSize: 16,
            marginBottom: 10,
        },
        input: {
            height: 100,
            borderColor: '#ccc',
            borderWidth: 1,
            marginBottom: 20,
            padding: 10,
            textAlignVertical: 'top', // Align text to the top for multiline
        },
    });

    export default UpdateComment;
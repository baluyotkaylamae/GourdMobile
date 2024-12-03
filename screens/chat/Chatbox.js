import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import baseURL from '../../assets/common/baseurl';

const ChatScreen = ({ route }) => {
  const { userId: receiverId } = route.params; // Get receiverId passed from the navigation
  const context = useContext(AuthGlobal); // Access the AuthGlobal context
  const [messages, setMessages] = useState([]); // Messages for the conversation
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [newMessage, setNewMessage] = useState(''); // Input for the new message

  useEffect(() => {
    const fetchMessages = async () => {
      const storedToken = await AsyncStorage.getItem('jwt');
      const senderId = context.stateUser?.user?.userId; // Get sender's ID from AuthGlobal context

      if (!senderId) {
        console.error("User ID not found");
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      if (storedToken) {
        try {
          console.log(`Fetching messages between senderId: ${senderId} and receiverId: ${receiverId}`);
          const response = await axios.get(
            `${baseURL}chat/messages/${senderId}/${receiverId}`,
            { headers: { Authorization: `Bearer ${storedToken}` } }
          );
          console.log("Fetched messages:", response.data);
          setMessages(response.data.messages || []);
        } catch (err) {
          console.error("Error fetching messages:", err.response?.data || err.message);
          setError('Error fetching messages');
        } finally {
          setLoading(false);
        }
      } else {
        console.error("Token not found in AsyncStorage");
        setError('User not authenticated');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [receiverId]); // Re-fetch when receiverId changes

  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent empty messages
  
    const storedToken = await AsyncStorage.getItem('jwt');
    const senderId = context.stateUser?.user?.userId;
  
    if (!storedToken || !senderId) {
      console.error("Token or sender ID is missing.");
      setError('Authentication failed');
      return;
    }
  
    const messageData = {
      sender: senderId,
      user: receiverId,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),  // Add a timestamp if required
    };
  
    console.log("Message data to be sent:", messageData);
  
    try {
      const response = await axios.post(
        `${baseURL}chat/messages`,
        messageData,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );
      console.log("Message sent successfully:", response.data);
      if (response.data && response.data.message) {
        setMessages((prevMessages) => [...prevMessages, response.data.message]);
        setNewMessage(''); // Clear the input field
      } else {
        console.error("Unexpected response data:", response.data);
        setError('Unexpected server response');
      }
    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
      setError('Error sending message');
    }
  };
  

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === context.stateUser?.user?.userId
          ? styles.myMessage
          : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.message}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id}
            style={styles.messageList}
            inverted // To display the latest message at the bottom
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type your message..."
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  messageList: {
    flex: 1,
    padding: 10,
  },
  messageContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  myMessage: {
    alignSelf: 'flex-start', // Align the sender's message to the left
    backgroundColor: '#dcf8c6', // Green background for the sender
  },
  otherMessage: {
    alignSelf: 'flex-end', // Align the receiver's message to the right
    backgroundColor: '#f0f0f0', // Light gray background for the receiver
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 20,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
});

export default ChatScreen;

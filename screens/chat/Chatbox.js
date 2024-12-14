import React, { useEffect, useState, useContext, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import baseURL from '../../assets/common/baseurl';

const Chatbox = ({ route }) => {
  const { userId: receiverId } = route.params; // Receiver ID from navigation params
  const context = useContext(AuthGlobal); // Access the AuthGlobal context
  const [messages, setMessages] = useState([]); // Messages for the conversation
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [newMessage, setNewMessage] = useState(''); // Input for the new message
  const flatListRef = useRef(); // Reference for FlatList

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const storedToken = await AsyncStorage.getItem('jwt');
        const senderId = context.stateUser?.user?.userId;

        if (!senderId || !storedToken) {
          throw new Error('Authentication failed');
        }

        console.log(`Fetching messages between senderId: ${senderId} and receiverId: ${receiverId}`);
        const response = await axios.get(
          `${baseURL}chat/messages/${senderId}/${receiverId}`,
          { headers: { Authorization: `Bearer ${storedToken}` } }
        );

        console.log('Fetched messages:', response.data);
        setMessages(response.data.messages || []);
      } catch (err) {
        // console.error('Error fetching messages:', err.response?.data || err.message);
        // setError(err.message || 'Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [receiverId, context.stateUser]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return; // Prevent empty messages

    try {
      const storedToken = await AsyncStorage.getItem('jwt');
      const senderId = context.stateUser?.user?.userId;

      if (!storedToken || !senderId) {
        throw new Error('Authentication failed');
      }

      const messageData = {
        sender: senderId,
        user: receiverId,
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
      };

      console.log('Message data to be sent:', messageData);

      const response = await axios.post(
        `${baseURL}chat/messages`,
        messageData,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      console.log('Message sent successfully:', response.data);
      setMessages((prevMessages) => [...prevMessages, response.data.message]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err.response?.data || err.message);
      setError(err.message || 'Failed to send message');
    }
  };

  const renderMessage = ({ item }) => {
    const senderId = item.sender?._id || item.sender?.id;
    const currentUserId = context.stateUser?.user?.userId;
    const isMyMessage = senderId === currentUserId;

    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessage : styles.otherMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.message}</Text>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
            style={styles.messageList}
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
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
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

export default Chatbox;

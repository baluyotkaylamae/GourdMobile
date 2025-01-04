import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Modal, Alert, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import baseURL from '../../assets/common/baseurl';
import { useFocusEffect } from '@react-navigation/native';
import io from 'socket.io-client';
import Icon from 'react-native-vector-icons/FontAwesome';
import { filterBadWords } from '../filteredwords';
import { socket } from '../../socket/index';

const Chatbox = ({ route }) => {
  const { userId: receiverId } = route.params; // Receiver ID from navigation params
  const context = useContext(AuthGlobal); // Access the AuthGlobal context
  const [messages, setMessages] = useState([]); // Messages for the conversation
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [newMessage, setNewMessage] = useState(''); // Input for the new message
  const [visibleTimestamp, setVisibleTimestamp] = useState(null); // ID of the clicked message
  const flatListRef = useRef(); // Reference for FlatList
  // const socket = useRef(null); // Socket reference
  const [isModalVisible, setModalVisible] = useState(false); // Modal visibility
  const [selectedMessageId, setSelectedMessageId] = useState(null); // Selected message for deletion

  const handleLongPress = (messageId) => {
    setSelectedMessageId(messageId);
    setModalVisible(true); // Show the modal
  };

  const confirmDeleteMessage = () => {
    deleteMessage(selectedMessageId); // Call deleteMessage function
    setModalVisible(false); // Close the modal
    setSelectedMessageId(null); // Reset selected message
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    if (date.toDateString() === now.toDateString()) {
      // If it's today, show only the time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    }

    const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
    if (date >= oneWeekAgo) {
      // If within the last week, show the weekday and time
      return date.toLocaleString('en-US', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
    }

    // Otherwise, show the date
    return date.toLocaleDateString();
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);

    try {
      const storedToken = await AsyncStorage.getItem('jwt');
      const senderId = context.stateUser?.user?.userId;

      if (!senderId || !storedToken) {
        throw new Error('Authentication failed');
      }

      // console.log(`Fetching messages between senderId: ${senderId} and receiverId: ${receiverId}`);
      const response = await axios.get(
        `${baseURL}chat/messages/${senderId}/${receiverId}`,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      // console.log('Fetched messages:', response.data);
      // setMessages(response.data.messages || []);
      setMessages(response.data.messages.map(message => ({
        ...message,
        message: filterBadWords(message.message) // Filter incoming message
      })) || []);

      // Once the messages are fetched, mark them as read
      await markMessagesAsRead(response.data.messages || []);

    } catch (err) {
      if (err.response?.status === 404) {
        // console.warn('No messages found, setting empty message list');
        setMessages([]); // No messages yet
      } else {
        // console.error('Error fetching messages:', err.response?.data || err.message);
        setError(err.message || 'Failed to load messages');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  
    fetchMessages();
  }, [receiverId, context.stateUser]);

  const markMessagesAsRead = async (messages) => {
    const storedToken = await AsyncStorage.getItem('jwt');
    const senderId = context.stateUser?.user?.userId;

    if (!storedToken || !senderId) return;

    try {
      const response = await axios.put(
        `${baseURL}chat/messages/read`,
        { messages: messages.map(msg => msg._id) }, // Send an array of message IDs
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      // console.log('Marked messages as read:', response.data);
      // Optionally, update the local state to reflect changes
      setMessages(prevMessages =>
        prevMessages.map(msg => ({ ...msg, isRead: true })) // Update all messages to isRead: true
      );
    } catch (err) {
      // console.error('Error marking messages as read:', err.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const storedToken = AsyncStorage.getItem('jwt');
      // socket = io(baseURL, {
      //   query: { token: storedToken },
      // });

      // socket.connect();

      socket.on('connect', () => {
        // console.log('Connected to socket server');
      });
      // console.log(context.stateUser?.user?.userId)
      socket.emit('joinRoom', { userId: context.stateUser?.user?.userId, receiverId });

      socket.emit('message', (message) => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { ...message, message: filterBadWords(message.message) } // Filter incoming message
        ]);
      });

      return () => {
        socket.disconnect();
        // console.log('Disconnected from socket server');
      };
    }, [receiverId])
  );

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
  
    const filteredMessage = filterBadWords(newMessage.trim());
    
    // Check if the message contains filtered words
    if (filteredMessage !== newMessage.trim()) {
      // Show a warning or prevent the message from being sent
      // console.warn("Message contains inappropriate content and will not be sent.");
      return;
    }
  
    const tempMessage = {
      _id: new Date().toISOString(),
      sender: { _id: context.stateUser?.user?.userId },
      message: filteredMessage,
    };
    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setNewMessage('');
  
    try {
      const storedToken = await AsyncStorage.getItem('jwt');
      const senderId = context.stateUser?.user?.userId;
  
      if (!storedToken || !senderId) throw new Error('Authentication failed');
  
      const messageData = {
        sender: senderId,
        user: receiverId,
        message: newMessage.trim(),
      };
  
      const response = await axios.post(
        `${baseURL}chat/messages`,
        messageData,
        { headers: { Authorization: `Bearer ${storedToken}` } }
      );

      // console.log(response.data);

      socket.emit('sendMessage', {...response.data.chat,userId:response.data.chat.user});
    } catch (err) {
      // console.error('Error sending message:', err.message);
    }
  };
  useEffect (() => {
    socket.on('receiveMessage', (message) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, message: filterBadWords(message.message) } // Filter incoming message
      ]); 
    });
  }, []);

  const deleteMessage = async (messageId) => {
    try {
        const storedToken = await AsyncStorage.getItem('jwt');

        if (!storedToken) {
            throw new Error('Authentication failed');
        }

        const response = await axios.delete(`${baseURL}chat/${messageId}`, {
            headers: { Authorization: `Bearer ${storedToken}` },
        });

        if (response.data.success) {
            // Remove the message from local state
            setMessages((prevMessages) =>
                prevMessages.filter((chat) => chat._id !== messageId)
            );
        }
    } catch (err) {
        // console.error('Error deleting message:', err.message);
    }
};

  const renderMessage = ({ item }) => {
    const senderId = item.sender?._id || item.sender?.id;
    const currentUserId = context.stateUser?.user?.userId;
    const isMyMessage = senderId === currentUserId;

    return (
      <TouchableOpacity onLongPress={() => handleLongPress(item._id)}>
        <View
          style={[
            styles.messageWrapper,
            isMyMessage ? styles.myMessageWrapper : styles.otherMessageWrapper,
          ]}
        >
          {!isMyMessage && (
            <Image
              source={{ uri: item.sender?.image || 'https://via.placeholder.com/50' }}
              // onError={(e) => console.log('Image failed to load:', e.nativeEvent.error)}
              style={styles.userAvatar}
            />
          )}
          <View
            style={[
              styles.messageContainer,
              isMyMessage ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.messageText}>{item.message}</Text>
            <Text style={styles.timestamp}>{formatTimestamp(item.createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

return (
  <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
    {/* Render messages */}
    {loading ? (
      <ActivityIndicator size="large" color="#0000ff" />
    ) : error ? (
      <Text style={styles.errorText}>{error}</Text>
    ) : (
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
        style={styles.messageList}
      />
    )}

    {/* Input for new messages */}
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.textInput}
        value={newMessage}
        onChangeText={setNewMessage}
        placeholder="Type your message..."
      />
      <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
        <Icon name="arrow-right" size={20} color="#fff" />
      </TouchableOpacity>
    </View>

    {/* Modal for confirmation */}
    <Modal
      visible={isModalVisible}
      transparent
      animationType="slide"
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text>Do you want to delete this message?</Text>
          <View style={styles.modalButtons}>
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
            <Button title="Okay" onPress={confirmDeleteMessage} />
          </View>
        </View>
      </View>
    </Modal>
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
    backgroundColor: '#90EE90',
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
  noMessagesText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    margin: 20,
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  myMessageWrapper: {
    justifyContent: 'flex-end',
  },
  otherMessageWrapper: {
    justifyContent: 'flex-start',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  timestampText: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
});

export default Chatbox;

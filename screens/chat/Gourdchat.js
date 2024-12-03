import React, { useEffect, useState, useContext } from 'react';
import {
  View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';

const ChatScreen = ({ navigation }) => {
  const context = useContext(AuthGlobal);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = await AsyncStorage.getItem('jwt');
      setToken(storedToken);

      try {
        // Fetch users
        const usersResponse = await fetch(`${baseURL}users`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetch chats
        const chatsResponse = await fetch(`${baseURL}chat/chats`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const chatsData = await chatsResponse.json();
        setChats(chatsData);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUserClick = (userId) => {
    navigation.navigate('UserChatScreen', { userId });
  };

  const handleChatClick = (chatId) => {
    navigation.navigate('ChatDetail', { chatId });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserClick(item._id)} style={styles.userCard}>
      {/* Check if avatar exists and provide a default placeholder image */}
      <Image 
        source={{ uri: item.image ? item.image : 'https://via.placeholder.com/50' }} 
        style={styles.userAvatar} 
      />
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleChatClick(item._id)} style={styles.chatCard}>
      <View style={styles.chatHeader}>
        {/* Check if avatar exists and provide a default placeholder image */}
        <Image 
          source={{ uri: item.user?.image ? item.user.image : 'https://via.placeholder.com/50' }} 
          style={styles.chatAvatar} 
        />
        <Text style={styles.chatUser}>{item.user?.name || 'Anonymous'}</Text>
      </View>
      <Text style={styles.chatMessage}>{item.lastMessage?.content || 'No messages yet'}</Text>
      <Text style={styles.chatTimestamp}>
        {item.lastMessage?.createdAt ? new Date(item.lastMessage.createdAt).toLocaleTimeString() : ''}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text>{error}</Text>
      ) : (
        <>
          {/* Render Users at the top */}
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={item => item._id}
            horizontal
            style={styles.userList}
          />

          {/* Render Chats below users */}
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={item => item._id}
            style={styles.chatList}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  userList: { marginBottom: 20 },
  userCard: { 
    alignItems: 'center', 
    marginRight: 20, 
    backgroundColor: '#fff', 
    padding: 10, 
    borderRadius: 10, 
    elevation: 3, 
    justifyContent: 'center', 
    width: 80,
  },
  userAvatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginBottom: 5 
  },
  userName: { 
    fontSize: 14, 
    fontWeight: 'bold',
    color: '#333' 
  },
  chatList: { flex: 1 },
  chatCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatUser: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  chatMessage: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
});

export default ChatScreen;

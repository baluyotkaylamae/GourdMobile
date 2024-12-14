import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
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

  const currentUserId = context.stateUser?.user?.userId;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('jwt');
        if (!storedToken) {
          setError('No token found');
          return;
        }
        setToken(storedToken);

        const usersResponse = await fetch(`${baseURL}users`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const chatsResponse = await fetch(`${baseURL}chat/chats`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const chatsData = await chatsResponse.json();
        const consolidatedChats = consolidateChats(chatsData.chats || []);
        setChats(consolidatedChats);
      } catch (err) {
        setError('Error fetching data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId]);

  const consolidateChats = (chatsList) => {
    const chatPairMap = new Map();

    chatsList.forEach((chat) => {
      if (!chat.sender || !chat.user) return;
      if (chat.sender._id !== currentUserId && chat.user._id !== currentUserId) return;

      const otherUser = chat.sender._id === currentUserId ? chat.user : chat.sender;
      const chatPairKey = otherUser._id;

      if (!chatPairMap.has(chatPairKey)) {
        chatPairMap.set(chatPairKey, {
          otherUser,
          lastMessage: chat.lastMessage,
          lastMessageTimestamp: chat.lastMessageTimestamp,
          chatId: chat._id,
        });
      } else {
        const existingChat = chatPairMap.get(chatPairKey);
        if (new Date(chat.lastMessageTimestamp) > new Date(existingChat.lastMessageTimestamp)) {
          chatPairMap.set(chatPairKey, {
            otherUser,
            lastMessage: chat.lastMessage,
            lastMessageTimestamp: chat.lastMessageTimestamp,
            chatId: chat._id,
          });
        }
      }
    });

    return Array.from(chatPairMap.values());
  };

  const handleUserClick = (userId) => {
    navigation.navigate('UserChatScreen', { userId });
  };

  const handleChatClick = (chatId, userId) => {
    navigation.navigate('UserChatScreen', { chatId, userId });
  };

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserClick(item._id)} style={styles.userCard}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/50' }}
        style={styles.userAvatar}
      />
      <Text style={styles.userName}>{item.name}</Text>
      {item.isOnline && <View style={styles.onlineIndicator}></View>}
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleChatClick(item.chatId, item.otherUser._id)} style={styles.chatCard}>
      <Image
        source={{ uri: item.otherUser.image || 'https://via.placeholder.com/50' }}
        style={styles.chatAvatar}
      />
      <View style={styles.chatContent}>
        <Text style={styles.chatUser}>{item.otherUser.name}</Text>
        <Text style={styles.chatMessage}>{item.lastMessage}</Text>
        <Text style={styles.chatTimestamp}>
          {new Date(item.lastMessageTimestamp).toLocaleTimeString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chats</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0078d4" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id ? item._id : item.name}
            horizontal
            style={styles.userList}
            showsHorizontalScrollIndicator={false}
          />
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => `${item.chatId}-${item.otherUser._id}`}
            style={styles.chatList}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f5f5f5' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  userList: { marginBottom: 0 },
  userCard: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 50,
    elevation: 8,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
  },
  userAvatar: { width: 50, height: 50, borderRadius: 25 },
  userName: { fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  chatList: { flex: 1, marginTop: 15 },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
    padding: 12,
    elevation: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  chatAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 20 },
  chatContent: { flex: 1, justifyContent: 'center' },
  chatUser: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  chatMessage: { fontSize: 14, color: '#555', marginTop: 5 },
  chatTimestamp: { fontSize: 12, color: '#888', marginTop: 5 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});

export default ChatScreen;

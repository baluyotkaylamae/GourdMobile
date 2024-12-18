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
  const [triggerRefresh, setTriggerRefresh] = useState(false);  // Add triggerRefresh state

  const currentUserId = context.stateUser?.user?.userId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedToken = await AsyncStorage.getItem('jwt');
        if (!storedToken) throw new Error('No token found');
        setToken(storedToken);

        const usersResponse = await fetch(`${baseURL}users`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const chatsResponse = await fetch(`${baseURL}chat/chats`, {
          headers: { Authorization: `Bearer ${storedToken}` },
        });
        if (!chatsResponse.ok) throw new Error('Failed to fetch chats');
        const chatsData = await chatsResponse.json();
        setChats(consolidateChats(chatsData.chats || []));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUserId, triggerRefresh]);  // Depend on triggerRefresh to refresh data

  const consolidateChats = (chatsList) => {
    const chatPairMap = new Map();
    chatsList.forEach((chat) => {
      if (!chat.sender || !chat.user) return;
      if (chat.sender._id !== currentUserId && chat.user._id !== currentUserId) return;

      const otherUser = chat.sender._id === currentUserId ? chat.user : chat.sender;
      const chatPairKey = otherUser._id;

      if (!chatPairMap.has(chatPairKey)) {
        chatPairMap.set(chatPairKey, { ...chat, otherUser });
      } else {
        const existingChat = chatPairMap.get(chatPairKey);
        if (new Date(chat.lastMessageTimestamp) > new Date(existingChat.lastMessageTimestamp)) {
          chatPairMap.set(chatPairKey, { ...chat, otherUser });
        }
      }
    });

    return Array.from(chatPairMap.values()).sort(
      (a, b) => new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp)
    );
  };

  const handleUserClick = (userId, userName) => navigation.navigate('UserChatScreen', { userId, name: userName });
  const handleChatClick = (chatId, userId, userName) => navigation.navigate('UserChatScreen', { chatId, userId, name: userName });

  const renderUserItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleUserClick(item._id, item.name)} style={styles.userCard}>
      <Image
        source={{ uri: item.image || 'https://via.placeholder.com/50' }}
        style={styles.userAvatar}
      />
      <Text style={styles.userName}>{item.name}</Text>
      {item.isOnline && <View style={styles.onlineIndicator}></View>}
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleChatClick(item._id, item.otherUser._id, item.otherUser.name)}
      style={[
        styles.chatCard,
        item.lastMessageIsRead === false && styles.unreadChatCard,  // Apply highlight if message is unread
      ]}
    >
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

  // Trigger refresh whenever the data is required to be refreshed
  const handleRefresh = () => {
    setTriggerRefresh((prev) => !prev);  // Toggle refresh state
  };

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
            keyExtractor={(item) => item._id || item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            refreshing={loading}  // Make use of refreshing prop
            onRefresh={handleRefresh}  // Handle refresh on pull-to-refresh
          />

          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => `${item.chatId}-${item.otherUser._id}`}
            refreshing={loading}  // Make use of refreshing prop
            onRefresh={handleRefresh}  // Handle refresh on pull-to-refresh
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {  backgroundColor: '#f5f5f5' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  userCard: {
    alignItems: 'center',
    marginRight: 15,
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
  },
  userAvatar: { width: 50, height: 50, borderRadius: 25 },
  userName: { fontSize: 12, fontWeight: '500', color: '#333', textAlign: 'center' },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 1,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 12,
    padding: 12,
    elevation: 3,
    alignItems: 'center',
  },
  unreadChatCard: {
    backgroundColor: '#e0f7fa',  // Light blue background for unread messages
  },
  chatAvatar: { width: 60, height: 60, borderRadius: 30, marginRight: 20 },
  chatContent: { flex: 1, justifyContent: 'center' },
  chatUser: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  chatMessage: { fontSize: 14, color: '#555', marginTop: 5 },
  chatTimestamp: { fontSize: 12, color: '#888', marginTop: 5 },
  errorText: { color: 'red', textAlign: 'center', marginTop: 20 },
});

export default ChatScreen;

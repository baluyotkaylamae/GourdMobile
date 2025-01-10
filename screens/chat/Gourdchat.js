import React, { useEffect, useState, useContext } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import baseURL from '../../assets/common/baseurl';
import AuthGlobal from '../../Context/Store/AuthGlobal';

const ChatScreen = ({ navigation }) => {
  const context = useContext(AuthGlobal);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); // State for filtered users
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState('');
  const [triggerRefresh, setTriggerRefresh] = useState(false);  // Add triggerRefresh state
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [searchText, setSearchText] = useState('');  // State for search text

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
        setFilteredUsers(usersData); // Set the users initially

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
      <View style={styles.avatarContainer}>
        <Image
          source={{ uri: item.image || 'https://via.placeholder.com/50' }}
          style={styles.userAvatar}
        />
        {item.isOnline && <View style={styles.onlineIndicator}></View>}
      </View>
      <Text style={styles.userName}>{item.name}</Text>
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

  // Handle search text change and filter users
  const handleSearchChange = (text) => {
    setSearchText(text);
  
    if (text === '') {
      setFilteredUsers(users); // Show all users if search text is empty
    } else {
      const filtered = users.filter((user) => {
        // Check if the characters in searchText appear anywhere in the user name
        const userName = user.name.toLowerCase();
        const searchQuery = text.toLowerCase();
        return searchQuery.split('').every(char => userName.includes(char));
      });
      setFilteredUsers(filtered); // Show filtered users based on name
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.header}>Chats</Text> */}

      {/* Search Box */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search for users..."
        value={searchText}
        onChangeText={handleSearchChange} // Trigger filtering
      />

      {loading ? (
        <ActivityIndicator size="large" color="#0078d4" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          {/* User List with Search Functionality */}
          <FlatList
            data={filteredUsers} // Use filtered users for display
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id || item.name}
            horizontal
            showsHorizontalScrollIndicator={false}
            refreshing={loading}
            onRefresh={handleRefresh}
          />

          {/* Spacer */}
          <View style={{ marginVertical: 10 }} />

          {/* Chats List */}
          <FlatList
            data={chats} // Use chats data here
            renderItem={renderChatItem}
            keyExtractor={(item) => `${item.chatId}-${item.otherUser._id}`}
            refreshing={loading}
            onRefresh={handleRefresh}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#f5f5f5' },
  header: { fontSize: 26, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginBottom: 20,  // Space between search and user list
    marginHorizontal: 15, // Add horizontal margin (left and right)
  },
  userCard: {
    alignItems: 'center',
    marginRight: 15,
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
  },
  avatarContainer: {
    position: 'relative', // Allows positioning of the online indicator relative to the avatar
  },
  userAvatar: { width: 50, height: 50, borderRadius: 25 },
  userName: { fontSize: 12, fontWeight: '500', color: '#333', textAlign: 'center' },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2, // Adjust to move it slightly to the right of the avatar
    width: 12,
    height: 12,
    borderRadius: 6, // Half of the width/height to make it a circle
    backgroundColor: 'green',
    borderWidth: 2, // Add border width
    borderColor: '#f5f5f5', // Set the border color to #f5f5f5
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

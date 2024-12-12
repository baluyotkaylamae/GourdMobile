// import React, { useEffect, useState, useContext } from 'react';
// import {
//   View,
//   Text,
//   FlatList,
//   StyleSheet,
//   ActivityIndicator,
//   TouchableOpacity,
//   Image,
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import baseURL from '../../assets/common/baseurl';
// import AuthGlobal from '../../Context/Store/AuthGlobal';

// const ChatScreen = ({ navigation }) => {
//   const context = useContext(AuthGlobal);
//   const [users, setUsers] = useState([]);
//   const [chats, setChats] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState('');

//   useEffect(() => {
//     const fetchData = async () => {
//       const storedToken = await AsyncStorage.getItem('jwt');
//       setToken(storedToken);

//       try {
//         // Fetching users
//         const usersResponse = await fetch(`${baseURL}users`, {
//           headers: {
//             Authorization: `Bearer ${storedToken}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         const usersData = await usersResponse.json();
//         setUsers(usersData);

//         // Fetching chats
//         const chatsResponse = await fetch(`${baseURL}chat/chats`, {
//           headers: {
//             Authorization: `Bearer ${storedToken}`,
//             'Content-Type': 'application/json',
//           },
//         });
//         const chatsData = await chatsResponse.json();

//         // Assuming chatsData returns an array of chat objects
//         setChats(chatsData.chats); // Make sure to use the correct structure based on your backend response
//       } catch (error) {
//         setError('Error fetching data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleUserClick = (userId) => {
//     navigation.navigate('UserChatScreen', { userId });
//   };

//   const handleChatClick = (chatId, userId) => {
//     navigation.navigate('UserChatScreen', { chatId, userId });
//   };

//   const renderUserItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleUserClick(item._id)} style={styles.userCard}>
//       <Image
//         source={{ uri: item.image ? item.image : 'https://via.placeholder.com/50' }}
//         style={styles.userAvatar}
//       />
//       <Text style={styles.userName}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const renderChatItem = ({ item }) => {
   
//     if (!item.sender || !item.user) {
//       return null; 
//     }
//     const otherUser = item.sender._id === context.userId ? item.user : item.sender;

//     if (!otherUser || !otherUser._id) {
//       return null; // Return nothing if the other user data is incomplete
//     }

//     return (
//       <TouchableOpacity
//       onPress={() => handleChatClick(item._id, otherUser._id)}
//       style={styles.chatCard}
//     >
//       <Image
//         source={{
//           uri: otherUser.image ? otherUser.image : 'https://via.placeholder.com/50',
//         }}
//         style={styles.chatAvatar}
//       />
//       <View style={styles.chatContent}>
//         <Text style={styles.chatUser}>{otherUser.name}</Text>
//         <Text style={styles.chatMessage}>{item.lastMessage}</Text>
//         <Text style={styles.chatTimestamp}>
//           {new Date(item.lastMessageTimestamp).toLocaleTimeString()}
//         </Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Chats</Text>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : error ? (
//         <Text style={styles.errorText}>{error}</Text>
//       ) : (
//         <>
//           <FlatList
//             data={users}
//             renderItem={renderUserItem}
//             keyExtractor={(item) => item._id}
//             horizontal
//             style={styles.userList}
//             showsHorizontalScrollIndicator={false}
//           />
//          <FlatList
//             data={chats} // Show all chats where the user is involved
//             renderItem={renderChatItem}
//             keyExtractor={(item) => item._id}
//             style={styles.chatList}
//           />
//         </>
//       )}
//     </View>
//   );
// };

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

  useEffect(() => {
    const fetchData = async () => {
      const storedToken = await AsyncStorage.getItem('jwt');
      setToken(storedToken);

      try {
        // Fetching users
        const usersResponse = await fetch(`${baseURL}users`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Fetching chats
        const chatsResponse = await fetch(`${baseURL}chat/chats`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
        const chatsData = await chatsResponse.json();

        // Consolidate chats by user
        const consolidatedChats = consolidateChats(chatsData.chats || []);
        setChats(consolidatedChats);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const consolidateChats = (chatsList) => {
    const chatPairMap = new Map();
  
    chatsList.forEach((chat) => {
      if (!chat.sender || !chat.user) return;
  
      // Identify the other user and create a unique key for the conversation
      const otherUser =
        chat.sender._id === context.userId ? chat.user : chat.sender;
  
      if (!otherUser || !otherUser._id) return;
  
      // Create a unique key for the conversation, regardless of sender/receiver roles
      const chatPairKey = [context.userId, otherUser._id].sort().join('-');
  
      // If a conversation already exists, retain the most recent message
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
  
    // Convert map values to an array for rendering
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
        source={{ uri: item.image ? item.image : 'https://via.placeholder.com/50' }}
        style={styles.userAvatar}
      />
      <Text style={styles.userName}>{item.name}</Text>
    </TouchableOpacity>
  );

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleChatClick(item.chatId, item.otherUser._id)}
      style={styles.chatCard}
    >
      <Image
        source={{
          uri: item.otherUser.image ? item.otherUser.image : 'https://via.placeholder.com/50',
        }}
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
        <ActivityIndicator size="large" color="#0000ff" />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <>
          <FlatList
            data={users}
            renderItem={renderUserItem}
            keyExtractor={(item) => item._id}
            horizontal
            style={styles.userList}
            showsHorizontalScrollIndicator={false}
          />
          <FlatList
            data={chats}
            renderItem={renderChatItem}
            keyExtractor={(item) => item._id}
            style={styles.chatList}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  userList: {
    marginBottom: 5,
  },
  userCard: {
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 60,
    elevation: 10,
    justifyContent: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 25,
  },
  userName: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  chatList: {
    flex: 1,
    marginTop: 10,
  },
  chatCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
    alignItems: 'center',
  },
  chatAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatUser: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  chatMessage: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ChatScreen;

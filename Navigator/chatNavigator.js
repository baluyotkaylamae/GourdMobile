import { createStackNavigator } from '@react-navigation/stack';
import Gourdchat from '../screens/chat/Gourdchat';
import UserChatScreen from '../screens/chat/Chatbox';

const Stack = createStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="ChatScreen"
      options={{ headerShown: false }}
      component={Gourdchat} />
    <Stack.Screen name="UserChatScreen"
      options={({ route }) => ({
        title: route.params?.name || 'Chat', // Use the passed user's name or default to 'Chat'
      })}
      component={UserChatScreen} />
  </Stack.Navigator>
);
export default ChatNavigator;
import { createStackNavigator } from '@react-navigation/stack';
import Gourdchat from '../screens/chat/Gourdchat';
import UserChatScreen from '../screens/chat/Chatbox';

const Stack = createStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="ChatScreen" component={Gourdchat} />
    <Stack.Screen name="UserChatScreen" component={UserChatScreen} />
  </Stack.Navigator>
);
export default ChatNavigator;
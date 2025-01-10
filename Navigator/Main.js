import React, { useContext } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthGlobal from "../Context/Store/AuthGlobal";
import LoginScreen from "../screens/User/Login";
import RegisterScreen from "../screens/User/Register";
import UpdateCommentScreen from '../screens/Post/UpdateComment';
import UpdateReplyScreen from '../screens/Post/UpdateReplies';
import UpdatePostScreen from "../screens/Post/editPost";
import DrawerNavigator from './DrawerNavigator';

const Stack = createNativeStackNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);
  const isAuthenticated = context.stateUser && context.stateUser.isAuthenticated;

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={DrawerNavigator}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="UpdateComment" component={UpdateCommentScreen} />
          <Stack.Screen name="UpdateReply" component={UpdateReplyScreen} />
          <Stack.Screen name="UpdatePost" component={UpdatePostScreen} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ headerShown: false }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default Main;
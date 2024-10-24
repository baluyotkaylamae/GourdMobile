import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native'; // Importing Text for rendering strings
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../screens/HomeScreen";
import UserNavigator from "./UserNavigator";
import UserProfileScreen from "../screens/User/UserProfile";
import RegisterScreen from "../screens/User/Register";
import AuthGlobal from "../Context/Store/AuthGlobal";
import LoginScreen from "../screens/User/Login";
import CreatePost from '../screens/Post/createPost';
import AdminNavigator from "./AdminNavigator";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);
  const isAuthenticated = context.stateUser && context.stateUser.isAuthenticated;

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreatePost"
            component={CreatePost}
            options={{ title: 'Create Post' }} 
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  const context = useContext(AuthGlobal);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#664229",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={30} />,
        }}
      />
      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => <Icon name="user" color={color} size={30} />,
        }}
      />
      {/* Render Admin tab only if user is an admin */}
      {context.stateUser && context.stateUser.user && context.stateUser.user.isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon
                name="cog"
                style={{ position: "relative" }}
                color={color}
                size={30}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default Main;

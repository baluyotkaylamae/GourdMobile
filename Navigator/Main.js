import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native';
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../screens/HomeScreen";
import UserNavigator from "./UserNavigator";
import RegisterScreen from "../screens/User/Register";
import AuthGlobal from "../Context/Store/AuthGlobal";
import LoginScreen from "../screens/User/Login";
import CreatePost from '../screens/Post/createPost';
import AdminNavigator from "./AdminNavigator";
import InfoNavigator from "./InfoNavigator";
import UpdateCommentScreen from '../screens/Post/UpdateComment'
import UpdateReplyScreen from '../screens/Post/UpdateReplies'
import UpdatePostScreen from "../screens/Post/editPost";
import GourdIdentify from "../screens/GourdIdentify";
import Monitoring from "../screens/Monitoring";
import Gourdchat from "./chatNavigator";
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
          <Stack.Screen name="UpdateComment"
            component={UpdateCommentScreen} />
          <Stack.Screen name="UpdateReply"
            component={UpdateReplyScreen} />
          <Stack.Screen name="UpdatePost"
            component={UpdatePostScreen} />
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

const MainTabs = () => {
  const context = useContext(AuthGlobal);

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#4DA674", // Active icon color
        tabBarInactiveTintColor: "#6A6A6A", // Inactive icon color
        headerStyle: {
          backgroundColor: '#C3E8C9', // Header background color
        },
        headerTintColor: '#6A6A6A', // Header title and icons color
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Forum Page',
          backgroundColor: '#C3E8C9',
          tabBarIcon: ({ color }) => <Icon name="home" color={color} size={25} />,
        }}
      />

      <Tab.Screen
        name="Gourdconnect"
        component={Gourdchat}
        options={{
          title: 'Chat Room',
          tabBarIcon: ({ color }) => <Icon name="comment" color={color} size={25} />,
        }}
      />

      <Tab.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          title: 'Create Post',
          tabBarIcon: ({ color }) => <Icon name="plus" color={color} size={25} />, // Add icon for CreatePost
        }}
      />
      <Tab.Screen
        name="InfoZone"
        component={InfoNavigator}
        options={{
          title: 'Info Zone',
          tabBarIcon: ({ color }) => <Icon name="book" color={color} size={25} />, // Add icon for CreatePost
        }}
      />

      <Tab.Screen
        name="GourdIdentify"
        component={GourdIdentify}
        options={{
          title: 'Gourdtify',
          tabBarIcon: ({ color }) => <Icon name="camera" color={color} size={25} />,
        }}
      />

      <Tab.Screen
        name="Monitoring"
        component={Monitoring}
        options={{
          title: 'Gourd Monitoring',
          tabBarIcon: ({ color }) => <Icon name="bar-chart" color={color} size={25} />,
        }}
      />

      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          title: 'User Profile',
          tabBarIcon: ({ color }) => <Icon name="user" color={color} size={25} />,
        }}
      />

      {context.stateUser && context.stateUser.user && context.stateUser.user.isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            title: 'Admin Panel',
            tabBarIcon: ({ color }) => (
              <Icon
                name="cog"
                style={{ position: "relative" }}
                color={color}
                size={25}
              />
            ),
          }}
        />
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#C3E8C9",
    borderTopWidth: 0,
    elevation: 5,
    height: 70,
    paddingBottom: 10,
  },
});

export default Main;

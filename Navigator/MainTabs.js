import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import Gourdchat from './chatNavigator';
import CreatePost from '../screens/Post/createPost';
import InfoNavigator from './InfoNavigator';
import GourdIdentify from '../screens/GourdIdentify';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const MainTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#4DA674", // Active icon color
        tabBarInactiveTintColor: "#6A6A6A", // Inactive icon color
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Forum Page',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size || 25} />
          ),
        }}
      />
      <Tab.Screen
        name="Gourdconnect"
        component={Gourdchat}
        options={{
          title: 'Chat Room',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" color={color} size={size || 25} />
          ),
        }}
      />
      <Tab.Screen
        name="InfoZone"
        component={InfoNavigator}
        options={{
          title: 'Info Zone',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" color={color} size={size || 25} />
          ),
        }}
      />
      <Tab.Screen
        name="GourdIdentify"
        component={GourdIdentify}
        options={{
          title: 'Gourdtify',
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="camera-outline" color={color} size={size || 25} />
          ),
        }}
      />
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

export default MainTabs;
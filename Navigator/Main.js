import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from 'react-native'; 
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../screens/HomeScreen";
import UserNavigator from "./UserNavigator";
import UserProfileScreen from "../screens/User/UserProfile";
import RegisterScreen from "../screens/User/Register";
import AuthGlobal from "../Context/Store/AuthGlobal";
import LoginScreen from "../screens/User/Login";
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
        tabBarActiveTintColor: "#3baea0", 
        tabBarInactiveTintColor: "#a3a3a3", 
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


const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#ffffff",
    borderTopWidth: 0, 
    elevation: 5, 
    height: 70, 
    paddingBottom: 10, 
  },
});

export default Main;

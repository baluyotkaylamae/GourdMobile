import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../screens/HomeScreen";
import UserNavigator from "./UserNavigator";
// import AdminNavigator from "./AdminNavigator"; // Uncomment if you have AdminNavigator
import AuthGlobal from "../Context/Store/AuthGlobal";
import LoginScreen from "../screens/User/Login"; 

const Tab = createBottomTabNavigator();

const Main = () => {
  const context = useContext(AuthGlobal);

  // Check if the user is authenticated
  const isAuthenticated = context.stateUser && context.stateUser.isAuthenticated;

  return isAuthenticated ? (
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
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={30} />
          ),
        }}
      />

      {/* Uncomment if you have AdminNavigator */}
      {/* {context.stateUser && context.stateUser.user && context.stateUser.user.isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator}
          options={{
            tabBarIcon: ({ color }) => (
              <Icon name="cog" color={color} size={30} />
            ),
          }}
        />
      )} */}

      <Tab.Screen
        name="User"
        component={UserNavigator}
        options={{
          tabBarIcon: ({ color }) => (
            <Icon name="user" color={color} size={30} />
          ),
        }}
      />
    </Tab.Navigator>
  ) : (
    <LoginScreen /> 
  );
};

export default Main;

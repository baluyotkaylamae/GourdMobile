import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../screens/HomeScreen";
import UserNavigator from "./UserNavigator";
// import AdminNavigator from "./AdminNavigator"; // Uncomment if you have AdminNavigator
import AuthGlobal from "../Context/Store/AuthGlobal";

const Tab = createBottomTabNavigator();

const Main = () => {
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
          tabBarIcon: ({ color }) => (
            <Icon name="home" color={color} size={30} />
          ),
        }}
      />

      {/* {context.stateUser && context.stateUser.user && context.stateUser.user.isAdmin && (
        <Tab.Screen
          name="Admin"
          component={AdminNavigator} // Uncomment AdminNavigator if you have it
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
  );
};

export default Main;

import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/FontAwesome";
import HomeScreen from "../screens/HomeScreen";
import UserNavigator from "./UserNavigator";
// import AdminNavigator from "./AdminNavigator";
import AuthGlobal from "../Context/Apps/AuthGlobal";

const Tab = createBottomTabNavigator();

const Main = () => {
    const context = useContext(AuthGlobal);
    return (
        <Tab.Navigator
            initialRouteName="Homepage"
            screenOptions={{
                tabBarHideOnKeyboard: true,
                tabBarShowLabel: false,
                tabBarActiveTintColor: '#664229'
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ color }) => {
                        return <Icon
                            name="home"
                            style={{ position: "relative" }}
                            color={color}
                            size={30}
                        />
                    }
                }}
            />
            {/* <Tab.Screen
                name="Forum"
                component={ForumNavigator} // Use the ForumNavigator here
                options={{
                    tabBarIcon: ({ color }) => {
                        return (
                            <>
                                <Icon
                                    name="comments" 
                                    style={{ position: "relative" }}
                                    color={color}
                                    size={30}
                                />
                            </>
                        );
                    }
                }}
            /> */}
            {/* {context.stateUser.user.isAdmin && (
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
                        )
                    }}
                />
            )} */}

             <Tab.Screen
               name="User"
                component={UserNavigator}
               options={{
                tabBarIcon: ({ color }) => {
                  return <Icon
                            name="user"
                          style={{ position: "relative" }}
                            color={color}
                            size={30}

                        />
                    }
                }}
            />
        </Tab.Navigator>
    )
}
export default Main;
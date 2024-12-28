import React from "react";
import { createStackNavigator } from '@react-navigation/stack'

import Login from "../screens/User/Login";
import Register from "../screens/User/Register";
import UserProfile from "../screens/User/UserProfile";
import UserDetails from "../screens/User/UserDetails";
import UpdateProfile from '../screens/User/UpdateProfile'

const Stack = createStackNavigator();

const UserNavigator = (props) => {
    return (
        <Stack.Navigator>
            {/* <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    backgroundColor: "#C3E8C9",
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="Register"
                component={Register}
                options={{
                    headerShown: false,
                }}
            /> */}

            <Stack.Screen
                name="User Profile"
                component={UserProfile}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="User Details"
                component={UserDetails}
                options={{
                    headerShown: false
                }}
            />

            <Stack.Screen
                name="UpdateProfile"
                component={UpdateProfile}
                options={{
                    headerShown: false
                }}
            />

        </Stack.Navigator>
    )

}

export default UserNavigator;
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import AdminMenu from "../screens/Admin/AdminMenu"; // Ensure this path is correct
import Categories from "../screens/Admin/Categories/Categories";
import GourdType from "../screens/Admin/Monitoring/CreateGourdType";
import GourdVariety from "../screens/Admin/Monitoring/CreateGourdVariety";
import Dashboard from "../screens/Admin/Dashboard";
import Users from "../screens/Admin/UserManagement";
import PostManager from "../screens/Admin/PostManagements";

const Stack = createStackNavigator();

const AdminNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                presentation: "modal",
            }}
        >
            {/* Only Stack.Screen components should be direct children */}
            <Stack.Screen name="AdminMenu" component={AdminMenu} />
            <Stack.Screen name="Categories" component={Categories} />
            <Stack.Screen name="GourdType" component={GourdType} />
            <Stack.Screen name="GourdVarieties" component={GourdVariety} />
            {/* Uncomment and add the following as needed */}
            <Stack.Screen name="Users" component={Users} />
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="PostManagement" component={PostManager} />
        </Stack.Navigator>
    );
};

export default AdminNavigator;

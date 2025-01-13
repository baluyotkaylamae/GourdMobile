import React, { useContext } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons'; // Import an icon library
import MainTabs from './MainTabs';
import AdminNavigator from './AdminNavigator';
import UserNavigator from './UserNavigator';
import Monitoring from '../screens/Monitoring';
import PastMonitoring from '../screens/PastMonitoring';
import AuthGlobal from '../Context/Store/AuthGlobal';
import CustomDrawerContent from './CustomDrawerContent';
import CreatePost from '../screens/Post/createPost';
import Dashboard from '../screens/User/DashboardScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  const context = useContext(AuthGlobal);
  const isAdmin = context.stateUser && context.stateUser.user && context.stateUser.user.isAdmin;

  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabs}
        options={{
          headerTitle: 'Home',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      {isAdmin && (
        <Drawer.Screen
          name="Admin Panel"
          component={AdminNavigator}
          options={{
            headerTitle: 'Admin Panel',
            drawerIcon: ({ color, size }) => (
              <Ionicons name="settings-outline" size={size} color={color} />
            ),
          }}
        />
      )}
      <Drawer.Screen
        name="Profile"
        component={UserNavigator}
        options={{
          headerTitle: 'Profile',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          headerTitle: 'Dashboard',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Monitoring"
        component={Monitoring}
        options={{
          headerTitle: 'Monitoring',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="eye-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Harvest"
        component={PastMonitoring}
        options={{
          headerTitle: 'Harvest',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="CreatePost"
        component={CreatePost}
        options={{
          headerTitle: 'Create Post',
          drawerItemStyle: { display: 'none' },
          drawerIcon: ({ color, size }) => (
            <Ionicons name="create-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;

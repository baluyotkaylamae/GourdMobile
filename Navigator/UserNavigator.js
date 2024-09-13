import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import UserProfile from '../screens/UserProfile'; // Replace with your actual screen components

const Stack = createStackNavigator();

function UserNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile" component={UserProfile} options={{ headerShown: false }} />
      {/* Add more screens here */}
    </Stack.Navigator>
  );
}

export default UserNavigator;

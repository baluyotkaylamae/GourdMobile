import React from 'react';
import { createStackNavigator }from '@react-navigation/stack';
import ForumHome from '../screens/ForumHome'; // Replace with your actual screen components
import ForumPost from '../screens/ForumPost'; // Replace with your actual screen components

const Stack = createStackNavigator();

function ForumNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ForumHome" component={ForumHome} options={{ title: 'Forum Home' }} />
      <Stack.Screen name="ForumPost" component={ForumPost} options={{ title: 'Forum Post' }} />
    </Stack.Navigator>
  );
}

export default ForumNavigator;
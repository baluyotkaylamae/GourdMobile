import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Auth from "./Context/Apps/Auth";
import Main from './Navigator/Main'; // Adjust the path based on where you have your Main navigator

export default function App() {
  return (
    <Auth>
      <NavigationContainer>
      <Main />
    </NavigationContainer>
    </Auth>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

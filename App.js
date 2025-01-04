import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base'; // Import NativeBaseProvider
import Auth from "./Context/Apps/Auth";
import Main from './Navigator/Main'; // Adjust the path
import { socket } from './socket';
import { useEffect } from 'react';

export default function App() {
  useEffect(() => { // Add useEffect
    socket.connect(); // Connect the socket
  }, []); // Add empty dependency array
  return (
    <NativeBaseProvider>  
      <Auth>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </Auth>
    </NativeBaseProvider>
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

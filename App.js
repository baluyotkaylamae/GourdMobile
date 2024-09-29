
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Auth from "./Context/Apps/Auth";
import Main from './Navigator/Main'; // Adjust the path

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

import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import InputUser from "../../Shared/Form/InputUser";
import FormContainer from "../../Shared/Form/FormContainer";
import { useNavigation } from '@react-navigation/native';
import Error from '../../Shared/Error';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import { loginUser } from '../../Context/Actions/Auth.actions';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Header from "../../Shared/Header";
import WelcomeLogin from "../../Shared/WelcomeLogin";

// Import Google logo
import googleLogo from "../../assets/google.png"; // Adjust the path as necessary

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  WebBrowser.maybeCompleteAuthSession();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "YOUR_ANDROID_CLIENT_ID",
    iosClientId: "",
    webClientId: "YOUR_WEB_CLIENT_ID",
  });

  // Navigate to UserProfile after successful login
  useEffect(() => {
    if (context && context.stateUser && context.stateUser.isAuthenticated) {
      navigation.navigate("User Profile");  
    }
  }, [context.stateUser.isAuthenticated, navigation]);

  const handleSubmit = () => {
    const user = {
      email,
      password,
    };

    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else if (context && context.dispatch) {
      loginUser(user, context.dispatch);
    } else {
      console.error('Context or Dispatch is undefined');
    }
    console.log('na')
  };

  const handleGoogleSignIn = () => {
    if (request) {
      promptAsync();
    }
  };

  return (
    <FormContainer>
      <Header />
      <WelcomeLogin />
      <InputUser
        placeholder={"Email"}
        name={"email"}
        id={"email"}
        value={email}
        onChangeText={(text) => setEmail(text.toLowerCase())}
      />
      <InputUser
        placeholder={"Password"}
        name={"password"}
        id={"password"}
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {/* <TouchableOpacity onPress={() => navigation.navigate("ForgetPassword")}>
        <Text style={styles.forgetPassword}>Forget Your Password?</Text>
      </TouchableOpacity> */}
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <EasyButton
          login
          primary
          onPress={handleSubmit}
          style={styles.loginButton}
        >
          <Text style={{ color: "white", fontWeight: "bold", letterSpacing: 1 }}>Sign in</Text>
        </EasyButton>
      </View>
      <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
        <Text
          onPress={() => navigation.navigate("Register")}
          style={[styles.registerButton, { color: "black", fontWeight: "bold" }]}
        >
          Create New Account
        </Text>
      </View>
      <Text style={[styles.middleText, { color: "#664229", fontWeight: "bold" }]}>Continue with</Text>
      <View style={styles.container}>
        <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButtonContainer}>
          <Image source={googleLogo} style={styles.googleIcon} />
        </TouchableOpacity>
      </View>
    </FormContainer>
  );
};

const styles = StyleSheet.create({
  buttonGroup: {
    width: "80%",
    alignItems: "center",
  },
  middleText: {
    marginTop: 35,
    marginBottom: 20,
    alignSelf: "center",
    color: "#664229", // Darker color for contrast
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#3baea0", // Second color for the button
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 24,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  registerButton: {
    color: "#664229", // Color for register button
    fontWeight: "bold",
    marginVertical: 10,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  googleButtonContainer: {
    width: "20%",
    backgroundColor: "#E0F8E6", // Keeping the same color for Google sign-in button
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },
  googleIcon: {
    width: 24, // Adjust size as needed
    height: 24, // Adjust size as needed
  },
  forgetPassword: {
    color: "#118a7e", // Third color for text
    marginTop: 5,
    textAlign: "center",
  },
});

export default Login;

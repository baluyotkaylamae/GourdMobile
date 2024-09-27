import InputUser from "../../Shared/Form/InputUser";
import React, { useState, useContext, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import FormContainer from "../../Shared/Form/FormContainer";
import { useNavigation } from '@react-navigation/native';
import Error from '../../Shared/Error';
import AuthGlobal from '../../Context/Store/AuthGlobal';
import { loginUser } from '../../Context/Actions/Auth.actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EasyButton from "../../Shared/StyledComponents/EasyButton";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import Header from "../../Shared/Header";
import WelcomeLogin from "../../Shared/WelcomeLogin";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";

const Login = (props) => {
  const context = useContext(AuthGlobal);
  const navigation = useNavigation();

  // State for Google authentication
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [token, setToken] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  WebBrowser.maybeCompleteAuthSession();

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "271452028008-e7h9gm30q42bemt4umn54jhmb222ksq5.apps.googleusercontent.com",
    iosClientId: "",
    webClientId: "271452028008-44pgshqf63a08nq4l8okqo5pk2oho2mp.apps.googleusercontent.com",
  });

  useEffect(() => {
    const handleAuthResponse = async () => {
      const user = await getLocalUser();
      console.log("Local user:", user);
  
      if (response?.type === "success") {
        const { authentication } = response;
        console.log("Authentication response:", authentication);
  
        if (authentication?.accessToken) {
          const accessToken = authentication.accessToken;
          setToken(accessToken);
          await getUserInfo(accessToken);
        } else {
          console.log("No access token found in authentication response.");
        }
      } else {
        console.log("Authentication response not successful or user is already loaded.");
      }
    };
  
    handleAuthResponse();
  }, [response]);
  

  const getLocalUser = async () => {
    const data = await AsyncStorage.getItem("@user");
    return data ? JSON.parse(data) : null; // Return null if no data
  };

  const getUserInfo = async (token) => {
    if (!token) return; // If token is not provided, exit the function
    try {
      const response = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("User info response status:", response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }
  
      const user = await response.json();
      console.log("User info retrieved:", user);
      await AsyncStorage.setItem("@user", JSON.stringify(user));
      setUserInfo(user);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  

  useEffect(() => {
    if (context && context.stateUser?.isAuthenticated) {
      navigation.navigate("User", { screen: "User Profile" });
    }
  }, [context, context?.stateUser?.isAuthenticated]);

  const handleSubmit = async () => {
    const user = {
      email,
      password,
    };

    if (email === "" || password === "") {
      setError("Please fill in your credentials");
    } else {
      try {
        await loginUser(user, context.dispatch); // Await the loginUser function
        setError(''); // Clear any previous error message
      } catch (err) {
        setError(err.message || "Login failed. Please try again."); // Handle error
      }
    }
  };

  const handleGoogleSignIn = () => {
    if (request) {
      promptAsync();
    }
  };

  const handleForgetPassword = () => {
    navigation.navigate("ForgetPassword");
  };

  const handleCreateAccount = () => {
    navigation.navigate("Register");
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
      <TouchableOpacity onPress={handleForgetPassword}>
        <Text style={styles.forgetPassword}>Forget Your Password?</Text>
      </TouchableOpacity>
      <View style={styles.buttonGroup}>
        {error ? <Error message={error} /> : null}
        <EasyButton
          login
          primary
          onPress={handleSubmit}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Sign in</Text>
        </EasyButton>
      </View>
      <View style={[{ marginTop: 40 }, styles.buttonGroup]}>
        <Text
          onPress={handleCreateAccount}
          style={styles.registerButton}
        >
          Create new account
        </Text>
      </View>

      <Text style={styles.middleText}>Or continue with</Text>
      <View style={styles.container}>
        {!userInfo ? (
          <TouchableOpacity onPress={handleGoogleSignIn} style={styles.googleButtonContainer}>
            <FontAwesomeIcon name="google" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={styles.container}>
            {userInfo && (
              <View style={styles.card}>
                {userInfo.picture && (
                  <Image source={{ uri: userInfo.picture }} style={styles.image} />
                )}
                <Text style={styles.text}>Email: {userInfo.email || ''}</Text>
                <Text style={styles.text}>Verified: {userInfo.verified_email ? "yes" : "no"}</Text>
                <Text style={styles.text}>Name: {userInfo.name || ''}</Text>
              </View>
            )}
          </View>
        )}
      </View>
      <View style={styles.rectangle3}></View>
      <View style={styles.rectangle4}></View>
      <View style={styles.ellipse2}></View>
      <View style={styles.ellipse1}></View>
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
    color: "#664229",
    fontWeight: "bold",
  },
  loginButton: {
    backgroundColor: "#664229",
  },
  loginButtonText: {
    color: "white",
    fontWeight: "bold",
    letterSpacing: 1,
  },
  registerButton: {
    color: "black",
    fontWeight: "bold",
    letterSpacing: 0,
    marginTop: -15,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  card: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  googleButtonContainer: {
    width: "20%",
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: "center",
    marginTop: -30,
    justifyContent: "center",
    marginBottom: 30,
  },
  forgetPassword: {
    color: "#664229",
    marginTop: 5,
    marginLeft: 170,
  },
  rectangle3: {
    width: 372,
    height: 372,
    position: "absolute",
    transform: [{ rotate: "27.09deg" }],
    borderColor: "#F1F4FF",
    borderWidth: 2,
  },
  rectangle4: {
    width: 372,
    height: 372,
    position: "absolute",
    borderColor: "#F1F4FF",
    borderWidth: 2,
  },
  ellipse2: {
    width: 496,
    height: 496,
    position: "absolute",
    borderRadius: 9999,
    borderColor: "#F8F9FF",
    borderWidth: 3,
  },
  ellipse1: {
    width: 635,
    height: 635,
    position: "absolute",
    backgroundColor: "black",
    borderRadius: 9999,
  },
});

export default Login;

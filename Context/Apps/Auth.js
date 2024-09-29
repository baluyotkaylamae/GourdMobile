// Auth.js
import React, { useEffect, useReducer, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from "../Reducers/Auth.reducer";
import { setCurrentUser } from "../Actions/Auth.actions";
import AuthGlobal from '../Store/AuthGlobal'; // Correct path to AuthGlobal

const Auth = (props) => {
  const [stateUser, dispatch] = useReducer(authReducer, {
    isAuthenticated: null,
    user: {}
  });
  const [showChild, setShowChild] = useState(false);

  useEffect(() => {
    setShowChild(true);
    const loadUser = async () => {
      const token = await AsyncStorage.getItem('jwt');
      if (token) {
        const decoded = jwtDecode(token);
        dispatch(setCurrentUser(decoded));
      }
    };
    loadUser();
  }, []);

  if (!showChild) {
    return null;
  } else {
    return (
      <AuthGlobal.Provider value={{ stateUser, dispatch }}>
        {props.children}
      </AuthGlobal.Provider>
    );
  }
};

export default Auth;

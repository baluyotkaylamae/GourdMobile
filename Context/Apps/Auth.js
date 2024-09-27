import React, { useEffect, useReducer, useState } from "react";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from '@react-native-async-storage/async-storage';

import authReducer from "../Reducers/Auth.reducer";
import { setCurrentUser } from "../Actions/Auth.actions";
import AuthGlobal from './AuthGlobal';

const Auth = (props) => {
    const [stateUser, dispatch] = useReducer(authReducer, {
        isAuthenticated: null,
        user: {}
    });
    const [showChild, setShowChild] = useState(false);

    useEffect(() => {
        setShowChild(true);
        const loadUser = async () => {
            try {
                const token = await AsyncStorage.getItem('jwt');  // Fetch token
                if (token) {
                    const decoded = jwtDecode(token);  // Decode token if present
                    console.log("Decoded token:", decoded);  // Log the decoded token
                    dispatch(setCurrentUser(decoded));  // Dispatch user data
                } else {
                    console.log('No token found');
                }
            } catch (error) {
                console.error('Error fetching token:', error);  // Log any error
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

// TestAuth.js
import React, { useReducer, createContext } from "react";

const AuthGlobal = createContext();

const authReducer = (state, action) => {
    switch (action.type) {
        case "SET_CURRENT_USER":
            return {
                ...state,
                isAuthenticated: !!action.payload,
                user: action.payload,
            };
        default:
            return state;
    }
};

const AuthProvider = (props) => {
    const [stateUser, dispatch] = useReducer(authReducer, {
        isAuthenticated: null,
        user: {},
    });

    return (
        <AuthGlobal.Provider value={{ stateUser, dispatch }}>
            {props.children}
        </AuthGlobal.Provider>
    );
};

export { AuthGlobal, AuthProvider };

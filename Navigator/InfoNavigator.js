import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import InfoMenu from "../screens/Info/InfoMenu";
import Definition from "../screens/Info/Intro1/Definition"

const Stack = createStackNavigator();

const InfoNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
                presentation: "modal",
            }}
        >
            <Stack.Screen name="InfoMenu" component={InfoMenu} />
            <Stack.Screen name="Definition" component={Definition} />
           
        </Stack.Navigator>
    );
};

export default InfoNavigator;

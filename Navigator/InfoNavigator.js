import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import InfoMenu from "../screens/Info/InfoMenu";
import Definition from "../screens/Info/Intro1/Definition"
import ChaUses from "../screens/Info/Intro1/ChaUses"
import GourdWorld from "../screens/Info/History2/GourdWorld"
import GourdPhi from "../screens/Info/History2/GourdPhi"
import Anatomy from "../screens/Info/Botany3/Anatomy"
import LifeCycle from "../screens/Info/Botany3/LifeCycle"

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
            <Stack.Screen name="ChaUses" component={ChaUses} />
            <Stack.Screen name="GourdWorld" component={GourdWorld} />
            <Stack.Screen name="GourdPhi" component={GourdPhi} />
            <Stack.Screen name="Anatomy" component={Anatomy} />
            <Stack.Screen name="LifeCycle" component={LifeCycle} />
           
        </Stack.Navigator>
    );
};

export default InfoNavigator;

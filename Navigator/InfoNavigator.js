import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import InfoMenu from "../screens/Info/InfoMenu";
import Definition from "../screens/Info/Intro1/Definition"
import ChaUses from "../screens/Info/Intro1/ChaUses"
import GourdWorld from "../screens/Info/History2/GourdWorld"
import GourdPhi from "../screens/Info/History2/GourdPhi"
import Anatomy from "../screens/Info/Botany3/Anatomy"
import LifeCycle from "../screens/Info/Botany3/LifeCycle"
import MaleFemaleFlowers from "../screens/Info/Gender/MaleFemale"
import ImportanceFlowers from "../screens/Info/Gender/ImportanceofPollination"
import PollinationProcess from "../screens/Info/Gender/PollinationProcs"
import PollinationChallenges from "../screens/Info/Gender/Challenges";
import BitterGourd from "../screens/Info/Types/BitterGourd";
import SpongeGourd from "../screens/Info/Types/SpongeGourd";
import BottleGourd from "../screens/Info/Types/SpongeGourd";
import WaxGourd from "../screens/Info/Types/WaxGourd";
import NutritionalProfile from "../screens/Info/HealthBenefits/NutriProfile";
import MedicinalUses from "../screens/Info/HealthBenefits/MedicinalUses";
import Pests from "../screens/Info/CommonIssues/CommonPests";
import Diseases from "../screens/Info/CommonIssues/CommonDiseases";
import PreventiveMeasures from "../screens/Info/CommonIssues/PreventiveMeasures";
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
            <Stack.Screen name="MaleFemaleFlowers" component={MaleFemaleFlowers} />
            <Stack.Screen name="ImportanceFlowers" component={ImportanceFlowers} />
            <Stack.Screen name="PollinationProcess" component={PollinationProcess} />
            <Stack.Screen name="PollinationChallenges" component={PollinationChallenges} />
            <Stack.Screen name="BitterGourd" component={BitterGourd}/>
            <Stack.Screen name="SpongeGourd" component={SpongeGourd}/>
            <Stack.Screen name="BottleGourd" component={BottleGourd}/>
            <Stack.Screen name="WaxGourd" component={WaxGourd}/>
            <Stack.Screen name="NutritionalProfile" component={NutritionalProfile}/>
            <Stack.Screen name="MedicinalUses" component={MedicinalUses}/>
            <Stack.Screen name="Pests" component={Pests}/>
            <Stack.Screen name="Diseases" component={Diseases}/>
            <Stack.Screen name="PreventiveMeasures" component={PreventiveMeasures}/>
        </Stack.Navigator>
    );
};

export default InfoNavigator;

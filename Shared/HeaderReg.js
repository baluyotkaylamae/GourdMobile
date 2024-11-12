import React from "react"
import { StyleSheet, Image, SafeAreaView, View } from "react-native"

const HeaderReg = () => {
    return (
        //<View style={styles.header}>
        <SafeAreaView style={styles.header}>
            <Image
                source={require("../assets/logo2.png")}
                resizeMode="contain"
                style={{ height: 140 }}
            />
        </SafeAreaView>
        //</View>
    )
}

const styles = StyleSheet.create({
    header: {
        width: "100%",
        flexDirection: 'row',
        alignContent: "center",
        justifyContent: "center",
        padding: 30,
        marginTop: 30,
        marginBottom: -10,
    }
})

export default HeaderReg


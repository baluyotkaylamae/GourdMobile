import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const RegGreeting = () => {
    return (
        <View style={styles.greetingContainer}>
            <Text>
                <Text style={[styles.createText, { marginLeft: 10 }]}>Create an account to explore our</Text>
                {'\n'}
                <Text style={styles.gourdtext}>GOURDTIFY APP</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    greetingContainer: {
        alignItems: 'left',
        paddingVertical: 0,
        marginTop: -5,
        marginLeft: 20,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    createText: {
        color: '#000000',
        fontSize: 18,
        fontWeight: 'normal',
        marginLeft: 20,
    },
    gourdtext: {
        color: '#3baea0',
        fontSize: 17,
        fontWeight: 'bold',
    },
});

export default RegGreeting;


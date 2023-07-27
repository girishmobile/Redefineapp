import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

import { COLORS } from '../constant';

const Card = ({ children }) => {
    return (
        <View style={styles.card}>
            {children}
        </View>
    )
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.primary,
        margin: 25,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        padding: 25,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
})
export default Card
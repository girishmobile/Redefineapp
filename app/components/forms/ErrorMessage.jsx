import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import AppText from '../global/AppText'
const ErrorMessage = ({ error, visible }) => {
    if (!visible || !error) return null;
    return (
        <AppText style={styles.error} >{error}</AppText>
    )
}
const styles = StyleSheet.create({
    error: {
        color: 'red',
        alignSelf: 'flex-start',
        fontSize: 12,
    }
})
export default ErrorMessage
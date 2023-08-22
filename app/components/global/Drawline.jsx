import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../constant'

const Drawline = () => {
    return (
        <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.borderColor }}></View>
    )
}

export default Drawline

const styles = StyleSheet.create({})
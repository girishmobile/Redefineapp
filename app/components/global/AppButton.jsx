import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../constant'
import Font from '../../config/CustomFont'

const AppButton = ({ title, onPress, disabled }) => {
    return (
        <TouchableOpacity style={styles.buttonStyle(disabled)} onPress={onPress} disabled={disabled}>
            <Text style={styles.textStyle}>{title}</Text>
        </TouchableOpacity>
    )
}
const styles = StyleSheet.create({
    buttonStyle: (disabled) => ({
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.base,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 12,
        marginTop: SIZES.base * 2,
        opacity: disabled ? 0.5 : 1,
    }),
    textStyle: {
        color: COLORS.primary,
        fontSize: 15,
        textTransform: 'uppercase',
        fontFamily: Font.RalewayBold
    }
})
export default AppButton
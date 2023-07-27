import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon, { Icons } from '../Icons'
import { COLORS } from '../../constant'
import Font from '../../config/CustomFont'

const CheckBoxItem = ({ isselected, title, onPress }) => {
    return (
        <View style={{ marginLeft: 10, marginRight: 10, }}>
            <TouchableOpacity style={styles.checkboxWrapper} onPress={onPress}>
                <Icon type={Icons.Ionicons} name={isselected ? 'ios-checkbox' : 'ios-square-outline'} size={20} color={isselected ? 'rgba(99,102, 241, 1)' : COLORS.lightGrey} />
                <Text style={[styles.titleText, { marginLeft: 5, flex: 1 }]}>{title}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CheckBoxItem

const styles = StyleSheet.create({

    titleText: {
        fontSize: 13,
        fontFamily: Font.RalewayRegular,
        textAlign: 'left',
        letterSpacing: 1.2,
        opacity: 0.7
    },
    checkboxWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    }

})
import { View, Text, StyleSheet, TextInput } from 'react-native'
import React from 'react'
import { COLORS, SIZES } from '../../constant';
import Icon from 'react-native-vector-icons/Ionicons';
import Font from '../../config/CustomFont';

const AppTextInput = ({ icon, name, ...otherProps }) => {

    return (
        <View style={styles.container}>
            {icon && <Icon name={icon} size={24} color={COLORS.lightText} style={styles.icon} />}
            <TextInput
                style={styles.text} {...otherProps}
                placeholderTextColor={COLORS.lightText}
            />
        </View>
    )
};
export default AppTextInput
const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.base,
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: COLORS.bgColor,
        padding: 10,
        width: '100%',
        marginVertical: 5,
    },
    icon: {
        marginRight: 7,
    },
    text: {
        color: COLORS.titleColor,
        fontSize: 15,
        opacity: 0.7,
        flex: 1,
        fontFamily: Font.RalewayRegular,
        letterSpacing: 1.2,
        paddingVertical: 0 // for Android avoid extra spacing
    }
})

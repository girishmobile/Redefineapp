import { Text } from 'react-native'
import React from 'react'
import defaltStyle from '../../config/styles';

const AppText = ({ children, style }) => {
    return (
        <Text style={[defaltStyle.text, style]}>{children}</Text>
    )
}
export default AppText
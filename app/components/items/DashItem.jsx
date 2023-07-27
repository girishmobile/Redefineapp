import { Text, View, TouchableOpacity, } from 'react-native'
import React from 'react'
import { COLORS } from '../../constant'
import Icon, { Icons } from '../Icons';
import GlobalStyle from '../../styles/GlobalStyle';

const DashItem = ({ item, index }) => {

    const indexRow = index + 1;
    return (
        <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={[GlobalStyle.boardItem, { marginLeft: indexRow % 2 === 0 ? 20 : 0 }]}>
            <View style={{ width: '90%', margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Icon style={{ marginTop: 20 }} type={item.type} name={item.icon} size={36} color={COLORS.lightText} />
                <Text style={GlobalStyle.titleText}>{item.label}</Text>
                <Text style={GlobalStyle.lightText}>Lorem Ipsum is simply dummy text. 1234</Text>
            </View>
        </TouchableOpacity>
    )
}
export default DashItem;

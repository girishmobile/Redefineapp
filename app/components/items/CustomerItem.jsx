import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../constant';
import Icon, { Icons } from '../Icons';
import GlobalStyle from '../../styles/GlobalStyle';

const CustomerItem = ({ item, index, onPress }) => {
    const indexRow = index + 1;
    const type = item[item['type']];
    const custType = type['name'];
    const count = type['count'];
    let iconName = "";
    switch (item['type']) {
        case "activeCustomer":
            iconName = "account-multiple-check-outline";
            break;
        case "inActiveCustomer":
            iconName = "account-multiple-remove-outline";
            break;
        case "totalCustomer":
            iconName = "account-group-outline";
            break;
        case "registeredCustomer":
            iconName = "account-key-outline";
            break;
        case "unRegisteredCustomer":
            iconName = "account-multiple-minus-outline";
            break;
        default:
            break;
    }
    return (
        <TouchableOpacity
            key={index}
            activeOpacity={0.8}
            style={[GlobalStyle.boardItem, { marginLeft: indexRow % 2 === 0 ? 10 : 0 }]}
            onPress={onPress}>
            <View style={{ width: '90%', margin: 10, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name={iconName} type={Icons.MaterialCommunityIcons} size={36} color={COLORS.lightText} style={{ opacity: 0.8 }} />
                <Text style={GlobalStyle.titleText}>{custType}</Text>
                <Text style={GlobalStyle.lightText}>({count})</Text>
            </View>

        </TouchableOpacity>
    )
}

export default CustomerItem

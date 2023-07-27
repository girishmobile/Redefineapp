import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../../constant';
import Icon, { Icons } from '../Icons';

const SPACING = 10;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const CustItem = ({ item, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={[styles.row,]}>
                <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={styles.nameText}>{`Name:- ${item.name}`}</Text>
                        <Text style={[styles.storeText, { color: COLORS.titleColor }]}>{`Store:- ${item.storeName}`}</Text>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between' }}>
                            <Text style={[styles.storeText,]}>{`Order:- ${item.orders}`}</Text>
                            <Text style={[styles.storeText, { marginBottom: 0 },]}>{`Revenue:- ${item.revenue}`}</Text>
                        </View>
                    </View>
                    <View>
                        <Icon name={'ios-chevron-forward-outline'} type={Icons.Ionicons} size={24} color={COLORS.lightText} />
                    </View>

                </View>
            </View>
        </TouchableOpacity>
    )
}

export default CustItem

const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        padding: SPACING,
        marginBottom: SPACING,
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    storeText: {
        fontSize: 14,
        opacity: 0.8,
        color: COLORS.titleColor,
        letterSpacing: 1.1,
        marginBottom: 5
        // textTransform: 'lowercase'
    },
    nameText: {
        color: COLORS.titleColor,
        fontWeight: '600',
        opacity: 0.8,
        letterSpacing: 1.2,
        fontSize: 14,
        marginBottom: 5,
        textTransform: 'capitalize'
    },

});

/**
 *  <Image
                source={{ uri: item.image }}
                style={{
                    width: AVATAR_SIZE, height: AVATAR_SIZE, borderRadius: AVATAR_SIZE,
                    marginRight: SPACING
                }} />
 */
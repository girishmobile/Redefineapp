import { StyleSheet, Text, View, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { COLORS, IMGS } from '../../constant';
import Icon, { Icons } from '../Icons';
import FastImageView from '../global/FastImageView';
import FastImage from 'react-native-fast-image';
import FastImageLogo from '../global/FastImageLogo';
import Font from '../../config/CustomFont';
import GlobalStyle from '../../styles/GlobalStyle';
import moment from 'moment';

const SPACING = 10;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const CustItem = ({ item, onPress }) => {


    const email = item['email'].toLowerCase();
    const custId = item['id'];

    let custName = ''
    if (item['name'].trim() != "") {

        custName = item['name'];
    }
    else {
        custName = "Guest customer"
    }

    const getCreatedDate = (createdDate) => {
        if (createdDate != null && createdDate.trim() != "") {
            return moment(createdDate).format('MM/DD/YYYY hh:mm A');
        }
        else {
            return ''
        }
    }
    return (
        <TouchableOpacity activeOpacity={0.5} onPress={onPress}>
            <View style={[styles.row,]}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={[styles.nameText, { flex: 1, marginRight: 5 }]}>{`${custName}`}</Text>
                        <Text style={styles.orderText}>{`Orders:- ${item['orders']}`}</Text>

                    </View>
                    <Text style={[GlobalStyle.lightText, { textAlign: 'left', marginBottom: 5 }]}>{`${email}`}</Text>
                    <Text style={[GlobalStyle.lightText, { textAlign: 'left', marginBottom: 5 }]}>{`CustId: - ${custId}`}</Text>
                    {
                        item['createdDate'] && <View style={{ flexDirection: 'row' }}>
                            <Text style={[GlobalStyle.lightText, { textAlign: 'left', marginBottom: 5 }]}>{'Creadted:- '}</Text>
                            <Text style={[GlobalStyle.lightText, { fontSize: 12, textAlign: 'left', marginBottom: 5 }]}>{`${getCreatedDate(item['createdDate'])}`}</Text>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <View style={{ flex: 1, marginRight: 5, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[GlobalStyle.lightText, { textAlign: 'left', marginRight: 10 }]}>{'Registr ed'}</Text>
                            {
                                item['isRegistered'] && item['isRegistered'] === 1 ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', }}>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 12, fontFamily: Font.RalewaySemiBold, opacity: 0.7, marginRight: 5 }]}>Yes</Text>
                                    <Icon type={Icons.MaterialIcons} name={'radio-button-on'} size={18} color={COLORS.green} style={{ opacity: 0.7 }} />

                                </View> : <View style={{ flexDirection: 'row' }}>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 12, fontFamily: Font.RalewaySemiBold, opacity: 0.7, marginRight: 5 }]}>No</Text>
                                    <Icon type={Icons.MaterialIcons} name={'radio-button-on'} size={18} color={COLORS.officialRed} style={{ opacity: 0.7 }} />

                                </View>
                            }
                        </View>
                        <View style={[GlobalStyle.recStatus(item['recStatus']), { width: '30%', margin: 0 }]}>
                            <Text style={GlobalStyle.recStatusText(item['recStatus'])}>{item['recStatus'] === 'A' ? 'Active' : item['recStatus'] === 'I' ? 'Inactive' : 'Draft'}</Text>
                        </View>

                    </View>
                </View>

                <View style={{}}>
                    <Icon name={'chevron-forward-outline'} type={Icons.Ionicons} size={16} color={COLORS.lightText} />
                </View>
            </View>

        </TouchableOpacity>
    )
}

export default CustItem

const styles = StyleSheet.create({

    row: {
        flexDirection: 'row',
        alignItems: 'center',
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
        letterSpacing: 1.2,
        marginBottom: 5
        // textTransform: 'lowercase'
    },
    nameText: {
        color: COLORS.titleColor,
        opacity: 0.8,
        letterSpacing: 1.2,
        fontSize: 15,
        marginBottom: 5,
        fontFamily: Font.RalewayBold,
        textTransform: 'capitalize',
        flex: 1,
    },
    orderText: {

        opacity: 0.8,
        letterSpacing: 1.2,
        marginBottom: 5,
        fontSize: 13,
        fontFamily: Font.RalewayBold,
        color: COLORS.officialRed,
        textAlign: 'right',
        marginBottom: 5,
    },
    imagelogo: {
        width: '100%',
        height: undefined,
        backgroundColor: COLORS.textBgcolor,
        aspectRatio: 1,
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
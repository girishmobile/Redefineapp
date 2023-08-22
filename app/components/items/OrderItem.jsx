import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS, IMGS } from '../../constant';
import Icon, { Icons } from '../Icons';
import FastImage from 'react-native-fast-image';
import Font from '../../config/CustomFont';
import GlobalStyle from '../../styles/GlobalStyle';
import order from '../../api/order';

import moment from 'moment';


const SPACING = 10;
const AVATAR_SIZE = 70;
const ITEM_SIZE = AVATAR_SIZE + SPACING * 3;

const OrderItem = ({ item, index, onPress }) => {

    let imgUrl = '';
    let orderStatus = '';
    if (item['orderStatus'] != null) {
        orderStatus = item['orderStatus'];
        orderStatus = orderStatus.toLowerCase();
    }
    if (item['storeLogoUrl'] != null) {
        imgUrl = item['storeLogoUrl'];
        const fchar = imgUrl.substring(0, 1);
        if (fchar === '/') {
            imgUrl = imgUrl.replace(fchar, '');
        }
    }
    const getOrderDate = (orderDate) => {

        if (orderDate != null || orderDate !== '') {

            return moment(orderDate).format('MM/DD/YYYY');
        }
        else {
            return ''
        }
    }
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onPress}>
            <View style={styles.row}>
                <View style={{ alignSelf: 'center', flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1, }}>
                        <Text style={[styles.nameText, { flex: 1, fontSize: 15 }]}>{`${item['customerName']}`}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6, justifyContent: 'space-between' }}>
                            <Text style={[styles.nameText, { opacity: 0.7 }]}>{`Order:-  #${item['orderNumber']}`}</Text>
                            <Text style={[GlobalStyle.lightText, { fontSize: 12 }]}>{getOrderDate(item['orderDate'])}</Text>
                        </View>
                        <Text style={[styles.nameText, { opacity: 0.7 }]}>{`Total:-  $${item['orderTotal']}`}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 6, justifyContent: 'space-between' }}>
                            <View>
                                <Text style={[GlobalStyle.subtitleText, { fontSize: 12, textAlign: 'right', color: 'rgba(94, 162, 81,1)', opacity: 1.0, textTransform: 'uppercase' }]} >{`${item['paymentStatus']}`}</Text>
                            </View>
                            <View style={styles.orderStatus(orderStatus)}>
                                <Text style={styles.statusText(orderStatus)}>{orderStatus}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginLeft: 5 }}>
                        <Icon name={'chevron-forward-outline'} type={Icons.Ionicons} size={16} color={COLORS.lightText} />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

export default OrderItem

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
    emailText: {
        fontSize: 13,
        opacity: 0.7,
        color: COLORS.secondary,
        textTransform: 'lowercase'
    },
    storeText: {
        fontSize: 14,
        opacity: 0.8,
        color: COLORS.titleColor,
        letterSpacing: 1.1,
        marginBottom: 7
        // textTransform: 'lowercase'
    },
    nameText: {
        color: COLORS.titleColor,
        opacity: 0.8,
        fontFamily: Font.RalewayBold,
        letterSpacing: 1.2,
        fontSize: 15,
        textTransform: 'capitalize',

    },
    statusText: (status) => (
        {
            fontSize: 11,
            opacity: 0.8,
            color: COLORS.titleColor,
            letterSpacing: 1.1,
            fontFamily: Font.RalewaySemiBold,
            textTransform: 'uppercase',
            color: status === 'new' ? 'rgba(2, 132,199,1)' : status === 'pending' ? 'rgba(202,138,4,1)' : status === 'shipped' ? 'rgba(22, 163, 74,1)' : status === 'cancelled' ? 'rgba(198,36 ,40,1)' : 'rgba(87, 82, 80, 1)',

        }
    ),
    orderStatus: (status) => ({

        backgroundColor: status === 'new' ? 'rgba(224, 242,254,1)' : status === 'pending' ? 'rgba(254,249,195,1)' : status === 'shipped' ? 'rgba(220, 252, 231,1)' : status === 'cancelled' ? 'rgba(241, 169, 171, 1)' : 'rgba(241, 245, 249,1)',
        // padding: 5,
        paddingBottom: 5,
        paddingTop: 5,
        paddingRight: 15,
        paddingLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 0.6,
        borderColor: status === 'new' ? 'rgba(125, 211,252,1)' : status === 'pending' ? 'rgba(253,224,71,1)' : status === 'shipped' ? 'rgba(134,239 , 172,1)' : status === 'cancelled' ? 'rgba(228, 83, 122, 1)' : 'rgba(210, 220, 230, 1)',
    })

})
/**
 *  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <FastImage
                            style={{ width: 100, height: 45, }}
                            source={{ uri: `${IMGS.baseUrl}${imgUrl}`, priority: FastImage.priority.normal }}
                            resizeMode='contain'
                        />
                        <Text style={[styles.storeText, { alignSelf: 'center', marginBottom: 0, }]}>{`${item['storeName']}`}</Text>
                    </View>
 */
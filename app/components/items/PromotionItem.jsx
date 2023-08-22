import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../constant';
import Icon, { Icons } from '../Icons';
import Font from '../../config/CustomFont';
import GlobalStyle from '../../styles/GlobalStyle';
import moment from 'moment';
const SPACING = 10;

const PromotionItem = ({ item, onPress }) => {
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
            <View style={styles.row}>
                <View style={{ flex: 1 }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                        <Text style={[styles.storeText, { fontSize: 13, }]}>{`CODE:- `}</Text>
                        <Text style={[styles.nameText, { flex: 1, marginRight: 5 }]}>{`${item['discountCode']}`}</Text>
                        <Text style={styles.usedText}>{`USED:- ${item['couponUsedCount']}`}</Text>
                    </View>
                    {
                        item['createdName'] && <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.storeText, { fontSize: 13, }]}>{'CREATED BY:- '}</Text>
                            <Text style={[styles.storeText]}>{`${(item['createdName'])}`}</Text>
                        </View>
                    }
                    {
                        item['createdDate'] && <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                            <Text style={[GlobalStyle.lightText, { fontSize: 12, textAlign: 'left', }]}>{'CREATED DATE:- '}</Text>
                            <Text style={[GlobalStyle.lightText, { fontSize: 12, textAlign: 'left', }]}>{`${getCreatedDate(item['createdDate'])}`}</Text>
                        </View>
                    }
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={[styles.storeText, { fontSize: 13, }]}>{'PROMOTIONS STATUS:- '}</Text>
                        <View style={[styles.promotionStatus(item['status']), {}]}>
                            <Text style={styles.statusText(item['status'])}>{item['status'] === 'A' ? 'Active' : item['status'] === 'E' ? 'Expired' : item['status'] === 'S' ? 'Scheduled' : 'Draft'}</Text>
                        </View>
                    </View>

                </View>
                <View style={{}}>
                    <Icon name={'chevron-forward-outline'} type={Icons.Ionicons} size={16} color={COLORS.lightText} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default PromotionItem

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
    nameText: {
        color: COLORS.titleColor,
        opacity: 0.9,
        letterSpacing: 1.2,
        fontSize: 15,
        marginBottom: 5,
        fontFamily: Font.RalewaySemiBold,
        textTransform: 'capitalize',
        flex: 1,
    },
    usedText: {

        opacity: 0.8,
        letterSpacing: 1.2,
        marginBottom: 5,
        fontSize: 13,
        fontFamily: Font.RalewaySemiBold,
        color: COLORS.green,
        textAlign: 'right',
        marginBottom: 5,
    },
    storeText: {
        fontSize: 14,
        opacity: 0.8,
        color: COLORS.titleColor,
        letterSpacing: 1.2,
        marginBottom: 5,
        fontFamily: Font.RalewaySemiBold,
        // textTransform: 'lowercase'
    },
    statusText: (status) => (
        {
            fontSize: 12,
            opacity: 0.9,
            fontFamily: Font.RalewaySemiBold,
            color: COLORS.titleColor,
            letterSpacing: 1.1,
            textTransform: 'capitalize',
            color: status === 'E' ? 'rgba(2, 132,199,1)' : status === 'S' ? 'rgba(202,138,4,1)' : status === 'A' ? 'rgba(22, 163, 74,1)' : status === 'I' ? 'rgba(198,36 ,40,1)' : 'rgba(87, 82, 80, 1)',
        }
    ),
    promotionStatus: (status) => ({

        backgroundColor: status === 'E' ? 'rgba(224, 242,254,1)' : status === 'S' ? 'rgba(254,249,195,1)' : status === 'A' ? 'rgba(220, 252, 231,1)' : status === 'I' ? 'rgba(241, 169, 171, 1)' : 'rgba(241, 245, 249,1)',
        // padding: 5,
        paddingBottom: 5,
        paddingTop: 5,
        paddingRight: 15,
        paddingLeft: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 0.6,
        borderColor: status === 'E' ? 'rgba(125, 211,252,1)' : status === 'S' ? 'rgba(253,224,71,1)' : status === 'A' ? 'rgba(134,239 , 172,1)' : status === 'I' ? 'rgba(228, 83, 122, 1)' : 'rgba(210, 220, 230, 1)',
    })
})
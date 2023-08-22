import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { Appscreen } from '../components/global'
import GlobalStyle from '../styles/GlobalStyle'
import { COLORS } from '../constant'
import Font from '../config/CustomFont'
import Drawline from '../components/global/Drawline'
import moment from 'moment';

const PromotionDetail = ({ route }) => {

    const { item } = route.params;
    useEffect(() => {
    }, []);
    const getCreatedDate = (createdDate) => {
        if (createdDate != null && createdDate.trim() != "") {
            return moment(createdDate).format('MM/DD/YYYY hh:mm A');
        }
        else {
            return ''
        }
    }
    const getCreatedTime = (createdDate) => {
        if (createdDate != null && createdDate.trim() != "") {
            return moment(createdDate).format('hh:mm A');
        }
        else {
            return ''
        }
    }
    return (
        <>
            <Appscreen>
                <View style={styles.container}>
                    <ScrollView>
                        <View style={[GlobalStyle.card, { margin: 10, }]}>
                            <Text style={[styles.titleText,]}>{`CODE:- ${item['discountCode']}`}</Text>
                            <Drawline />
                            {
                                item['name'] && <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <Text style={[styles.titleText, { opacity: 0.7, fontSize: 15 }]}>{`Name:- ${(item['name'])}`}</Text>
                                </View>
                            }
                            {
                                item['createdName'] && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.subText, {}]}>{'Created By:- '}</Text>
                                    <Text style={[styles.subText, { flex: 1 }]}>{`${(item['createdName'])}`}</Text>
                                </View>
                            }
                            {
                                item['storeName'] && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.subText, { opacity: 0.7 }]}>{'Store:- '}</Text>
                                    <Text style={[styles.subText, { flex: 1, opacity: 0.7 }]}>{`${(item['storeName'])}`}</Text>
                                </View>
                            }
                            {
                                item['createdDate'] && <View style={{ flexDirection: 'row', marginBottom: 4, width: '100%', }}>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 13, textAlign: 'left', }]}>{'Created Date:- '}</Text>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 13, textAlign: 'left', }]}>{`${getCreatedDate(item['createdDate'])}`}</Text>
                                </View>
                            }
                            {
                                item['startdate'] && <View style={{ flexDirection: 'row', marginBottom: 4, width: '100%', }}>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 13, textAlign: 'left', }]}>{'Start Date & Time:- '}</Text>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 13, textAlign: 'left', }]}>{`${getCreatedDate(item['startdate'])}`}</Text>
                                </View>
                            }
                            {
                                item['enddate'] && <View style={{ flexDirection: 'row', marginBottom: 4, width: '100%', }}>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 13, textAlign: 'left', }]}>{'End Date & Time:- '}</Text>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 13, textAlign: 'left', }]}>{`${getCreatedDate(item['enddate'])}`}</Text>
                                </View>
                            }
                            {
                                item['modifiedName'] && <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={[styles.subText, {}]}>{'Modified By:- '}</Text>
                                    <Text style={[styles.subText, { flex: 1 }]}>{`${(item['modifiedName'])}`}</Text>
                                </View>
                            }
                            {
                                item['modifiedDate'] && <View style={{ flexDirection: 'row', marginBottom: 4, width: '100%', }}>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 13, textAlign: 'left', }]}>{'Modified Date:- '}</Text>
                                    <Text style={[GlobalStyle.lightText, { fontSize: 13, textAlign: 'left', }]}>{`${getCreatedDate(item['modifiedDate'])}`}</Text>
                                </View>
                            }
                            <View style={{ flexDirection: 'row', width: '100%', marginTop: 5 }}>
                                <Text style={[styles.subText, { marginBottom: 0, alignSelf: 'center' }]}>{'PROMOTIONS STATUS:- '}</Text>
                                <View style={[styles.promotionStatus(item['status']), {}]}>
                                    <Text style={styles.statusText(item['status'])}>{item['status'] === 'A' ? 'Active' : item['status'] === 'E' ? 'Expired' : item['status'] === 'S' ? 'Scheduled' : 'Draft'}</Text>
                                </View>
                            </View>
                            {
                                item['recStatus'] && <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
                                    <Text style={[styles.subText, {}]}>{'STATUS:- '}</Text>
                                    <Text style={[styles.subText, { flex: 1 }]}>{item['recStatus'] === 'A' ? 'Active' : item['recStatus'] === 'I' ? 'Inactive' : 'Draft'}</Text>
                                </View>
                            }
                        </View>
                    </ScrollView>
                </View>
            </Appscreen>
        </>
    )
}

export default PromotionDetail

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 16,
        opacity: 0.9,
        letterSpacing: 1.2,
        color: COLORS.titleColor,
        fontFamily: Font.RalewayBold,
        flex: 1,
        marginVertical: 10,
    },
    subText: {
        fontSize: 13,
        opacity: 0.8,
        color: COLORS.titleColor,
        letterSpacing: 1.2,
        marginBottom: 5,
        fontFamily: Font.RalewayBold,
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
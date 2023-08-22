import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appscreen, Loader } from '../components/global'

import useApi from '../hooks/useApi';
import customersApi from '../api/customers';
import storage from '../auth/storage';
import { COLORS } from '../constant';
import GlobalStyle from '../styles/GlobalStyle';
import Font from '../config/CustomFont';
import Icon, { Icons } from '../components/Icons';
import Drawline from '../components/global/Drawline';

const CustomerDetails = ({ route }) => {

    const { customerId } = route.params;
    const [isLoader, setIsLoader] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [billingAdd, setIsBillingAdd] = useState([]);
    const [shippingAdd, setIsShippingAdd] = useState([]);
    const getDetail = useApi(customersApi.getCustomerDetails);

    const loadCustomerdetail = async () => {
        setIsLoader(true);
        const header = { 'header': true, }
        await storage.mergeUserdata(header, async (added) => {
            const response = await getDetail.request(customerId);
            if (response != null) {
                const mydata = response['data'];
                setCustomer(mydata['data']);
                if (mydata['data'] != null) {
                    const tempAdd = mydata['data'];
                    console.log('isSuperuser:- ', tempAdd['isSuperuser']);
                    if (tempAdd != null) {
                        const add = tempAdd['customerAddress'];
                        const BAddress = add.filter(item => item['addressType'] === 'B');
                        const SAddress = add.filter(item => item['addressType'] === 'S');
                        setIsBillingAdd(BAddress);
                        setIsShippingAdd(SAddress);
                    }
                }

            }
            setIsLoader(getDetail.isLoader);
        });
    }
    useEffect(() => {
        resetStateVarible();
        loadCustomerdetail();
        return function cleanup() {
        }
    }, []);
    const resetStateVarible = () => {
        setCustomer(null);
        setIsBillingAdd([]);
        setIsShippingAdd([]);
    }
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                <View style={styles.container}>
                    <ScrollView>
                        {
                            customer && <View style={[GlobalStyle.card, { margin: 10, alignItems: 'flex-start' }]}>
                                <Text style={[styles.titleText, { fontSize: 14, paddingBottom: 10, opacity: 0.7 }]}>Customer Detail</Text>
                                <Drawline />
                                <View style={{ marginTop: 10, marginBottom: 5, flexDirection: 'row' }}>
                                    <Text style={[styles.lightText, { marginRight: 5, }]}>Store Name:-</Text>
                                    <Text style={[styles.titleText]}>{customer['storeName']}</Text>
                                </View>

                                <View style={{ marginBottom: 5, flexDirection: 'row' }}>
                                    <Text style={[styles.lightText, { marginRight: 5, }]}>First Name:- </Text>
                                    <Text style={styles.titleText}>{customer['firstname']}</Text>
                                </View>
                                <View style={{ marginBottom: 5, flexDirection: 'row' }}>
                                    <Text style={[styles.lightText, { marginRight: 5, }]}>Last Name:- </Text>
                                    <Text style={styles.titleText}>{customer['lastName']}</Text>
                                </View>
                                <View style={{ marginBottom: 5, flexDirection: 'row' }}>
                                    <Text style={[styles.lightText, { marginRight: 5, }]}>Email:-  </Text>
                                    <Text style={styles.titleText}>{customer['email']}</Text>
                                </View>
                                <View style={{ marginBottom: 5, flexDirection: 'row' }}>
                                    <Text style={[styles.lightText, { marginRight: 5, }]}>Store Id:-</Text>
                                    <Text style={[styles.titleText]}>{customer['storeId']}</Text>
                                </View>
                                <View style={{ marginBottom: 5, flexDirection: 'row' }}>
                                    <Text style={[styles.lightText, { marginRight: 5, }]}>Company Name:-</Text>
                                    <Text style={[styles.titleText]}>{customer['companyName']}</Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', marginBottom: 10 }}>
                                    <Text style={styles.lightText}>Is Super User</Text>
                                    {
                                        customer['isSuperuser'] === false ? <Text style={[styles.titleText, { marginHorizontal: 5, flex: 0 }]}>{'No'}</Text> : <Text style={[styles.titleText, { marginHorizontal: 5, flex: 0 }]}>{'Yes'}</Text>
                                    }

                                    {/* <Icon type={Icons.MaterialIcons} name={'radio-button-on'} size={18} color={COLORS.green} style={{ opacity: 0.7 }} /> */}

                                </View>


                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 5 }}>
                                    <Text style={[styles.lightText, { marginRight: 10 }]}>Status</Text>
                                    <View style={[GlobalStyle.recStatus(customer['recStatus']), { width: '30%', margin: 0 }]}>
                                        <Text style={GlobalStyle.recStatusText(customer['recStatus'])}>{customer['recStatus'] === 'A' ? 'Active' : customer['recStatus'] === 'I' ? 'Inactive' : 'Draft'}</Text>
                                    </View>

                                </View>


                            </View>
                        }
                        {
                            shippingAdd.length > 0 && <View style={[GlobalStyle.card, { margin: 10, marginTop: 0, alignItems: 'flex-start' }]}>
                                <Text style={[styles.titleText, { fontSize: 14, paddingBottom: 10, opacity: 0.7 }]}>Shipping Address</Text>
                                <View style={{ marginTop: 10, width: '100%' }}>
                                    {
                                        shippingAdd.map((item, index) => <View key={index.toString()} style={styles.boxStyle(item['isDefault'])}>
                                            <Text style={[styles.titleText, { fontSize: 15, marginBottom: 5, textTransform: 'capitalize' }]}>{`${item['firstname']} ${item['lastName']}`}</Text>
                                            {
                                                customer['companyName'] && <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                                    <Text style={styles.lightText}>{'Company Name: '}</Text>
                                                    <Text style={[styles.titleText, { fontSize: 12 }]}>{`${customer['companyName']}`}</Text>
                                                </View>
                                            }
                                            {
                                                <Text style={[styles.lightText, { marginBottom: 5 }]}>{`${item['address1']}, ${item['address2'] && item['address2']}`}</Text>
                                            }
                                            {
                                                item['suite'] != null || item['suite'] != '' && <Text style={[styles.lightText, { marginBottom: 5 }]}>{`${item['suite']}`}</Text>
                                            }
                                            {
                                                <Text style={[styles.lightText, { marginBottom: 5 }]}>{`${item['city']},${item['state'] && `${item['state']},`}${item['postalCode'] && item['postalCode']}`}</Text>
                                            }
                                            {
                                                item['countryName'] && <Text style={[styles.lightText, { marginBottom: 5 }]}>{`${item['countryName']}`}</Text>
                                            }
                                            {
                                                item['phone'] && <Text style={[styles.lightText]}>{`Mobile:- ${item['phone']}`}</Text>
                                            }



                                        </View>)
                                    }
                                </View>
                            </View>
                        }
                        {
                            billingAdd.length > 0 && <View style={[GlobalStyle.card, { margin: 10, marginTop: 0, alignItems: 'flex-start' }]}>
                                <Text style={[styles.titleText, { fontSize: 14, paddingBottom: 10, opacity: 0.7 }]}>Billing Address</Text>
                                <View style={{ marginTop: 10, width: '100%' }}>
                                    {
                                        billingAdd.map((item, index) => <View key={index.toString()} style={styles.boxStyle(item['isDefault'])}>
                                            <Text style={[styles.titleText, { fontSize: 15, marginBottom: 5, textTransform: 'capitalize' }]}>{`${item['firstname']} ${item['lastName']}`}</Text>
                                            {
                                                customer['companyName'] != null ? <View style={{ flexDirection: 'row', marginVertical: 5 }}>
                                                    <Text style={styles.lightText}>{'Company Name: '}</Text>
                                                    <Text style={[styles.titleText, { fontSize: 12 }]}>{`${customer['companyName']}`}</Text>
                                                </View> : null
                                            }
                                            {
                                                item['address1'] && <Text style={[styles.lightText, { marginBottom: 5 }]}>{`${item['address1']}, ${item['address2'] && item['address2']}`}</Text>
                                            }
                                            {
                                                item['suite'] != null || item['suite'] != '' && <Text style={[styles.lightText, { marginBottom: 5 }]}>{`${item['suite']}`}</Text>
                                            }
                                            {
                                                <Text style={[styles.lightText, { marginBottom: 5 }]}>{`${item['city']},${item['state'] && `${item['state']},`}${item['postalCode'] && item['postalCode']}`}</Text>
                                            }
                                            {
                                                item['countryName'] && <Text style={[styles.lightText, { marginBottom: 5 }]}>{`${item['countryName']}`}</Text>
                                            }
                                            {
                                                item['phone'] && <Text style={[styles.lightText]}>{`Mobile:- ${item['phone']}`}</Text>
                                            }
                                        </View>)
                                    }
                                </View>
                            </View>
                        }
                    </ScrollView>
                </View>
            </Appscreen>
        </>
    )
}

export default CustomerDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        fontSize: 13,
        opacity: 0.9,
        letterSpacing: 1.2,
        color: COLORS.titleColor,
        fontFamily: Font.RalewayBold,
        flex: 1
    },
    lightText: {
        fontSize: 12,
        opacity: 0.7,
        letterSpacing: 1.2,
        color: COLORS.titleColor,
        fontFamily: Font.RalewaySemiBold,
    },
    semilightText: {
        fontSize: 12,
        opacity: 1,
        letterSpacing: 1.2,
        color: COLORS.titleColor,
        fontFamily: Font.RalewayRegular,
    },
    boxStyle: (isDefault) => ({
        borderRadius: 4,
        borderWidth: 0.75,
        padding: 10,
        borderColor: COLORS.borderColor,
        marginBottom: 10,
        borderColor: isDefault === true ? COLORS.green : COLORS.borderColor,
    })

})
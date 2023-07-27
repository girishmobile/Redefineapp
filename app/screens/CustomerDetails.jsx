import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appscreen, Loader } from '../components/global'

import useApi from '../hooks/useApi';
import customersApi from '../api/customers';
import storage from '../auth/storage';
import { COLORS } from '../constant';

const CustomerDetails = ({ route }) => {

    const { customerId } = route.params;
    const [isLoader, setIsLoader] = useState(false);
    const [customer, setCustomer] = useState({});

    const [customerAddress, setCustomerAddress] = ([]);

    const getDetail = useApi(customersApi.getCustomerDetails);
    const loadCustomerdetail = async () => {
        setIsLoader(true);
        const header = { 'header': true, }
        await storage.mergeUserdata(header, async (added) => {
            const response = await getDetail.request(customerId);
            if (response != null) {
                const mydata = response['data'];
                setCustomer(mydata['data']);
                if (customer['customerAddress'] != null) {
                    setCustomerAddress(customer['customerAddress']);
                }
            }
            setIsLoader(getDetail.isLoader);
        });
    }
    useEffect(() => {
        loadCustomerdetail();
    }, [])
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                <View style={styles.container}>
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                        <Text style={[styles.titleText, { fontWeight: '700' }]}>Name:- </Text>
                        <Text style={[styles.titleText, { flex: 1, textTransform: 'capitalize', fontWeight: '700' }]}>{customer['name']}</Text>
                    </View>
                    <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.lightText, opacity: 0.5, marginVertical: 5 }} />
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                        <Text style={styles.titleText}>Email:- </Text>
                        <Text style={[styles.titleText, { flex: 1, }]}>{customer['email']}</Text>
                    </View>
                    <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.lightText, opacity: 0.5, marginVertical: 5 }} />
                    <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                        <Text style={styles.titleText}>Customer Id:-  </Text>
                        <Text style={[styles.titleText, { flex: 1, textTransform: 'capitalize' }]}>{customer['id']}</Text>
                    </View>
                    <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.lightText, opacity: 0.5, marginVertical: 5 }} />
                    {customer['storeName'] &&
                        <>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                <Text style={styles.titleText}>Store Name:-  </Text>
                                <Text style={[styles.titleText, { flex: 1, textTransform: 'capitalize' }]}>{customer['storeName']}</Text>
                            </View>
                            <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.lightText, opacity: 0.5, marginVertical: 5 }} />
                        </>
                    }
                    {customer['storeId'] &&
                        <>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                <Text style={styles.titleText}>Store Id:-  </Text>
                                <Text style={[styles.titleText, { flex: 1, textTransform: 'capitalize' }]}>{customer['storeId']}</Text>
                            </View>
                            <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.lightText, opacity: 0.5, marginVertical: 5 }} />
                        </>

                    }
                    {customer['jobTitle'] &&
                        <>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                <Text style={styles.titleText}>Job Title:-  </Text>
                                <Text style={[styles.titleText, { flex: 1, textTransform: 'capitalize' }]}>{customer['jobTitle']}</Text>
                            </View>
                            <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.lightText, opacity: 0.5, marginVertical: 5 }} />
                        </>
                    }
                    {customer['isRegistered'] &&
                        <>
                            <View style={{ flexDirection: 'row', alignSelf: 'flex-start' }}>
                                <Text style={styles.titleText}>isRegistered:-  </Text>
                                <Text style={[styles.titleText, { flex: 1, textTransform: 'capitalize' }]}>{customer['isRegistered'] === 1 ? "true" : "false"}</Text>
                            </View>
                            <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.lightText, opacity: 0.5, marginVertical: 5 }} />
                        </>
                    }

                </View>
            </Appscreen>
        </>
    )
}

export default CustomerDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
        borderRadius: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    boldText: {
        fontSize: 18,
        fontWeight: '700',
        opacity: 0.9,
        textAlign: 'center',
        lineHeight: 18,
        letterSpacing: 1.1,
        marginBottom: 20,
        color: COLORS.titleColor,
    },
    titleText: {
        fontSize: 13,
        fontWeight: '500',
        opacity: 0.9,
        lineHeight: 16,
        letterSpacing: 1.1,
        marginVertical: 5,
        color: COLORS.titleColor,
    },
    lightText: {
        fontSize: 13,
        opacity: 0.7,
        lineHeight: 20,
        letterSpacing: 1.2,
        flex: 1,
        color: COLORS.titleColor,
    }
})
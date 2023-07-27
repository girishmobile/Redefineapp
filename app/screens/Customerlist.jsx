import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Appscreen, Loader } from '../components/global'

import customersApi from '../api/customers';
import useApi from '../hooks/useApi';
import storage from '../auth/storage';
import storeApi from '../api/store';
import { CustItem } from '../components/customer';
import MyDropdown from '../components/global/MyDropdown';
import { COLORS } from '../constant';
import FooterLoadmore from '../components/items/FooterLoadmore';
import { PAGE_SIZE } from '../constant/constan';


const Customerlist = ({ navigation, route }) => {




    //Loader
    const [refreshing, setRefreshing] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    //Error
    const [errorMsg, setIsErrorMsg] = useState('');

    //DATA
    const [Items, setItems] = useState([]);
    const [stores, setIsStores] = useState([]);
    const [storeId, setStoreId] = useState(null);
    const [prestoreId, setPrevStoreId] = useState(null);
    const [filterKey, setFilterKey] = useState("");
    const [filterValue, setFilterValue] = useState("")

    const [showloadmore, setShowloadMore] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);


    //WEB API
    const getcustlistApi = useApi(customersApi.getCustomerlist);
    const getstoreApi = useApi(storeApi.getStorelist);

    const loadcustomerlistbystoreId = async (storeId) => {
        const header = { 'header': true, }
        await storage.mergeUserdata(header, async (headerAdded) => {
            const params = {
                "args": {
                    "pageIndex": pageIndex,
                    "pageSize": PAGE_SIZE,
                    "filteringOptions": [
                        {
                            "field": filterKey,
                            "operator": 0,
                            "value": filterValue
                        },
                        {
                            "field": "storeId",
                            "operator": 1,
                            "value": storeId
                        }

                    ],
                },
            }
            setIsLoader(true);
            const result = await getcustlistApi.request(params);
            setIsLoader(false);
            if (result['data'] != null) {

                const mydata = result.data['data'];
                if (mydata != null) {
                    const items = mydata['items'];
                    if (items.length > 0) {
                        setItems([...Items, ...items]);
                        if (mydata['totalPages'] > pageIndex) {
                            setShowloadMore(true);
                        }
                        else {
                            setShowloadMore(false);
                        }
                    }
                    else {
                        if (mydata['totalPages'] <= 1) {
                            console.log('No more Orders...')
                        }
                        else {
                            console.log('Order not found.\nPlease try again later');
                        }

                    }
                }
                else {

                }

            }
        });

    }
    const loadStorelist = async () => {

        setIsLoader(true);
        await storage.getUser(async (user) => {
            if (user != null) {
                const { isSuperUser, userId } = user;
                const store = {
                    userid: `${userId}`,
                    companyConfigurationId: 1,
                    isSuperUser: isSuperUser
                }
                const header = { 'header': true }
                await storage.mergeUserdata(header, async (added) => {
                    const response = await getstoreApi.request(store);
                    setIsLoader(getstoreApi.isLoader);
                    const mydata = response['data'];
                    if (mydata['data'] != null) {
                        const storeValue = mydata['data'][0].value;
                        setStoreId(storeValue);
                        setIsStores(mydata['data']);

                    }
                });
            }
        });
    }
    const selectedStoreValue = (storeValue) => {
        if (storeId !== storeValue) {

            setPageIndex(1);
            setItems([]);
            setStoreId(storeValue);
        }
    }
    const OnloadMore = () => {
        setPageIndex(pageIndex => pageIndex + 1);
    }
    useEffect(() => {

        if (storeId != null) {
            loadcustomerlistbystoreId(storeId);
        }

    }, [storeId]);
    useEffect(() => {
        if (pageIndex === 1) return;
        loadcustomerlistbystoreId(storeId);

    }, [pageIndex]);
    const renderTitle = (title) => (
        <Text style={{ fontWeight: '600', fontSize: 16, letterSpacing: 1.1, color: COLORS.secondary, }}>{title}</Text>
    )
    useEffect(() => {

        const { item } = route.params;
        let headerTitle = "";
        let iconName = "";
        switch (item['type']) {
            case "activeCustomer":
                headerTitle = "Active Customer";
                setFilterKey('recStatus');
                setFilterValue('A');
                break;
            case "inActiveCustomer":
                headerTitle = "InActive Customer";
                setFilterKey('recStatus');
                setFilterValue('I');
                break;
            case "totalCustomer":
                headerTitle = "All Customer";
                setFilterKey("");
                setFilterValue("");
                break;
            case "registeredCustomer":
                headerTitle = "Registred Customer";
                setFilterKey("isRegistered");
                setFilterValue("1");
                break;
            case "unRegisteredCustomer":
                headerTitle = "UnRegistred Customer";
                setFilterKey("isRegistered");
                setFilterValue("0");
                break;

            default:
                break;
        }
        navigation.setOptions({
            headerTitle: () => renderTitle(headerTitle),
        })
        if (storeId != null) return;
        loadStorelist();
        return function cleanup() {

        }

    }, []);

    return (

        <>
            <Loader visible={isLoader} />
            <Appscreen>

                <View style={styles.container}>
                    <View style={{ zIndex: 1, marginLeft: 20, marginRight: 20, marginTop: 20 }}>
                        {stores.length > 0 ? <MyDropdown placeholder={false} stores={stores} onSelecte={(storeValue) => selectedStoreValue(storeValue)} /> : null}
                    </View>
                    {Items.length > 0 ? <FlatList
                        data={Items}
                        contentContainerStyle={{ padding: 20 }}
                        keyExtractor={(_, index) => index.toString()}

                        renderItem={({ item, index }) => {
                            return <CustItem item={item} onPress={() => navigation.navigate('customerDetail', { 'customerId': item.id })} />
                        }}
                        showsVerticalScrollIndicator={false}
                        removeClippedSubviews={false}
                        refreshing={refreshing}
                        onRefresh={() => {
                            console.log('Refreshing...');
                        }}
                        ListFooterComponent={showloadmore && <FooterLoadmore OnloadMore={() => OnloadMore()} />}

                    /> : <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={styles.errorMsg}>{errorMsg}</Text>
                    </View>}

                </View>
            </Appscreen>

        </>
    )
}

export default Customerlist

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    errorMsg: {
        color: COLORS.titleColor,
        fontWeight: '500',
        opacity: 0.7,
        letterSpacing: 1.2,
        fontSize: 14,
        padding: 5,
        textAlign: 'center',
        lineHeight: 18,
    },
})
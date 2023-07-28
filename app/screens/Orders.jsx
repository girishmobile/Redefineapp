import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Loader from '../components/global/Loader'
import Appscreen from '../components/global/Appscreen';
import { useIsFocused } from '@react-navigation/native';
import useApi from '../hooks/useApi';
import { orderApi, storeApi } from '../api';

import OrderItem from '../components/items/OrderItem';
import FooterLoadmore from '../components/items/FooterLoadmore';
import MyDropdown from '../components/global/MyDropdown';

import storage from '../auth/storage'; //local storage
import { COLORS } from '../constant';
import { PAGE_SIZE } from '../constant/constan';
import GlobalStyle from '../styles/GlobalStyle';
import Icon, { Icons } from '../components/Icons';
import Font from '../config/CustomFont';
import StoreModal from './StoreModal';
const Orders = ({ navigation }) => {
    //handler
    const [isLoader, setIsLoader] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [showloadmore, setShowloadMore] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    const isFocused = useIsFocused();
    //Error
    const [errorMsg, setIsErrorMsg] = useState('');
    const [error, setIsError] = useState(false);
    //Search Modal
    const [visible, setIsvisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [storeId, setStoreId] = useState(null);
    const [storeName, setStoreName] = useState('Select store');

    //data
    const [stores, setIsStores] = useState([]);
    const [Items, setItems] = useState([]);

    //WEB API
    const getOrderApi = useApi(orderApi.getOrderlistBystoreId);
    const getstoreApi = useApi(storeApi.getStorelist);


    const loadOrderlistbystoreId = async (storeId) => {
        const params = {
            "pageSearchArgs": {
                "pageIndex": pageIndex,
                "pageSize": PAGE_SIZE,
                "filteringOptions": [
                    {
                        "field": "",
                        "operator": 0,
                        "value": ""
                    }
                ]
            },
            "storeID": [
                storeId
            ]
        }
        setIsLoader(true);
        const response = await getOrderApi.request(params);
        setIsLoader(false);
        if (!response.ok) {
            setIsError(true);
            setIsErrorMsg('Oops, something went wrong.\nPlease try again later');
            return;
        }
        else if (response['data'] != null) {
            const mydata = response.data['data'];
            if (mydata != null) {
                const items = mydata['items'];
                if (items.length > 0) {
                    setItems([...Items, ...items]);
                    setIsError(false);
                    setIsErrorMsg('');
                    if (mydata['totalPages'] > pageIndex) {
                        setShowloadMore(true);
                    }
                    else {
                        setShowloadMore(false);
                    }
                }
                else {
                    if (mydata['totalPages'] === 0) {
                        setIsError(true);
                        setIsErrorMsg(`Order not found.\nPlease try again later.`);
                    }
                    else if (mydata['totalPages'] <= pageIndex) {
                        setIsError(true);
                        setIsErrorMsg('No more Order...\nPlease try again later.');
                    }
                    else {
                        setIsError(true);
                        setIsErrorMsg('Order not found.\nPlease try again later.');
                    }
                }
            }
            else {
            }
        }
        else {
            // setIsError(getproductApi.error);
            // setIsErrorMsg('An unexpected error occurred.');
            return;
        }
    }
    const OnloadMore = () => {
        setPageIndex(pageIndex => pageIndex + 1);
    }
    const selectedStoreValue = (storeValue) => {
        setPageIndex(1);
        setItems([]);
        setStoreId(storeValue);
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
                const response = await getstoreApi.request(store);
                //setIsLoader(false);
                const mydata = response['data'];
                if (mydata['data'] != null && mydata['data'].length > 0) {
                    const storeValue = mydata['data'][0].value;
                    const storeLabel = mydata['data'][0].label;
                    setStoreName(storeLabel);
                    setStoreId(storeValue);
                    setIsStores(mydata['data']);
                }
                else {
                    setIsLoader(false);
                    setIsError(true);
                    setIsErrorMsg('Oops, something went wrong.\nPlease try again later.');
                }
            }
        });
    }
    useEffect(() => {
        if (pageIndex === 1) return;
        loadOrderlistbystoreId(storeId);
    }, [pageIndex]);
    useEffect(() => {
        if (storeId != null) {
            loadOrderlistbystoreId(storeId);
        }
    }, [storeId]);
    const addheaderInstorage = async () => {
        const header = { 'header': true }
        await storage.mergeUserdata(header, (added) => {
            loadStorelist();
        })
    }
    useEffect(() => {
        if (isFocused) {
            setPageIndex(1);
            setIsErrorMsg('')
            setIsError(false);
            setIsStores([]);
            setStoreId(null);
            setItems([]);
            setStoreName('Select store');
            addheaderInstorage();
        }
        return function cleanup() {

        }
    }, []);

    //*********************************** SEARCHBAR ************************************** */
    const handleSearch = (query) => {
        setSearchQuery(query);
        // const formattedQuery = query.toLowerCase();
        // const filteredData = filter(fullData, (user) => {
        //     return contains(user, formattedQuery);
        // });
        // setIsData(filteredData);

    }
    const renderSearchBar = () => {
        return (
            <View style={{ width: '100%', padding: 10, backgroundColor: COLORS.primary }}>
                <View style={GlobalStyle.searchBox}>
                    <Icon name={'search-outline'} type={Icons.Ionicons} size={20} color={'#ccc'} />
                    <TextInput
                        style={{
                            paddingVertical: 0,
                            flex: 1,
                            color: COLORS.titleColor,
                            fontFamily: Font.RalewayRegular,
                            fontSize: 15,
                            letterSpacing: 1.2
                        }}
                        placeholder='Search'
                        //clearButtonMode='always'
                        autoCapitalize='none'
                        autoCorrect={false}
                        value={searchQuery}
                        onChangeText={(query) =>
                            handleSearch(query)
                        }
                    />
                    {
                        searchQuery == '' ? null : <TouchableOpacity onPress={() => {
                            setSearchQuery('');
                            //setIsData(fullData);
                        }
                        }>
                            <Icon name={'close-circle'} type={Icons.Ionicons} size={20} color={'#ccc'} />
                        </TouchableOpacity>
                    }
                </View>
                <View style={{ backgroundColor: '#fff', paddingTop: 5, }}>
                    <TouchableOpacity onPress={() => setIsvisible(!visible)} style={{ padding: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <Text style={[GlobalStyle.storeNameText, { flex: 1 }]}>{storeName}</Text>
                        <Icon type={Icons.Ionicons} name={'ios-chevron-forward-sharp'} size={18} color={COLORS.lightText} />
                    </TouchableOpacity>
                </View>
                {
                    visible && stores.length > 0 &&
                    <StoreModal
                        stores={stores}
                        visible={visible}
                        onSelect={(item) => {
                            setStoreName(item.label);
                            setPageIndex(1);
                            setItems([]);
                            setStoreId(item.value);
                            setIsvisible(false);
                        }
                        }
                        selectedStore={storeName}
                        onClose={() => setIsvisible(false)} />
                }
            </View>

        )
    }
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                {
                    renderSearchBar()
                }
                <View style={styles.container}>

                    {error && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={styles.errorMsg}>{errorMsg}</Text>
                        </View>
                    )}
                    {Items.length > 0 && (
                        <FlatList
                            style={{ padding: 10 }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            data={Items}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return <OrderItem item={item} onPress={() => navigation.navigate('Orderdetails', { 'order': item })} />
                            }}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={false}
                            refreshing={refreshing}
                            onRefresh={() => {
                                console.log('onRefeshing');
                            }}
                            ListFooterComponent={showloadmore && <FooterLoadmore OnloadMore={() => OnloadMore()} />}
                        />
                    )}
                </View>
            </Appscreen>
        </>
    )
}
export default Orders
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
/*
 // call method 1 -> const { data, error, isLoader, request: loadListings } = useApi(listingApi.getListings);
// call method 1 -> loadListings(1,2,3);
        //call method 2
        //getListingsApi.request(1, 2, 3);
        //getCustomerApi.request();
        
    //call method 2
    //const getListingsApi = useApi(listingApi.getListings);
    const header = { 'header': true }
                await storage.mergeUserdata(header, async (added) => {
                    
                });
 */
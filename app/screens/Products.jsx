import { View, FlatList, StyleSheet, Text, TouchableOpacity, TextInput, Modal } from 'react-native'
import React, { useCallback, useEffect, useState, useReducer, useRef } from 'react'

import Appscreen from '../components/global/Appscreen';
import { ProductItem } from '../components/items';
//WEB API
import useApi from '../hooks/useApi';
import { productApi, storeApi } from '../api';
//Storage
import storage from '../auth/storage';
import { Loader } from '../components/global';
import { COLORS } from '../constant';
import MyDropdown from '../components/global/MyDropdown';

import { PAGE_SIZE } from '../constant/constan';
import { initialState, messengerReducer } from '../redux/messengerReducer';

import Icon, { Icons } from '../components/Icons';
import Font from '../config/CustomFont';
import CustomModal from './CustomModal';
import GlobalStyle from '../styles/GlobalStyle';
import StoreModal from './StoreModal';

//import { FlashList } from '@shopify/flash-list';

const Products = ({ navigation }) => {

    //Utility
    const [isLoader, setIsLoader] = useState(false);
    const [showloadmore, setShowloadMore] = useState(false);
    const [pageIndex, setPageIndex] = useState(1);
    //data
    const [stores, setIsStores] = useState([]);
    const [Items, setItems] = useState([]);

    //Search Modal
    const [visible, setIsvisible] = useState(false);
    const [storeName, setIsStoreName] = useState('Select store');
    const [storeId, setStoreId] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    //WEB API
    const getstoreApi = useApi(storeApi.getStorelist);
    const getproductApi = useApi(productApi.getProductlistBystoreId);
    const getprodFilterApi = useApi(productApi.getProductFilter);

    //Error 
    const [errorMsg, setIsErrorMsg] = useState('');
    const [error, setIsError] = useState(false);
    //Reducer 
    const [state, dispatch] = useReducer(messengerReducer, initialState);
    //Morefilter 
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFilter, setIsFilter] = useState(false);
    const [isClear, setIsClear] = useState(false);
    const [filterLoadMore, setIsFilterLoadMore] = useState(false);
    const [filterCount, setIsFilterCount] = useState(0);
    const [payload, setIsPayload] = useState([]);

    const loadstorelistByuserId = async () => {
        setIsError(false);
        setIsErrorMsg('');
        console.log('loadStore');
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
                //setIsLoader(getstoreApi.isLoader);
                const mydata = response['data'];
                if (mydata['data'] != null) {
                    const storeValue = mydata['data'][0].value;
                    const storeName = mydata['data'][0].label;
                    setStoreId(storeValue);
                    setIsStoreName(storeName);

                    setIsStores(mydata['data']);
                }
            }
            else {
                setIsLoader(false);
            }
        })
    }
    const loadFilterProductlist = async (storeId) => {
        console.log('load product');
        setIsFilterLoadMore(false);
        setIsError(false);
        setIsErrorMsg('');
        const params = {
            "args": {
                "pageIndex": pageIndex,
                "pageSize": PAGE_SIZE,
                "filteringOptions": payload
            },
            "storeId": storeId
        }
        setIsLoader(true);
        const response = await getprodFilterApi.request(params);
        setIsLoader(getprodFilterApi.isLoader);
        if (!response.ok) {
            setIsError(true);
            setIsErrorMsg('Oops, something went wrong.\nPlease try again later.');
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

                        setIsFilterLoadMore(true);

                        setShowloadMore(true);
                    }
                    else {

                        setShowloadMore(false);
                    }
                }
                else {
                    if (mydata['totalPages'] === 0) {
                        setIsError(true);
                        setIsErrorMsg('Product not found...');
                    }
                    else if (mydata['totalPages'] <= pageIndex) {
                        setIsError(true);
                        setIsErrorMsg('No more product.');
                    }
                    else {
                        setIsError(true);
                        setIsErrorMsg('Product not found.\nPlease try again later.');
                    }
                }
            }
        }
        else {
            setIsError(true);
            setIsErrorMsg('An unexpected error occurred.');

        }

    }
    const loadProductlistBystoreId = async (storeId) => {

        setIsFilterLoadMore(false);
        setIsError(false);
        setIsErrorMsg('');

        const params = {
            "args": {
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
            "storeId": storeId
        }
        setIsLoader(true);
        const response = await getproductApi.request(params);
        setIsLoader(false);
        if (!response.ok) {
            setIsError(true);
            setIsErrorMsg('Oops, something went wrong.\nPlease try again later.');
            return;
        }
        else if (response['data'] != null) {
            const mydata = response.data['data'];
            if (mydata != null) {
                const items = mydata['items'];
                if (items.length > 0) {

                    setIsError(false);
                    setIsErrorMsg('');
                    setItems([...Items, ...items]);
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
                        setIsErrorMsg('Product not found...');
                    }
                    else if (mydata['totalPages'] <= pageIndex) {
                        setIsError(true);
                        setIsErrorMsg('No more product.');
                    }
                    else {
                        setIsError(true);
                        setIsErrorMsg('Product not found.\nPlease try again later.');
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
    const requiredHeader = async () => {
        const header = { 'header': true }
        await storage.mergeUserdata(header, (added) => {
            loadstorelistByuserId();
        })
    }
    const openMoreFilterModal = () => {
        setIsModalVisible(true);
    }


    //***************************** useEffect hook ****************************** */
    useEffect(() => {
        navigation.setOptions({

            headerRight: () => (
                <View style={{ flexDirection: 'row' }}>

                    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }} onPress={() => openMoreFilterModal()}>
                        {
                            filterCount > 0 && <View style={{ zIndex: 1, marginRight: -10, width: 20, height: 20, backgroundColor: 'rgba(99,102,241,1)', borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
                                <Text style={{ textAlign: 'center', fontFamily: Font.RalewaySemiBold, fontSize: 12, color: COLORS.primary, }}>{filterCount}</Text>
                            </View>
                        }
                        <Icon type={Icons.Ionicons} name={'ios-options-outline'} size={30} color={filterCount > 0 ? 'rgba(99,102, 241, 1)' : COLORS.lightText} />
                    </TouchableOpacity>

                </View>
            ),
        });
        return function cleanup() {

        }
    }, [filterCount]);
    useEffect(() => {
        if (pageIndex === 1) return;
        if (filterLoadMore) {
            loadFilterProductlist(storeId);
        }
        else {
            loadProductlistBystoreId(storeId);
        }
        return function cleanup() {
        }
    }, [pageIndex]);
    useEffect(() => {

        if (storeId != null) {
            setIsFilterCount(0);
            loadProductlistBystoreId(storeId);
        }
        return function cleanup() {
        }
    }, [storeId]);
    useEffect(() => {
        if (payload.length > 0) {
            loadFilterProductlist(storeId);
        }
        else {
            if (storeId != null) {

                setIsFilterCount(0);
                loadProductlistBystoreId(storeId);
            }
        }
        return function cleanup() {
        }
    }, [isFilter]);
    useEffect(() => {
        if (storeId != null) {
            setIsFilterCount(0);
            loadProductlistBystoreId(storeId)
        }
        return function cleanup() {
        }
    }, [isClear]);

    useEffect(() => {

        let mounted = true
        if (mounted) {
            setItems([]);
            setIsPayload([]);
            setPageIndex(1);
            setIsErrorMsg('');
            setIsStoreName('Select store');
            setIsError(false);
            setIsStores([]);
            setStoreId(null);
            setIsFilter(false);
            setIsFilterLoadMore(false);
            setIsFilterCount(0);
            requiredHeader();
        }
        return function cleanup() {
            setStoreId(null);
            mounted = false
        }
    }, []);
    const OnloadMore = () => {
        setPageIndex(pageIndex => pageIndex + 1);
    }
    const renderFooter = () => {
        return (
            <View style={styles.footer}>
                <TouchableOpacity style={styles.loadMoreBtn}
                    activeOpacity={0.9}
                    onPress={() => OnloadMore()}
                >
                    <Text style={styles.btnText}>Load More</Text>
                </TouchableOpacity>
            </View>
        );
    }


    const renderSearchBar = () => {
        return (
            <View style={{ width: '100%', padding: 10, backgroundColor: COLORS.primary }}>
                <View style={styles.searchBox}>
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
                            setIsStoreName(item.label);
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

    const handleSearch = (query) => {
        setSearchQuery(query);
        // const formattedQuery = query.toLowerCase();
        // const filteredData = filter(fullData, (user) => {
        //     return contains(user, formattedQuery);
        // });
        // setIsData(filteredData);

    }
    const renderItem = useCallback((item, index) => (
        <ProductItem key={item.id} item={item} index={index}
            onPress={() => {
                navigation.navigate('ProductDetails', { 'productId': item['id'], 'item': item })
            }} />
    ), [])
    return (
        <>

            <Appscreen>
                <Loader visible={isLoader} />
                {
                    renderSearchBar()
                }
                <View style={{ flex: 1, }}>

                    {error && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={styles.errorMsg}>{errorMsg}</Text>
                        </View>
                    )}
                    {Items.length > 0 && (
                        <FlatList
                            style={{ padding: 10 }}
                            nestedScrollEnabled={true}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            data={Items}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }) => renderItem(item, index)}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={false}
                            ListFooterComponent={showloadmore && renderFooter()}
                        />

                        // <View style={{ flex: 1, padding: 10 }}>
                        //     <FlashList

                        //         estimatedItemSize={Items.length}
                        //         nestedScrollEnabled={true}
                        //         contentContainerStyle={{ paddingBottom: 20 }}
                        //         data={Items}
                        //         keyExtractor={(_, index) => index.toString()}
                        //         renderItem={({ item, index }) => renderItem(item, index)}
                        //         numColumns={2}
                        //         showsVerticalScrollIndicator={false}
                        //         removeClippedSubviews={false}
                        //         ListFooterComponent={showloadmore && renderFooter()}
                        //     />
                        // </View>

                    )}
                </View>
            </Appscreen>
            {
                storeId && <CustomModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(!isModalVisible)}
                    onApply={(params) => {

                        setIsModalVisible(!isModalVisible);
                        setIsPayload(params['payload']);
                        setPageIndex(1);
                        setIsErrorMsg('');
                        setIsError(false);
                        setItems([]);
                        setIsFilterCount(params['count']);
                        setIsFilter(!isFilter);
                    }}
                    onClear={() => {
                        setIsModalVisible(!isModalVisible);

                        if (payload.length > 0) {

                            setPageIndex(1);
                            setIsErrorMsg('');
                            setIsError(false);
                            setItems([]);
                            setIsClear(!isClear);
                        }

                    }}
                    storeId={storeId} />
            }
        </>
    )
}
const styles = StyleSheet.create({

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
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: COLORS.lightText,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#fff',
        fontFamily: Font.RalewayRegular,
        fontSize: 13,
        textAlign: 'center',
        letterSpacing: 1.2,
    },
    //Search
    searchBox: {
        backgroundColor: COLORS.textBgcolor,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderColor: COLORS.textBgcolor,
        borderWidth: 1,
        borderRadius: 8,
    },
    dropdown: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '100%',
        shadowColor: '#000000',
        shadowRadius: 4,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.5,
    },

})
export default Products

/**
 * {/* <View style={{ zIndex: 1, marginLeft: 10, marginRight: 10, marginTop: 10 }}>
                        {stores.length > 0 && <MyDropdown stores={stores} onSelecte={(value) => selectedStoreValue(value)} />}
                    </View> }*/

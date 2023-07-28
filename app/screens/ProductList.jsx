import { StyleSheet, Text, TouchableOpacity, View, TextInput, FlatList } from 'react-native'
import React, { useEffect, useReducer, useState, useCallback } from 'react'
import storage from '../auth/storage';
import { Appscreen, Loader } from '../components/global';

import useApi from '../hooks/useApi';
import { productApi, storeApi } from '../api';
import Icon, { Icons } from '../components/Icons';
import { COLORS } from '../constant';
import Font from '../config/CustomFont';
import GlobalStyle from '../styles/GlobalStyle';
import StoreModal from './StoreModal';
import { PAGE_SIZE } from '../constant/constan';
import LoadMoreBtn from '../components/global/LoadMoreBtn';
import { ProductItem } from '../components/items';


const payload = [{
    "field": "",
    "operator": 0,
    "value": ""
}];

function reducer(state, action) {
    switch (action.type) {
        case 'CHANGED': {
            return action.params
        }
        case 'RESET': {
            return action.params
        }
        default:
            break;
    }
}
const ProductList = ({ navigation }) => {


    const [state, dispatch] = useReducer(reducer, payload);
    const params = [{ name: 'Shreyansh', age: '3' }, { name: 'Aditey', age: '1' }];
    const [isPalylaod, setIsPayloadChanged] = useState(false);

    //store
    const [storeId, setIsStoreId] = useState(null);
    const [storeName, setIsStoreName] = useState('');
    const [storeList, setIsStoreList] = useState([]);

    //Search Modal
    const [visible, setIsvisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimer, setSearchTimer] = useState(null);
    //Product list
    const [ProductList, setIsProductList] = useState([]);
    const [fullData, setIsFullData] = useState([]);
    const [pageIndex, setIsPageIndex] = useState(1);
    const [loadmoreBtn, setIsLoadmoreBtn] = useState(false);
    const [totalPages, setIstotalPages] = useState(0);
    const [totalCount, setIstotalCount] = useState(0);

    //Loader and Error
    const [isLoader, setIsLoader] = useState(false);
    const [errorMsg, setIsErrorMsg] = useState('');
    const [error, setIsError] = useState(false);
    //WEB API
    const getStorelistApi = useApi(storeApi.getStorelist);
    const getProductlistApi = useApi(productApi.getProductlistBystoreId);

    useEffect(() => {

        getstorelistFromserver();
        return function cleanup() {
            clearStateValue();
            console.log('clean up called');
        }
    }, []);
    useEffect(() => {
        if (storeId != null) {
            console.log('isPayload loadproduct list', isPalylaod);
            loadProductlistBystoreId();
        }
        return function cleanup() {


        }
    }, [isPalylaod]);
    const clearStateValue = () => {

        setIsPageIndex(1);
        setIsStoreId(null);
        setIsProductList([]);
        setIsLoadmoreBtn(false);
        setIsError(false);
        setIsErrorMsg('');
    };
    const getstorelistFromserver = async () => {
        const header = { 'header': true }
        await storage.mergeUserdata(header, (added) => {
            loadstorelistByuserId();
        })
    }
    const loadstorelistByuserId = async () => {
        setIsError(false);
        setIsErrorMsg('');
        setIsLoader(true);
        await storage.getUser(async (user) => {
            if (user != null) {
                const { isSuperUser, userId } = user;
                const store = {
                    userid: `${userId}`,
                    companyConfigurationId: 1,
                    isSuperUser: isSuperUser
                }
                const response = await getStorelistApi.request(store);
                setIsLoader(false);
                if (!response.ok) {
                    setIsError(true);
                    setIsErrorMsg('Oops, something went wrong.\nPlease try again later.');
                    return;
                }
                else if (response['data'] != null) {
                    const mydata = response['data'];
                    if (mydata['data'] != null) {
                        const storeValue = mydata['data'][0].value;
                        const storeName = mydata['data'][0].label;
                        clearStateValue();
                        setIsStoreId(storeValue);
                        setIsStoreName(storeName);
                        setIsStoreList(mydata['data']);
                        setIsPayloadChanged(!isPalylaod);
                    }
                }
                else {
                    setIsError(true);
                    setIsErrorMsg('An unexpected error occurred.');
                }
            }
            else {
                setIsLoader(false);
            }
        })

    }
    const loadProductlistBystoreId = async () => {


        setIsError(false);
        setIsErrorMsg('');
        const params = {
            "args": {
                "pageIndex": pageIndex,
                "pageSize": PAGE_SIZE,
                "filteringOptions": state
            },
            "storeId": storeId
        }
        setIsLoader(true);
        const response = await getProductlistApi.request(params);
        setIsLoader(false);
        if (!response.ok) {
            setIsError(true);
            setIsErrorMsg('Oops, something went wrong.\nPlease try again later.');
            return;
        }
        else if (response['data'] != null) {
            const mydata = response.data['data'];

            if (mydata != null) {

                setIstotalCount(mydata['totalCount']);
                setIstotalPages(mydata['totalPages']);

                const items = mydata['items'];
                if (items.length > 0) {
                    setIsError(false);
                    setIsErrorMsg('');
                    setIsProductList([...ProductList, ...items]);
                    if (mydata['totalPages'] > pageIndex) {
                        setIsLoadmoreBtn(true);
                    }
                    else {
                        setIsLoadmoreBtn(false);
                    }
                }
                else {
                    if (mydata['totalPages'] === 0) {
                        setIsError(true);
                        setIsErrorMsg('No data found as of now.');
                    }
                    else if (mydata['totalPages'] <= pageIndex) {
                        setIsError(true);
                        setIsErrorMsg('No more data found as of now .');
                    }
                    else {
                        setIsError(true);
                        setIsErrorMsg('No data found as of now.');
                    }
                }
            }
            else {

            }
        }
        else {
            setIsError(true);
            setIsErrorMsg('An unexpected error occurred.');
        }

    }
    const renderTopheader = () => {
        return (
            <View style={{ flexDirection: 'row', marginTop: 50 }}>
                <TouchableOpacity
                    onPress={() => {
                        dispatch({ type: 'RESET', params: payload });
                        setIsPayloadChanged(!isPalylaod);
                    }
                    }
                    style={{ padding: 10, backgroundColor: 'orange', marginVertical: 10 }}>
                    <Text>RESET REDUCER</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        dispatch({ type: 'CHANGED', params });
                        setIsPayloadChanged(!isPalylaod);
                    }}
                    style={{ padding: 10, backgroundColor: 'green', marginVertical: 10 }}>
                    <Text>CHANGE REDUCER</Text>
                </TouchableOpacity>
                <TouchableOpacity

                    onPress={() => console.log('Display:- ', state)}
                    style={{ padding: 10, backgroundColor: 'red', marginVertical: 10 }}>
                    <Text>Display Reducer</Text>
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
                        onChangeText={(query) => {
                            if (searchTimer) {
                                clearTimeout(searchTimer);
                            }
                            setSearchQuery(query);
                            setSearchTimer(setTimeout(() => {
                                setIsProductList([]);
                                setIsPageIndex(1);
                                const params = [{ "field": "global", "operator": 0, "value": query }]
                                dispatch({ type: 'CHANGED', params });
                                setIsPayloadChanged(!isPalylaod);

                            }, 1000),);
                        }
                        }
                    />
                    {
                        searchQuery == '' ? null : <TouchableOpacity onPress={() => {
                            setSearchQuery('');
                            setIsProductList([]);
                            setIsPageIndex(1);
                            const params = [{ "field": "", "operator": 0, "value": "" }]
                            dispatch({ type: 'CHANGED', params });
                            setIsPayloadChanged(!isPalylaod);

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
                    visible && storeList.length > 0 &&
                    <StoreModal
                        stores={storeList}
                        visible={visible}
                        onSelect={(item) => {
                            clearStateValue();
                            setIsStoreName(item.label);
                            setIsStoreId(item.value);
                            setIsvisible(false);
                            setIsPayloadChanged(!isPalylaod);
                        }
                        }
                        selectedStore={storeName}
                        onClose={() => setIsvisible(false)} />
                }
            </View>
        )
    }
    const renderItem = useCallback((item, index) => (
        <ProductItem key={item.id} item={item} index={index}
            onPress={() => {
                navigation.navigate('ProductDetails', { 'productId': item['id'], 'item': item })
            }} />
    ), [])
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                {/* <View style={{ flex: 1, }}>
            {
                renderTopheader()
            }

        </View> */}

                {renderSearchBar()}
                <View style={{ flex: 1, }}>
                    {error && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={styles.errorMsgText}>{errorMsg}</Text>
                        </View>
                    )}
                    {ProductList.length > 0 && (
                        <FlatList
                            style={{ padding: 10 }}
                            nestedScrollEnabled={true}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            data={ProductList}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }) => renderItem(item, index)}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={false}
                            ListFooterComponent={loadmoreBtn && <LoadMoreBtn totalPages={totalPages} pageIndex={pageIndex} OnloadMore={() => {
                                setIsPageIndex(pageIndex => pageIndex + 1);
                                setIsPayloadChanged(!isPalylaod);
                            }} />}
                        />
                    )}
                </View>
            </Appscreen>
        </>
    )
}

export default ProductList

const styles = StyleSheet.create({
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
    errorMsgText: {
        color: COLORS.titleColor,
        opacity: 0.7,
        fontFamily: Font.RalewaySemiBold,
        letterSpacing: 1.2,
        fontSize: 14,
        padding: 5,
        textAlign: 'center',

    },

})
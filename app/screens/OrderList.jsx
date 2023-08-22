import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList } from 'react-native'
import React, { useLayoutEffect, useState, useEffect, useReducer } from 'react'
import Icon, { Icons } from '../components/Icons';
import { COLORS } from '../constant';
import FilterIcon from '../components/global/FilterIcon';
import { Appscreen, Loader } from '../components/global';
import OrderFilterModal from './Model/OrderFilterModal';
import Font from '../config/CustomFont';
import GlobalStyle from '../styles/GlobalStyle';

//WEB API
import useApi from '../hooks/useApi';
import { storeApi, orderApi } from '../api';
import storage from '../auth/storage';
import StoreModal from './StoreModal';
import { PAGE_SIZE } from '../constant/constan';
import OrderItem from '../components/items/OrderItem';
import LoadMoreBtn from '../components/global/LoadMoreBtn';

const payload = [{
    "field": "",
    "operator": 0,
    "value": ""
}];

function reducerFun(state, action) {
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
const OrderList = ({ navigation }) => {

    //reducer 
    const [state, dispatch] = useReducer(reducerFun, payload);

    const [isPalylaod, setIsPayloadChanged] = useState(false);
    //Morefilter
    const [filterCount, setIsFilterCount] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    //Search Modal
    const [visible, setIsvisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimer, setSearchTimer] = useState(null);
    //store
    const [storeId, setIsStoreId] = useState(null);
    const [storeName, setIsStoreName] = useState('');
    const [storeList, setIsStoreList] = useState([]);
    //Order list
    const [orderList, setIsOrderList] = useState([]);
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
    const getOrderApi = useApi(orderApi.getOrderlistBystoreId);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<FilterIcon filterCount={filterCount} onPress={() => openMoreFilterModal()} />),
        });
        return function cleanup() {

        }
    }, [filterCount]);
    useEffect(() => {
        getstorelistFromserver();
        return function cleanup() {
            //clearStateValue();
            console.log('clean up called');
        }
    }, []);
    useEffect(() => {
        if (storeId != null) {
            loadOrderlistbystoreId();
        }
        return function cleanup() {
        }
    }, [isPalylaod]);
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
    const loadOrderlistbystoreId = async () => {
        setIsError(false);
        setIsErrorMsg('');
        const params = {
            "pageSearchArgs": {
                "pageIndex": pageIndex,
                "pageSize": PAGE_SIZE,
                "filteringOptions": state
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
                setIstotalCount(mydata['totalCount']);
                setIstotalPages(mydata['totalPages']);
                const items = mydata['items'];
                if (items.length > 0) {
                    setIsError(false);
                    setIsErrorMsg('');
                    setIsOrderList([...orderList, ...items]);
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
    const clearStateValue = () => {
        setIsPageIndex(1);
        setIsFilterCount(0);
        setIsOrderList([]);
        setIsLoadmoreBtn(false);
        setIsStoreId(null);
        setIsError(false);
        setIsErrorMsg('');
    };
    const openMoreFilterModal = () => {
        setIsModalVisible(!isModalVisible);

    }
    const applyFilter = (params) => {

        resetFilterField();
        dispatch({ type: 'CHANGED', params });
        setIsPayloadChanged(!isPalylaod);
    }
    const clearFilter = () => {


        setIsFilterCount(0);
        resetFilterField();
        const params = [{
            "field": "",
            "operator": 0,
            "value": ""
        }]

        dispatch({ type: 'CHANGED', params });
        setIsPayloadChanged(!isPalylaod);
    }
    const resetFilterField = () => {
        setIsModalVisible(!isModalVisible);
        setIsOrderList([]);
        setIsPageIndex(1);
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
                        onChangeText={(query) => {
                            if (searchTimer) {
                                clearTimeout(searchTimer);
                            }
                            setSearchQuery(query);
                            setSearchTimer(setTimeout(() => {
                                setIsOrderList([]);
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
                            setIsOrderList([]);
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
                        <Icon type={Icons.Ionicons} name={'chevron-forward-sharp'} size={18} color={COLORS.lightText} />
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

                            const params = [{ "field": "", "operator": 0, "value": "" }]
                            dispatch({ type: 'CHANGED', params });
                            setIsPayloadChanged(!isPalylaod);
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
                {renderSearchBar()}
                <View style={{ flex: 1 }}>
                    {error && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={styles.errorMsgText}>{errorMsg}</Text>
                        </View>
                    )}
                    {orderList.length > 0 && (
                        <FlatList
                            style={{ padding: 10 }}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            data={orderList}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }) => {
                                return <OrderItem item={item} onPress={() => navigation.navigate('Orderdetails', { 'order': item })} />
                            }}
                            refreshing={refreshing}
                            onRefresh={() => {
                                console.log('onRefeshing');
                            }}
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
            {
                storeList.length > 0 && <OrderFilterModal
                    isVisible={isModalVisible}
                    onClose={() => setIsModalVisible(!isModalVisible)}
                    onApply={(params) => {
                        setIsFilterCount(params['count']);
                        applyFilter(params['payload'])
                    }}
                    onClear={() => clearFilter()}
                    storeId={storeId} />
            }
        </>
    )
}

export default OrderList

const styles = StyleSheet.create({
    textInput: {
        paddingVertical: 0,
        flex: 1,
        color: COLORS.titleColor,
        fontFamily: Font.RalewayRegular,
        fontSize: 15,
        letterSpacing: 1.2
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
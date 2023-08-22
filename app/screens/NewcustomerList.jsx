import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native'
import React, { useEffect, useState, useLayoutEffect, useReducer, useCallback } from 'react'
import { Appscreen, Loader } from '../components/global'
import { COLORS } from '../constant';
import GlobalStyle from '../styles/GlobalStyle';
import Icon, { Icons } from '../components/Icons';
import Font from '../config/CustomFont';
import StoreModal from './StoreModal';
import storage from '../auth/storage';
import useApi from '../hooks/useApi';
import { storeApi, customerApi } from '../api';
import FilterIcon from '../components/global/FilterIcon';
import LoadMoreBtn from '../components/global/LoadMoreBtn';
import { PAGE_SIZE } from '../constant/constan';
import { CustItem } from '../components/customer';
import CustomerFilter from './Model/CustomerFilter';

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
const NewcustomerList = ({ navigation }) => {

    const [state, dispatch] = useReducer(reducer, payload);
    const [isPalylaod, setIsPayloadChanged] = useState(false);

    //Search Modal
    const [visible, setIsvisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimer, setSearchTimer] = useState(null);

    //store
    const [storeId, setIsStoreId] = useState(null);
    const [storeName, setIsStoreName] = useState('');
    const [storeList, setIsStoreList] = useState([]);

    //Customer list
    const [customerList, setIsCustomerList] = useState([]);
    const [pageIndex, setIsPageIndex] = useState(1);
    const [loadmoreBtn, setIsLoadmoreBtn] = useState(false);
    const [totalPages, setIstotalPages] = useState(0);
    const [totalCount, setIstotalCount] = useState(0);

    //Loader and Error
    const [isLoader, setIsLoader] = useState(false);
    const [errorMsg, setIsErrorMsg] = useState('');
    const [error, setIsError] = useState(false);

    //Morefilter
    const [filterCount, setIsFilterCount] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);

    //WEB API
    const getStorelistApi = useApi(storeApi.getStorelist);
    const getcustlistApi = useApi(customerApi.getCustomerlist);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (<FilterIcon filterCount={filterCount} onPress={() => openMoreFilterModal()} />),
        });
        return function cleanup() {

        }

    }, [filterCount]);
    useEffect(() => {
        getStorelist();
        return function cleanup() {
            clearStateValue();
        }
    }, []);
    useEffect(() => {
        if (storeId != null) {
            loadcustomerlistbystoreId();
        }
        return function cleanup() {
        }
    }, [isPalylaod]);
    const getStorelist = async () => {

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
                        const params = [{ "field": "storeId", "operator": 1, "value": storeValue }];
                        dispatch({ type: 'CHANGED', params });
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
    const loadcustomerlistbystoreId = async () => {
        const params = {
            "args": {
                "pageIndex": pageIndex,
                "pageSize": PAGE_SIZE,
                "filteringOptions": state
            },
        }
        setIsLoader(true);
        const response = await getcustlistApi.request(params);
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
                    setIsCustomerList([...customerList, ...items]);
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
        setIsStoreId(null);
        setIsCustomerList([]);
        setIsFilterCount(0)
        setIsLoadmoreBtn(false);
        setIsError(false);
        setIsErrorMsg('');
    };
    const clearFilter = () => {

        setIsFilterCount(0);
        resetFilterField();
        const params = [{ "field": "storeId", "operator": 1, "value": storeId }];
        dispatch({ type: 'CHANGED', params });
        setIsPayloadChanged(!isPalylaod);
    };
    const applyFilter = (params) => {
        resetFilterField();
        dispatch({ type: 'CHANGED', params });
        setIsPayloadChanged(!isPalylaod);
    }
    const resetFilterField = () => {
        setIsModalVisible(!isModalVisible);
        setIsCustomerList([]);
        setIsPageIndex(1);
    }
    const openMoreFilterModal = () => {
        setIsModalVisible(true);
    }

    const renderSearchBar = () => (
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
                    autoCapitalize='none'
                    autoCorrect={false}
                    value={searchQuery}
                    onChangeText={(query) => {
                        if (searchTimer) {
                            clearTimeout(searchTimer);
                        }
                        setSearchQuery(query);
                        setSearchTimer(setTimeout(() => {
                            setIsCustomerList([]);
                            setIsPageIndex(1);
                            const params = [{ "field": "global", "operator": 0, "value": query }, { "field": "storeId", "operator": 1, "value": storeId }]
                            dispatch({ type: 'CHANGED', params });
                            setIsPayloadChanged(!isPalylaod);
                        }, 1000),);
                    }
                    }
                />
                {
                    searchQuery == '' ? null : <TouchableOpacity onPress={() => {
                        setSearchQuery('');
                        setIsCustomerList([]);
                        setIsPageIndex(1);
                        const params = [{ "field": "storeId", "operator": 1, "value": storeId }];
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
                        const params = [{ "field": "storeId", "operator": 1, "value": item.value }];
                        dispatch({ type: 'CHANGED', params });
                        setIsPayloadChanged(!isPalylaod);
                    }
                    }
                    selectedStore={storeName}
                    onClose={() => setIsvisible(false)} />
            }
        </View>
    );
    const renderItem = useCallback((item, index) => (

        <CustItem item={item} onPress={() => navigation.navigate('customerDetail', { 'customerId': item.id })} />

    ), []);
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
                    {customerList.length > 0 && (
                        <FlatList
                            style={{ padding: 10 }}
                            nestedScrollEnabled={true}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            data={customerList}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item, index }) => renderItem(item, index)}
                            showsVerticalScrollIndicator={false}
                            removeClippedSubviews={false}
                            maxToRenderPerBatch={50}
                            initialNumToRender={50}
                            ListFooterComponent={loadmoreBtn && <LoadMoreBtn totalPages={totalPages} pageIndex={pageIndex} OnloadMore={() => {
                                setIsPageIndex(pageIndex => pageIndex + 1);
                                setIsPayloadChanged(!isPalylaod);
                            }} />}
                        />
                    )}
                </View>

            </Appscreen>
            {
                storeList.length > 0 && <CustomerFilter
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

export default NewcustomerList

const styles = StyleSheet.create({
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
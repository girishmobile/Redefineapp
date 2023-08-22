import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, useReducer, useCallback, useLayoutEffect } from 'react'
import { Appscreen, Loader } from '../components/global';
import useApi from '../hooks/useApi';
import { promotionApi, storeApi } from '../api';
import GlobalStyle from '../styles/GlobalStyle';
import { PAGE_SIZE } from '../constant/constan';
import LoadMoreBtn from '../components/global/LoadMoreBtn';
import PromotionItem from '../components/items/PromotionItem';
import { COLORS } from '../constant';
import Icon, { Icons } from '../components/Icons';
import Font from '../config/CustomFont';
import storage from '../auth/storage';
import StoreModal from './StoreModal';
import FilterIcon from '../components/global/FilterIcon';
import PromotionModal from './Model/PromotionModal';

const payload = [{
    "field": "storeId",
    "operator": 0,
    "value": "0"
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
const MasterPromotions = ({ navigation }) => {

    const [state, dispatch] = useReducer(reducer, payload);
    const [isPalylaod, setIsPayloadChanged] = useState(false);
    //Search Modal
    const [visible, setIsvisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchTimer, setSearchTimer] = useState(null);
    //store
    const [storeId, setIsStoreId] = useState(null);
    const [storeName, setIsStoreName] = useState('');
    const [prevStoreName, setIsPrevStoreName] = useState('');
    const [storeList, setIsStoreList] = useState([]);

    //Loader and Error
    const [isLoader, setIsLoader] = useState(false);
    const [errorMsg, setIsErrorMsg] = useState('');
    const [error, setIsError] = useState(false);
    const [promotionList, setIsPromotionList] = useState([]);
    //List
    const [pageIndex, setIsPageIndex] = useState(1);
    const [loadmoreBtn, setIsLoadmoreBtn] = useState(false);
    const [totalPages, setIstotalPages] = useState(0);
    const [totalCount, setIstotalCount] = useState(0);
    //Morefilter
    const [filterCount, setIsFilterCount] = useState(0);
    const [isModalVisible, setIsModalVisible] = useState(false);
    //WEB API
    const getPromotionApi = useApi(promotionApi.getPromotionList);
    const getStorelistApi = useApi(storeApi.getStorelist);
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
                        setIsPrevStoreName(storeName);
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
    const openMoreFilterModal = () => {

        setIsModalVisible(!isModalVisible);
    }
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
            //clearStateValue();
        }
    }, []);
    useEffect(() => {
        if (storeId != null) {
            loadPromotionslist();
        }
        return function cleanup() {
        }
    }, [isPalylaod]);
    const clearStateValue = () => {

        setIsPageIndex(1);
        setIsStoreId(null);
        setIsPromotionList([]);
        setIsFilterCount(0)
        setIsLoadmoreBtn(false);
        setIsError(false);
        setIsErrorMsg('');
    };
    const clearFilter = () => {
        setIsFilterCount(0);
        resetFilterField();
        setIsStoreName(prevStoreName);

        const params = [{ "field": "storeId", "operator": 1, "value": storeId }];
        dispatch({ type: 'CHANGED', params });
        setIsPayloadChanged(!isPalylaod);
    };
    const applyFilter = (params) => {
        resetFilterField();
        setIsStoreName('All Stores')
        dispatch({ type: 'CHANGED', params });
        setIsPayloadChanged(!isPalylaod);
    }
    const resetFilterField = () => {
        setIsModalVisible(!isModalVisible);
        setIsPromotionList([]);
        setIsPageIndex(1);
    }
    const loadPromotionslist = async () => {
        const params = {
            "args": {
                "pageIndex": pageIndex,
                "pageSize": PAGE_SIZE,
                "filteringOptions": state
            },
        }
        setIsLoader(true);
        const response = await getPromotionApi.request(params);

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
                    setIsPromotionList([...promotionList, ...items]);
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
            console.log('something went wrong...');
        }
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
                            setIsPromotionList([]);
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
                        setIsPromotionList([]);
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
        <PromotionItem item={item} onPress={() => navigation.navigate('PromotionDetail', { 'item': item })} />
    ), []);
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                {renderSearchBar()}
                <View style={styles.container}>
                    {error && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={GlobalStyle.errorTextMsg}>{errorMsg}</Text>
                        </View>
                    )}
                    {promotionList.length > 0 && (
                        <FlatList
                            style={{ padding: 10 }}
                            nestedScrollEnabled={true}
                            contentContainerStyle={{ paddingBottom: 20 }}
                            data={promotionList}
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
                storeList.length > 0 && <PromotionModal
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

export default MasterPromotions
const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})
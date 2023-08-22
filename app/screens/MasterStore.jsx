import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appscreen, Loader } from '../components/global';
import useApi from '../hooks/useApi';
import { masterApi } from '../api';
import storage from '../auth/storage';
import GlobalStyle from '../styles/GlobalStyle';
import { COLORS } from '../constant';
import Font from '../config/CustomFont';
import Drawline from '../components/global/Drawline';

//https://admin-staging.parsonskellogg.services/Promotion/list.json

const MasterStore = () => {

    ///jhkhkhkhhkhkhk
    //Loader and Error
    const [isLoader, setIsLoader] = useState(false);
    const [errorMsg, setIsErrorMsg] = useState('');
    const [error, setIsError] = useState(false);
    const [storeData, setIsStoreData] = useState([]);
    const [storeBuilder, setIsStoreBuilder] = useState(null);
    const [formBuilder, setIsFormBuilder] = useState(null);

    const getStorelistApi = useApi(masterApi.getStorebuilderlist);

    const getCorporateApi = useApi(masterApi.getCorporateAndEcommercedata);
    const getStoreBuilderApi = useApi(masterApi.getStoreBuilderdata);
    const getFromBuilderApi = useApi(masterApi.getFormBuilderdata);

    useEffect(() => {
        // loadMasterStorelist();
        loadCorporateAndEcommerce();
        loadStoreBuilder();
        loadFormBuilder();
    }, []);

    const loadCorporateAndEcommerce = async () => {
        setIsLoader(true);
        const response = await getCorporateApi.request();
        setIsLoader(false);
        if (!response.ok) {
            setIsError(true);
            setIsErrorMsg('Oops, something went wrong.\nPlease try again later');
            return;
        }
        else if (response['data'] != null) {
            const mydata = response['data'];
            if (mydata['data'] != null) {
                const store = mydata['data'];
                setIsStoreData(store);

            }

        }
        else {
            setIsError(true);
            setIsErrorMsg('An unexpected error occurred.');
        }
    }
    const loadStoreBuilder = async () => {

        setIsLoader(true);
        const response = await getStoreBuilderApi.request();
        setIsLoader(false);
        if (!response.ok) {
            setIsError(true);
            setIsErrorMsg('Oops, something went wrong.\nPlease try again later');
            return;
        }
        else if (response['data'] != null) {
            const mydata = response['data'];
            if (mydata['data'] != null) {

                setIsStoreBuilder(mydata['data']);

            }

        }
        else {
            setIsError(true);
            setIsErrorMsg('An unexpected error occurred.');
        }
    }
    const loadFormBuilder = async () => {

        setIsLoader(true);
        const response = await getFromBuilderApi.request();
        setIsLoader(false);
        if (!response.ok) {
            setIsError(true);
            setIsErrorMsg('Oops, something went wrong.\nPlease try again later');
            return;
        }
        else if (response['data'] != null) {
            const mydata = response['data'];
            if (mydata['data'] != null) {
                setIsFormBuilder(mydata['data']);

            }

        }
        else {
            setIsError(true);
            setIsErrorMsg('An unexpected error occurred.');
        }
    }

    const loadMasterStorelist = async () => {
        setIsLoader(true);
        await storage.getUser(async (user) => {
            const { isSuperUser, userId } = user;
            if (isSuperUser === true) {
                const params = { "userid": userId, "companyConfigurationId": 1, "isSuperUser": isSuperUser }
                const response = await getStorelistApi.request(params);
                setIsLoader(false);
                if (!response.ok) {
                    setIsError(true);
                    setIsErrorMsg('Oops, something went wrong.\nPlease try again later');
                    return;
                }
                else if (response['data'] != null) {
                    const mydata = response['data'];
                    if (mydata['data'] != null) {
                        //setIsStoreData(mydata['data']);
                        const storeArray = mydata['data'];
                        const stores = [];
                        const initialValue = 0;
                        storeArray.reduce((r, s) => {
                            stores.push({ title: s.storeTypeName, storeTypeId: s.storeTypeId, data: s.store });
                            return r;
                        }, initialValue);
                        setIsStoreData(stores);
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
        });

    }
    const renderSectionheader = (item, index) => {

        if (item != null) {
            return (
                <View style={styles.section} key={index.toString()}>
                    <Text style={styles.title}>{item['name']}</Text>
                    <View style={{ marginTop: 10 }}>
                        <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
                            <Text style={[styles.subText, { width: 120, paddingLeft: 5 }]}>PRODUCT</Text>
                            <Text style={[styles.subText, { flex: 1, fontSize: 15 }]}>{item['totalProduct']}</Text>
                        </View>
                        <Drawline />
                        <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
                            <Text style={[styles.subText, { width: 120, paddingLeft: 5 }]}>BRAND</Text>
                            <Text style={[styles.subText, { flex: 1, fontSize: 15 }]}>{item['brand']}</Text>
                        </View>
                        <Drawline />
                        <View style={{ flexDirection: 'row', marginBottom: 2, marginTop: 10 }}>
                            <Text style={[styles.subText, { width: 120, paddingLeft: 5 }]}>VENDOR</Text>
                            <Text style={[styles.subText, { flex: 1, fontSize: 15 }]}>{item['vendor']}</Text>
                        </View>

                    </View>
                </View>
            )
        }
        else {
            return <View key={index.toString()} />
        }



    }
    const renderStoreBuilder = () => {

        const activeStores = storeBuilder['activeStores'];
        const inActiveStores = storeBuilder['inActiveStores'];
        const totalStores = storeBuilder['totalStores'];

        return (
            <View style={styles.section}>
                <Text style={styles.title}>{'Store Builder'}</Text>
                <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
                        <Text style={[styles.subText, { width: 120, paddingLeft: 5 }]}>ACTIVE</Text>
                        <Text style={[styles.subText, { flex: 1, fontSize: 15 }]}>{activeStores['count']}</Text>
                    </View>
                    <Drawline />
                    <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
                        <Text style={[styles.subText, { width: 120, paddingLeft: 5 }]}>INACTIVE</Text>
                        <Text style={[styles.subText, { flex: 1, fontSize: 15 }]}>{inActiveStores['count']}</Text>
                    </View>
                    <Drawline />
                    <View style={{ flexDirection: 'row', marginBottom: 2, marginTop: 10 }}>
                        <Text style={[styles.subText, { width: 120, paddingLeft: 5 }]}>TOTAL STORES</Text>
                        <Text style={[styles.subText, { flex: 1, fontSize: 15 }]}>{totalStores['count']}</Text>
                    </View>
                </View>
            </View>
        )
    }
    const renderFormBuilder = () => {

        const activeForms = formBuilder['activeForms'];
        const inActiveForms = formBuilder['inActiveForms'];
        const totalForms = formBuilder['totalForms'];

        return (
            <View style={styles.section}>
                <Text style={styles.title}>{'Form Builder'}</Text>
                <View style={{ marginTop: 10 }}>
                    <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
                        <Text style={[styles.subText, { width: 120, paddingLeft: 5 }]}>ACTIVE</Text>
                        <Text style={[styles.subText, { flex: 1, fontSize: 15 }]}>{activeForms['count']}</Text>
                    </View>
                    <Drawline />
                    <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
                        <Text style={[styles.subText, { width: 120, paddingLeft: 5 }]}>INACTIVE</Text>
                        <Text style={[styles.subText, { flex: 1, fontSize: 15 }]}>{inActiveForms['count']}</Text>
                    </View>
                    <Drawline />
                    <View style={{ flexDirection: 'row', marginBottom: 2, marginTop: 10 }}>
                        <Text style={[styles.subText, { width: 120, paddingLeft: 5 }]}>TOTAL FORMS</Text>
                        <Text style={[styles.subText, { flex: 1, fontSize: 15 }]}>{totalForms['count']}</Text>
                    </View>
                </View>
            </View>
        )
    }
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                <View style={{ flex: 1, }}>
                    {error && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={GlobalStyle.errorTextMsg}>{errorMsg}</Text>
                        </View>
                    )}
                    {
                        storeData.length > 0 && <ScrollView style={{ padding: 10 }}>
                            {
                                storeData.map((item, index) => (
                                    renderSectionheader(item, index)
                                ))
                            }
                            {
                                storeBuilder != null && renderStoreBuilder()
                            }
                            {
                                formBuilder != null && renderFormBuilder()
                            }
                        </ScrollView>
                    }

                </View>
            </Appscreen>
        </>
    )
}

export default MasterStore

const styles = StyleSheet.create({

    item: {
        backgroundColor: COLORS.primary,
        padding: 10,
        marginVertical: 5,
        borderColor: COLORS.borderColor,
        borderWidth: 1,
        borderRadius: 4,
        marginHorizontal: 5,
    },
    section: {
        backgroundColor: COLORS.primary,
        padding: 10,
        borderColor: COLORS.borderColor,
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
    },
    title: {
        fontSize: 17,
        fontFamily: Font.RalewaySemiBold,
        letterSpacing: 1.2,
        color: COLORS.titleColor,
        textAlign: 'center',
        flex: 1,
        backgroundColor: COLORS.textBgcolor,
        padding: 10,
        borderColor: COLORS.borderColor,
        borderWidth: 0.75,

    },
    subText: {
        fontSize: 13,
        fontFamily: Font.RalewaySemiBold,
        letterSpacing: 1.2,
        color: COLORS.titleColor,
        opacity: 0.9,

    },
});

// const totalProduct = storeArray.reduce((prevValue, currentValue) => prevValue + currentValue.totalProduct,
// 0);
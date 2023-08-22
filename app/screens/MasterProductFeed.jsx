import { SectionList, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appscreen, Loader } from '../components/global'
import storage from '../auth/storage';
import useApi from '../hooks/useApi';
import { masterApi } from '../api';
import GlobalStyle from '../styles/GlobalStyle';
import Font from '../config/CustomFont';
import { COLORS } from '../constant';
import Drawline from '../components/global/Drawline';
import FastImageView from '../components/global/FastImageView';
import FastImageLogo from '../components/global/FastImageLogo';



const MasterProductFeed = () => {

    //Loader and Error
    const [isLoader, setIsLoader] = useState(false);
    const [errorMsg, setIsErrorMsg] = useState('');
    const [error, setIsError] = useState(false);

    const [storeData, setIsStoreData] = useState([]);
    const getStorelistApi = useApi(masterApi.getStorebuilderlist);

    useEffect(() => {
        loadMasterStorelist();
    }, []);
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
                            stores.push({ title: s.storeTypeName, data: s.store });
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
    const renderSectionheader = (title) => {

        return (
            <View style={styles.section}>
                <Text style={styles.title}>{title}</Text>

            </View>
        )
    }
    const renderItem = (item) => {

        return (
            <View style={styles.item}>
                <FastImageLogo imageUrl={item['emailLogo']} />


                <View style={{ marginTop: 10, backgroundColor: COLORS.textBgcolor, padding: 10, borderColor: COLORS.borderColor, borderWidth: 0.75 }}>
                    <View style={{ marginVertical: 10 }}>
                        <Text style={[styles.subText, { fontSize: 15, opacity: 1 }]}>{item['name']}</Text>
                    </View>
                    <Drawline />
                    <View style={{ paddingTop: 10 }}>

                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={[styles.subText, { width: 120, marginRight: 5 }]}>{`Active Product`}</Text>
                            <Text style={[styles.subText,]}>{`${item['activeProduct']}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={[styles.subText, { width: 120, marginRight: 5 }]}>{`Inactive Product`}</Text>
                            <Text style={[styles.subText,]}>{`${item['inActiveProduct']}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={[styles.subText, { width: 120, marginRight: 5 }]}>{`Order`}</Text>
                            <Text style={styles.subText}>{`${item['order']}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={[styles.subText, { width: 120, marginRight: 5 }]}>{`Active Brand`}</Text>
                            <Text style={styles.subText}>{`${item['activeBrand']}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={[styles.subText, { width: 120, marginRight: 5 }]}>{`Active Category`}</Text>
                            <Text style={styles.subText}>{`${item['activeCategory']}`}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginBottom: 5 }}>
                            <Text style={[styles.subText, { width: 120, marginRight: 5 }]}>{`Total Products`}</Text>
                            <Text style={styles.subText}>{`${item['totalProduct']}`}</Text>
                        </View>
                    </View>


                </View>
            </View>
        );
    }
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                <View style={{ flex: 1 }}>
                    {error && (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                            <Text style={GlobalStyle.errorTextMsg}>{errorMsg}</Text>

                        </View>
                    )}
                    {
                        <SectionList
                            style={{ margin: 10 }}
                            sections={storeData}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({ item }) => renderItem(item)}
                            renderSectionHeader={({ section: { title } }) => renderSectionheader(title)}
                        />
                    }

                </View>
            </Appscreen>
        </>
    )
}

export default MasterProductFeed

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
        fontSize: 12,
        fontFamily: Font.RalewaySemiBold,
        letterSpacing: 1.2,
        color: COLORS.titleColor,
        opacity: 0.9,

    },
})
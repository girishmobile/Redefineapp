import { StyleSheet, Text, View, Modal, TouchableOpacity, ScrollView, FlatList, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useHeaderHeight } from '@react-navigation/elements';

import Icon, { Icons } from '../components/Icons'
import Font from '../config/CustomFont';
import { COLORS } from '../constant';
import CheckBoxItem from '../components/global/CheckBoxItem';
//WEB API
import useApi from '../hooks/useApi';
import { productApi } from '../api';
import { Loader } from '../components/global';
import RadioButton from '../components/global/RadioButton';

const statusData = [
    { id: 1, label: 'Active', isSelected: false },
    { id: 2, label: 'Inactive', isSelected: false },
    { id: 3, label: 'Draft', isSelected: false }
];

const CustomModal = ({ isVisible, onClose, storeId, onApply, onClear }) => {

    const headerHeight = useHeaderHeight();
    const [openBrand, setIsOpenBrand] = useState(false);
    const [openCategory, setIsOpenCategory] = useState(false);
    const [openStatus, setIsOpenStatus] = useState(false);
    const [Brand, setIsBrand] = useState(null);
    const [Category, setIsCategory] = useState(null);

    const [recStatusValue, setIsRecStatusValue] = useState('');
    const [recStatus, setIsRecStatus] = useState('');
    //API
    const getDropdownApi = useApi(productApi.getDropdowntable);
    const getCategoryApi = useApi(productApi.getCategorylistBystoreId);
    const [isLoader, setIsLoader] = useState(false);
    const [isLoadercategory, setIsLoaderCategory] = useState(false);
    //filter handler
    useEffect(() => {
        setIsBrand(null);
        setIsCategory(null);
        setIsOpenBrand(false);
        setIsOpenCategory(false);
        setIsOpenStatus(false);
        setIsRecStatus('');
        setIsRecStatusValue('');

    }, [storeId]);

    const Drawline = () => (
        <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.borderColor }}></View>
    );
    const getCategoryList = async () => {
        setIsOpenCategory(!openCategory);
        if (!openCategory) {
            if (Category == null) {
                setIsLoaderCategory(true);
                const response = await getCategoryApi.request(storeId);
                setIsLoaderCategory(false);
                if (response['data'] != null) {
                    const mydata = response['data'];
                    if (mydata['data'] != null) {
                        const mybrand = mydata['data'];
                        mybrand.map((item) => item['isAdd'] = false)
                        setIsCategory(mybrand);
                    }
                }
            }
        }
    }
    const getBrandList = async () => {
        setIsOpenBrand(!openBrand);
        if (!openBrand) {
            if (Brand == null) {
                const params = {
                    "table": "storeBrand",
                    "isFetchAll": false,
                    "storeId": storeId
                }
                setIsLoader(true);
                const response = await getDropdownApi.request(params);
                setIsLoader(false);
                if (response['data'] != null) {
                    const mydata = response['data'];
                    if (mydata['data'] != null) {
                        const mybrand = mydata['data'];
                        mybrand.map((item) => item['isAdd'] = false)
                        setIsBrand(mybrand)

                    }
                }
            }

        }

    }
    const checkedBrand = (index) => {
        const values = [...Brand];
        values[index].isAdd = !values[index].isAdd;
        setIsBrand(values);
    }
    const checkedCategory = (index) => {
        const values = [...Category];
        values[index].isAdd = !values[index].isAdd;
        setIsCategory(values);
    }
    const onSelectedStatus = (recValue) => {

        setIsRecStatusValue(recValue);

        let recText = '';
        switch (recValue) {
            case "Active":
                recText = "A";
                break;
            case "Inactive":
                recText = "I";
                break;
            case "Draft":
                recText = "D";
                break;
            default:
                break;
        }
        setIsRecStatus(recText);


    }
    const renderBrand = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => getBrandList()} style={styles.touchContainer}>
                    <Text style={styles.titleText}>Brand</Text>
                    <Icon type={Icons.Ionicons} name={openBrand ? 'ios-chevron-down-outline' : 'ios-chevron-forward-sharp'} size={22} color={COLORS.lightText} />
                </TouchableOpacity>
                {openBrand &&
                    <>
                        <Drawline />
                        <Loader visible={isLoader} />
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                            {
                                Brand && <FlatList
                                    scrollEnabled={false}
                                    data={Brand}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => <CheckBoxItem title={item.label} isselected={item.isAdd} onPress={() => {
                                        checkedBrand(index);

                                    }} />}
                                />
                            }
                        </View>
                    </>
                }
            </View>
        );
    }
    const renderCategory = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => getCategoryList()} style={styles.touchContainer}>
                    <Text style={styles.titleText}>Category</Text>
                    <Icon type={Icons.Ionicons} name={openCategory ? 'ios-chevron-down-outline' : 'ios-chevron-forward-sharp'} size={22} color={COLORS.lightText} />
                </TouchableOpacity>
                {openCategory &&
                    <>
                        <Drawline />
                        <Loader visible={isLoadercategory} />
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                            {
                                Category && <FlatList
                                    scrollEnabled={false}
                                    data={Category}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => <CheckBoxItem title={item.label} isselected={item.isAdd} onPress={() => { checkedCategory(index) }} />}
                                />
                            }
                        </View>
                    </>
                }
            </View>
        );
    }
    const renderStatus = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => setIsOpenStatus(!openStatus)} style={styles.touchContainer}>
                <Text style={styles.titleText}>Status</Text>
                <Icon type={Icons.Ionicons} name={openStatus ? 'ios-chevron-down-outline' : 'ios-chevron-forward-sharp'} size={22} color={COLORS.lightText} />
            </TouchableOpacity>
            {openStatus && <>
                <Drawline />
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                    <RadioButton
                        data={statusData}
                        isSelected={recStatusValue}
                        onSelected={(recValue) => onSelectedStatus(recValue)}
                        onClear={() => clearStatus()} />

                </View>
            </>}
        </View>
    );
    const applyFilter = async () => {

        let filterPayload = [];
        let filterCounter = 0;
        let brandValues = '';
        let categoryValues = '';
        if (Brand != null) {
            let newValue = [];
            const selectedBrand = Brand.filter(item => item.isAdd === true);
            selectedBrand.map((item) => {
                newValue.push(`${item['value']}`);
            })
            filterCounter = filterCounter + newValue.length;
            brandValues = (newValue.toString());
            if (brandValues.length > 0) {
                filterPayload.push({
                    "field": "brandId",
                    "operator": 1,
                    "value": brandValues
                })
            }
        }
        if (Category != null) {
            let newValue = [];
            const selectedCategory = Category.filter(item => item.isAdd === true);
            selectedCategory.map((item) => {
                newValue.push(`${item['value']}`);
            })
            filterCounter = filterCounter + newValue.length;
            categoryValues = (newValue.toString());
            if (categoryValues.length > 0) {
                filterPayload.push({
                    "field": "categoryId",
                    "operator": 1,
                    "value": categoryValues
                })
            }

        }
        if (recStatus != '') {

            filterCounter = filterCounter + 1;

            filterPayload.push({
                "field": "recStatus",
                "operator": 0,
                "value": recStatus
            })
        }
        if (filterPayload.length > 0) {
            const params = {
                "payload": filterPayload,
                "count": filterCounter
            }
            onApply(params);
        }
    }
    const generateFilterPayload = () => {

        let filterPayload = [];
        let filterCounter = 0;
        let brandValues = '';
        let categoryValues = '';
        if (Brand != null) {
            let newValue = [];
            const selectedBrand = Brand.filter(item => item.isAdd === true);
            selectedBrand.map((item) => {
                newValue.push(`${item['value']}`);
            })
            filterCounter = filterCounter + newValue.length;
            brandValues = (newValue.toString());
            if (brandValues.length > 0) {
                filterPayload.push({
                    "field": "brandId",
                    "operator": 1,
                    "value": brandValues
                })
            }
        }
        if (Category != null) {
            let newValue = [];
            const selectedCategory = Category.filter(item => item.isAdd === true);
            selectedCategory.map((item) => {
                newValue.push(`${item['value']}`);
            })
            filterCounter = filterCounter + newValue.length;
            categoryValues = (newValue.toString());
            if (categoryValues.length > 0) {
                filterPayload.push({
                    "field": "categoryId",
                    "operator": 1,
                    "value": categoryValues
                })
            }

        }
        if (recStatus != '') {
            filterPayload.push({
                "field": "recStatus",
                "operator": 0,
                "value": recStatus

            })
        }

        return filterPayload;
    }
    const clearStatus = () => {

        setIsRecStatus('');
        setIsRecStatusValue('');
        const fpayload = generateFilterPayload();

    }
    const clearFilter = () => {
        setIsBrand(null);
        setIsCategory(null);
        setIsOpenBrand(false);
        setIsOpenCategory(false);
        setIsOpenStatus(false);
        setIsRecStatus('');
        setIsRecStatusValue('');
        onClear();
    }
    const renderFooter = () => {
        return (
            <View style={{
                backgroundColor: COLORS.primary, marginLeft: 20, marginRight: 20, marginBottom: 20, borderRadius: 4,
                borderWidth: 0.75,
                borderColor: COLORS.borderColor,
                justifyContent: 'space-between',
                alignItems: 'center',
                flexDirection: 'row',
                padding: 10
            }}>
                <View style={{ padding: 10, alignSelf: 'center', backgroundColor: '#fff', borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                    <TouchableOpacity onPress={() => clearFilter()}>
                        <Text style={styles.titleText}>Clear</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10, alignSelf: 'center', backgroundColor: 'rgba(112, 212, 75,1)', borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                    <TouchableOpacity onPress={() => applyFilter()}>
                        <Text style={[styles.titleText, { color: '#fff' }]}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    const closeModal = () => {
        onClose();
    }
    return (
        <Modal animationType='fade' transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', }}>
                <View style={{ height: '100%', width: '70%', backgroundColor: '#fff', alignSelf: 'flex-end', }}>
                    <View style={{ height: headerHeight, justifyContent: 'flex-end' }}>
                        <View style={{ height: 44, paddingLeft: 20, paddingRight: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ flex: 1, textAlign: 'center', fontFamily: Font.RalewaySemiBold, fontSize: 16, letterSpacing: 1.2, color: COLORS.lightText, }}>{'More Filter'}</Text>
                            <TouchableOpacity onPress={() => closeModal()}>
                                <Icon type={Icons.Ionicons} name={'ios-close-outline'} size={30} color={COLORS.lightText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Drawline />
                    <ScrollView style={styles.modalContainer}>
                        <View style={{ flex: 1, margin: 20, }}>
                            {renderBrand()}
                            {renderCategory()}
                            {renderStatus()}
                        </View>
                    </ScrollView>
                    {renderFooter()}
                </View>
            </View>
        </Modal>
    )
}

export default CustomModal

const styles = StyleSheet.create({

    modalContainer: {
        //position: 'absolute',
        width: '100%',
    },
    rowContainer: {
        backgroundColor: '#fff',
        borderRadius: 4,
        borderWidth: 0.75,
        borderColor: COLORS.borderColor,
        marginBottom: 5,
    },
    touchContainer: {
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    titleText: {
        color: COLORS.lightText,
        fontFamily: Font.RalewaySemiBold,
        fontSize: 13,
        letterSpacing: 1.2,
    }

})

import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Icon, { Icons } from '../../components/Icons';
import { COLORS } from '../../constant';
import Font from '../../config/CustomFont';
import { Appscreen, Loader } from '../../components/global';
import CheckBoxItem from '../../components/global/CheckBoxItem';
import RadioButton from '../../components/global/RadioButton';
//WEB API
import useApi from '../../hooks/useApi';
import { productApi } from '../../api';

const data = [
    { id: 1, label: 'Board', isSelected: false },
    { id: 2, label: 'Customers', isSelected: false },
    { id: 3, label: 'Orders', isSelected: false },
    { id: 4, label: 'Product', isSelected: false },
    { id: 5, label: 'Settings', isSelected: false },
];
const statusData = [
    { id: 1, label: 'Active', isSelected: false },
    { id: 2, label: 'Inactive', isSelected: false },
    { id: 3, label: 'Draft', isSelected: false }
]
const ProductFilterModal = ({ isVisible, navigation, route }) => {

    const { storeId } = route.params;
    const [openBrand, setIsOpenBrand] = useState(false);
    const [openCategory, setIsOpenCategory] = useState(false);
    const [openprodType, setIsOpenprodType] = useState(false);
    const [openCreatedBy, setIsOpenCreatedBy] = useState(false);
    const [openUpdatedBy, setIsOpenopenUpdatedBy] = useState(false);
    const [openStatus, setIsOpenStatus] = useState(false);
    const [dataState, setIsDataState] = useState(data);
    //Loader
    const [isLoader, setIsLoader] = useState(false);
    //data 
    const [Brand, setIsBrand] = useState(null);
    const [Category, setIsCategory] = useState(null);
    //API
    const getDropdownApi = useApi(productApi.getDropdowntable);
    const renderTitle = (title) => (
        <Text style={{ fontFamily: Font.RalewaySemiBold, fontSize: 16, letterSpacing: 1.2, color: COLORS.lightText, }}>{title}</Text>
    )
    useEffect(() => {

        navigation.setOptions({
            headerTitle: () => renderTitle('More Filters'),
            headerRight: () => (
                <TouchableOpacity style={{ flexDirection: 'column' }} onPress={() => navigation.goBack()}>
                    <Icon type={Icons.Ionicons} name={'close-outline'} size={30} color={COLORS.lightText} />
                </TouchableOpacity>
            ),
        })
    }, [navigation]);
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
                        setIsBrand(mybrand)
                    }
                }
            }
        }
    }
    const getCategorylist = async () => {
        setIsOpenCategory(!openCategory);
        if (!openCategory) {
            if (Category == null) {
                const params = {
                    "table": "storecategory",
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
                        setIsCategory(mybrand)
                    }

                }
            }
        }

    }
    const renderBrand = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => getBrandList()} style={styles.touchContainer}>
                <Text style={styles.titleText}>Brand</Text>
                <Icon type={Icons.Ionicons} name={openBrand ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} />
            </TouchableOpacity>
            {openBrand &&
                <>
                    <Drawline />
                    <>
                        <Loader visible={isLoader} />
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                            <FlatList
                                scrollEnabled={false}
                                data={Brand}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item, index }) => <CheckBoxItem title={item.label} isselected={item.isSelected} onPress={() => {

                                    item.isSelected = !item.isSelected;
                                    setIsDataState({
                                        ...dataState,
                                        item
                                    });
                                }} />}
                            />
                        </View>
                    </>
                </>
            }
        </View>
    );
    const Drawline = () => (
        <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.borderColor }}></View>
    );
    const renderCategory = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => getCategorylist()} style={styles.touchContainer}>
                <Text style={styles.titleText}>Category</Text>
                <Icon type={Icons.Ionicons} name={openCategory ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} />
            </TouchableOpacity>
            {openCategory && <>
                <Drawline />
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                    <FlatList
                        scrollEnabled={false}
                        data={Category}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => <CheckBoxItem title={item.label} isselected={item.isSelected} onPress={() => {
                            item.isSelected = !item.isSelected;
                            setIsDataState({
                                ...dataState,
                                item
                            });
                        }} />}
                    />
                </View>
            </>}
        </View>
    );
    const renderProductType = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => setIsOpenprodType(!openprodType)} style={styles.touchContainer}>
                <Text style={styles.titleText}>Product Type</Text>
                <Icon type={Icons.Ionicons} name={openprodType ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} />
            </TouchableOpacity>
            {openprodType && <>
                <Drawline />
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                    <FlatList
                        scrollEnabled={false}
                        data={data}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => <CheckBoxItem title={item.label} isselected={item.isSelected} onPress={() => {
                            item.isSelected = !item.isSelected;
                            setIsDataState({
                                ...dataState,
                                item
                            });
                        }} />}
                    />
                </View>
            </>}
        </View>
    );
    const renderCreatedBy = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => setIsOpenCreatedBy(!openCreatedBy)} style={styles.touchContainer}>
                <Text style={styles.titleText}>Created By</Text>
                <Icon type={Icons.Ionicons} name={openCreatedBy ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} />
            </TouchableOpacity>
            {openCreatedBy && <>
                <Drawline />
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                    <FlatList
                        scrollEnabled={false}
                        data={data}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => <CheckBoxItem title={item.label} isselected={item.isSelected} onPress={() => {

                            item.isSelected = !item.isSelected;
                            setIsDataState({
                                ...dataState,
                                item
                            });
                        }} />}
                    />
                </View>
            </>}
        </View>
    );
    const renderUpdeteddBy = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => setIsOpenopenUpdatedBy(!openUpdatedBy)} style={styles.touchContainer}>
                <Text style={styles.titleText}>Updated By</Text>
                <Icon type={Icons.Ionicons} name={openUpdatedBy ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} />
            </TouchableOpacity>
            {openUpdatedBy && <>
                <Drawline />
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                    <FlatList
                        scrollEnabled={false}
                        data={data}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => <CheckBoxItem title={item.label} isselected={item.isSelected} onPress={() => {

                            item.isSelected = !item.isSelected;
                            setIsDataState({
                                ...dataState,
                                item
                            });
                        }} />}
                    />
                </View>
            </>}
        </View>
    );
    const renderStatus = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => setIsOpenStatus(!openStatus)} style={styles.touchContainer}>
                <Text style={styles.titleText}>Status</Text>
                <Icon type={Icons.Ionicons} name={openStatus ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} />
            </TouchableOpacity>
            {openStatus && <>
                <Drawline />
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                    <RadioButton data={statusData} />
                </View>
            </>}
        </View>
    );
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
                    <TouchableOpacity>
                        <Text style={styles.titleText}>Clear</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10, alignSelf: 'center', backgroundColor: 'rgba(112, 212, 75,1)', borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                    <TouchableOpacity>
                        <Text style={[styles.titleText, { color: '#fff' }]}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    return (
        // <Appscreen>
        //     <ScrollView style={styles.modalContainer}>
        //         <View style={{ flex: 1, margin: 20, }}>
        //             {renderBrand()}
        //             {renderCategory()}
        //             {renderProductType()}
        //             {renderCreatedBy()}
        //             {renderUpdeteddBy()}
        //             {renderStatus()}
        //         </View>
        //     </ScrollView >
        // </Appscreen>
        <Modal animationType='fade' transparent={true} >

        </Modal>
    )
}

export default ProductFilterModal

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
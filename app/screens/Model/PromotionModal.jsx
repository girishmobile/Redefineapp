import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useHeaderHeight } from '@react-navigation/elements';
import Icon, { Icons } from '../../components/Icons';
import Font from '../../config/CustomFont';
import { COLORS } from '../../constant';
import Drawline from '../../components/global/Drawline';
import useApi from '../../hooks/useApi';
import { promotionApi } from '../../api';
import { Loader } from '../../components/global';
import CheckBoxItem from '../../components/global/CheckBoxItem';
import RadioButton from '../../components/global/RadioButton';

import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const promotionsStatus = [
    { id: 1, label: 'Active', isSelected: false },
    { id: 2, label: 'Inactive', isSelected: false },
    { id: 3, label: 'Scheduled', isSelected: false },
    { id: 4, label: 'Expired', isSelected: false }
];
const statusData = [
    { id: 1, label: 'Active', isSelected: false },
    { id: 2, label: 'Inactive', isSelected: false },
];

const PromotionModal = ({ isVisible, onClose, storeId, onApply, onClear }) => {

    const [isLoader, setIsLoader] = useState(false);
    const headerHeight = useHeaderHeight();

    const [openDiscount, setOpenDiscount] = useState(false);
    const [discountList, setIsDiscountList] = useState(null);

    const [openStatus, setOpenStatus] = useState(false);
    const [openProStatus, setOpenProStatus] = useState(false);
    const [recStatusValue, setIsRecStatusValue] = useState('');
    const [recStatus, setIsRecStatus] = useState('');

    const [promotionValue, setIsPromotionValue] = useState('');
    const [promotionStatus, setIsPromotionStatus] = useState('');

    const [openCreated, setOpenCreated] = useState(false);
    const [openCalendar, setIsOpenCalendar] = useState(false);

    const [orderDate, setIsOrderDate] = useState(null);
    const [selectedDate, setIsSelectedDate] = useState(null);

    const [openCreatedBy, setOpenCreatedBy] = useState(false);
    const [createdList, setcreatedList] = useState(null);

    //WEB API
    const getdropdownApi = useApi(promotionApi.getDropdownlist);

    useEffect(() => {

        resetStateVarible();
        return function cleanup() {
        }
    }, [storeId]);

    const resetStateVarible = () => {

        setOpenDiscount(false);
        setIsDiscountList(null);
        setOpenProStatus(false);
        setOpenStatus(false);
        setcreatedList(null);
        setIsPromotionStatus('');
        setIsPromotionValue('');
        setIsRecStatus('');
        setIsRecStatusValue('');
        setOpenCreated(false);
        setIsOrderDate(null);
        setIsOpenCalendar(false);

    }
    //WEB API Calling...
    const getDiscountName = async () => {
        const params = { "table": "promotion", "isFetchAll": true, "storeId": 0 }
        setIsLoader(true);
        const response = await getdropdownApi.request(params);
        setIsLoader(false);
        if (response['data'] != null) {
            const mydata = response['data'];
            if (mydata['data'] != null) {
                const listOfdiscount = mydata['data'];
                if (listOfdiscount != null) {
                    listOfdiscount.map((item) => item['isAdd'] = false)
                    setIsDiscountList(listOfdiscount)
                }
            }
        }

    }
    const getCreatedName = async () => {
        const params = { "table": "adminuser", "isFetchAll": false, "storeId": 0 };
        setIsLoader(true);
        const response = await getdropdownApi.request(params);
        setIsLoader(false);
        if (response['data'] != null) {
            const mydata = response['data'];
            if (mydata['data'] != null) {
                const listOfcreated = mydata['data'];

                if (listOfcreated != null) {
                    listOfcreated.map((item) => item['isAdd'] = false)
                    setcreatedList(listOfcreated)
                }
            }
        }
    }
    const getDiscountList = () => {
        setOpenDiscount(!openDiscount);
        if (!openDiscount) {
            if (discountList === null) {
                getDiscountName();
            }
        }
    }
    const getCreatedBy = () => {
        setOpenCreatedBy(!openCreatedBy);
        if (!openCreatedBy) {
            if (createdList === null) {
                getCreatedName();
            }
        }

    }
    const getPromotionStatus = () => {
        setOpenProStatus(!openProStatus);
    }
    const getStatus = () => {
        setOpenStatus(!openStatus);
    }
    const getCreatedDate = () => {
        setOpenCreated(!openCreated);
    }
    //Apply and Clear **********************************************************************
    const closeModal = () => {
        onClose();
    }
    const clearFilter = () => {
        resetStateVarible();
        onClear();
    }
    const applyFilter = async () => {
        //"filteringOptions":[{"field":"id","operator":1,"value":"90","type":"moreFilter"},{"field":"storeId","operator":"0","value":"0"}]}}
        filterPayload = [];
        filterCount = 0;
        if (discountList != null) {
            let newValue = [];
            let discountValues = '';
            const selectedName = discountList.filter(item => item.isAdd === true);
            selectedName.map((item) => {
                newValue.push(`${item['value']}`);
            });
            filterCount = filterCount + newValue.length;
            discountValues = (newValue.toString());
            if (discountValues.length > 0) {
                filterPayload.push({
                    "field": "id",
                    "operator": 1,
                    "value": discountValues
                })
            }
        }
        if (createdList != null) {
            let newValue = [];
            let createdValue = '';
            const selectedName = createdList.filter(item => item.isAdd === true);
            selectedName.map((item) => {
                newValue.push(`${item['value']}`);
            });
            createdValue = (newValue.toString());
            if (createdValue.length > 0) {
                filterPayload.push({
                    "field": "createdBy",
                    "operator": 1,
                    "value": createdValue,

                });
            }
        }
        if (filterPayload.length > 0) {
            // let operator = 1;
            // if (storeId == 0) {
            //     operator = 0;
            // }
            filterPayload.splice(0, 0, { "field": "storeId", "operator": 0, "value": "0" });
            const params = {
                "payload": filterPayload,
                "count": filterCount
            }


            onApply(params);
        }

        //{"args":{"pageSize":25,"pageIndex":1,"sortingOptions":[{"field":"name","direction":0,"priority":0}],"filteringOptions":[{"field":"createdBy","operator":1,"value":"70","type":"moreFilter"},{"field":"createddate","operator":1,"value":"08/08/2023,08/09/2023","type":"moreFilter"},{"field":"storeId","operator":"0","value":"0"}]}}
    }
    //Check- unCheck ****************************************************************************
    const checkedDiscountName = (index) => {
        const values = [...discountList];
        values[index].isAdd = !values[index].isAdd;
        setIsDiscountList(values);
    }
    const checkedCreatedBy = (index) => {
        const values = [...createdList];
        values[index].isAdd = !values[index].isAdd;
        setcreatedList(values);
    }
    const onSelectedPromotionValue = (proValue) => {
        setIsPromotionValue(proValue);
        let recText = '';
        switch (proValue) {
            case "Active":
                recText = "A";
                break;
            case "Inactive":
                recText = "I";
                break;
            case "Scheduled":
                recText = "S";
                break;
            case "Expired":
                recText = "E";
                break;
            default:
                break;
        }
        setIsPromotionStatus(recText);
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
    const clearPromStatus = () => {
        setIsPromotionStatus('');
        setIsPromotionValue('');
    }
    const clearStatus = () => {
        setIsRecStatus('');
        setIsRecStatusValue('');
    }
    const renderDiscountName = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => getDiscountList()} style={styles.touchContainer}>
                <Text style={styles.subText}>Discount Name</Text>
                <Icon type={Icons.Ionicons} name={openDiscount ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
            {
                openDiscount && <>
                    <Drawline />
                    <Loader visible={isLoader} />
                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                        {
                            discountList && <FlatList
                                scrollEnabled={false}
                                data={discountList}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item, index }) => <CheckBoxItem title={item['label']} isselected={item.isAdd} onPress={() => {
                                    checkedDiscountName(index);

                                }} />}
                            />
                        }
                    </View>
                </>
            }
        </View>
    );
    const renderPromotionsStatus = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => getPromotionStatus()} style={styles.touchContainer}>
                <Text style={styles.subText}>Promotions Status</Text>
                <Icon type={Icons.Ionicons} name={openProStatus ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
            {openProStatus && <>
                <Drawline />
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                    <RadioButton
                        data={promotionsStatus}
                        isSelected={promotionValue}
                        onSelected={(proValue) => onSelectedPromotionValue(proValue)}
                        onClear={() => clearPromStatus()} />
                </View>
            </>}
        </View>
    );
    const renderStatus = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => getStatus()} style={styles.touchContainer}>
                <Text style={styles.subText}>Status</Text>
                <Icon type={Icons.Ionicons} name={openStatus ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
            {openStatus && <>
                <Drawline />
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                    <RadioButton
                        data={statusData}
                        isSelected={recStatusValue}
                        onSelected={(proValue) => onSelectedStatus(proValue)}
                        onClear={() => clearStatus()} />

                </View>
            </>}
        </View>
    );
    const renderCreatedDate = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => getCreatedDate()} style={styles.touchContainer}>
                <Text style={styles.subText}>Created Date</Text>
                <Icon type={Icons.Ionicons} name={openCreated ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
            {openCreated && <>
                <Drawline />
                <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                    <View style={{ margin: 10, borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                        <TouchableOpacity style={styles.createdDateWrapper} onPress={() => setIsOpenCalendar(!openCalendar)}>
                            <Text style={[styles.subText, { marginLeft: 5, flex: 1 }]}>{orderDate}</Text>
                            <Icon type={Icons.Ionicons} name={'calendar-outline'} size={20} color={COLORS.lightText} />
                        </TouchableOpacity>
                        <Drawline />
                        {openCalendar && <Calendar onDayPress={(day) => {
                            if (day['dateString'] !== null || day['dateString'] !== '') {
                                let serviceDate = moment(day['dateString']);
                                serviceDate = serviceDate.format("MM/DD/YYYY");
                                setIsOrderDate(serviceDate);
                                setIsSelectedDate(day['dateString']);
                            }
                        }
                        }
                            markedDates={{
                                [selectedDate]: { selected: true, disableTouchEvent: true, selectedDotColor: 'orange' }
                            }} />}
                    </View>
                </View>
            </>}
        </View>
    );
    const renderCreatedBy = () => (
        <View style={styles.rowContainer}>
            <TouchableOpacity onPress={() => getCreatedBy()} style={styles.touchContainer}>
                <Text style={styles.subText}>Created By</Text>
                <Icon type={Icons.Ionicons} name={openCreatedBy ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
            </TouchableOpacity>
            {
                openCreatedBy && <>
                    <Drawline />
                    <Loader visible={isLoader} />
                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                        {
                            createdList && <FlatList
                                scrollEnabled={false}
                                data={createdList}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item, index }) => <CheckBoxItem title={item['label']} isselected={item.isAdd} onPress={() => {
                                    checkedCreatedBy(index);
                                }} />}
                            />
                        }
                    </View>
                </>
            }
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
                    <TouchableOpacity onPress={() => clearFilter()}>
                        <Text style={styles.subText}>Clear</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ padding: 10, alignSelf: 'center', backgroundColor: 'rgba(112, 212, 75,1)', borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                    <TouchableOpacity onPress={() => applyFilter()}>
                        <Text style={[styles.subText, { color: '#fff' }]}>Apply</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
    return (
        <Modal animationType='fade' transparent={true} visible={isVisible} onRequestClose={onClose}>
            <View style={styles.container}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => onClose()} style={{ width: '100%', height: '100%', position: 'absolute', backgroundColor: 'rgba(0,0,0,0.1)', }} />
                <View style={styles.baseView}>
                    <View style={{ height: headerHeight, justifyContent: 'flex-end' }}>
                        <View style={styles.headerstyle}>
                            <Text style={styles.titleText}>{'More Filter'}</Text>
                            <TouchableOpacity onPress={() => closeModal()}>
                                <Icon type={Icons.Ionicons} name={'close-outline'} size={30} color={COLORS.lightText} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Drawline />
                    <ScrollView style={{ with: '100%' }}>
                        <View style={{ flex: 1, margin: 20, }}>
                            {renderDiscountName()}
                            {renderPromotionsStatus()}
                            {renderStatus()}
                            {renderCreatedDate()}
                            {renderCreatedBy()}
                        </View>
                    </ScrollView>
                    {renderFooter()}
                </View>
            </View>
        </Modal>
    )
}
export default PromotionModal

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    baseView: {
        height: '100%',
        width: '70%',
        backgroundColor: '#fff',
        alignSelf: 'flex-end',
    },
    headerstyle: {
        height: 44,
        paddingLeft: 20,
        paddingRight: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    titleText: {
        flex: 1,
        textAlign: 'center',
        fontFamily: Font.RalewaySemiBold,
        fontSize: 16,
        letterSpacing: 1.2,
        color: COLORS.lightText,
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
    // titleText: {
    //     color: COLORS.lightText,
    //     fontFamily: Font.RalewaySemiBold,
    //     fontSize: 13,
    //     letterSpacing: 1.2,
    // },
    subText: {
        color: COLORS.lightText,
        fontFamily: Font.RalewaySemiBold,
        fontSize: 13,
        letterSpacing: 1.2,
    },
    createdDateWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        padding: 5
    }
})
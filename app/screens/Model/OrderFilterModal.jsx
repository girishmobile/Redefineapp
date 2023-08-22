import { Modal, StyleSheet, Text, View, TouchableOpacity, ScrollView, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useHeaderHeight } from '@react-navigation/elements';
import { COLORS } from '../../constant';
import Font from '../../config/CustomFont';
import Icon, { Icons } from '../../components/Icons';
import useApi from '../../hooks/useApi';
import { orderApi, productApi } from '../../api';
import { Loader } from '../../components/global';
import CheckBoxItem from '../../components/global/CheckBoxItem';

import { Calendar } from 'react-native-calendars';
import moment from 'moment';

const OrderFilterModal = ({ isVisible, onClose, storeId, onApply, onClear }) => {

    const headerHeight = useHeaderHeight();

    const [openOrderstatus, setIsOpenorderStatus] = useState(false);
    const [orderStatus, setIsOrderStatus] = useState(null);

    const [openPaymentstatus, setIsOpenPaymentStatus] = useState(false);
    const [paymentStatus, setIsPaymentStatus] = useState(null);

    const [openFulfilstatus, setIsOpenFulfilStatus] = useState(false);
    const [fulfilStatus, setIsFulfilStatus] = useState(null);

    const [openDate, setIsOpenOrderDate] = useState(false);
    const [orderDate, setIsOrderDate] = useState(null);
    const [selectedDate, setIsSelectedDate] = useState(null);

    const [openCalendar, setIsOpenCalendar] = useState(false);

    const [openPaymethod, setIsOpenPayMethod] = useState(false);
    const [paymentMethod, setIsPaymentMethod] = useState(null);

    const [opensaleAgent, setIsOpenSaleAgent] = useState(false);
    const [saleAgent, setIsSaleAgent] = useState(null);

    const [openCoupon, setIsOpenCoupon] = useState(false);
    const [couponCode, setIsCouponCode] = useState(null);

    const [isLoader, setIsLoader] = useState(false);
    //WEB API
    const getOrderStatusApi = useApi(orderApi.getOrderStatuslist);
    const getDropdownApi = useApi(productApi.getDropdowntable);
    const getSaleAgentApi = useApi(orderApi.getSaleAgetlist);

    const getOrderStatuslist = async () => {
        const params = {
            "storeId": storeId
        }
        setIsLoader(true);
        const response = await getOrderStatusApi.request(params);
        setIsLoader(false);
        if (response['data'] != null) {
            const mydata = response['data'];
            if (mydata['data'] != null) {
                const listOfstatus = mydata['data'];
                if (listOfstatus['status'] != null) {
                    const mystatus = listOfstatus['status'];
                    mystatus.map((item) => item['isAdd'] = false)
                    setIsOrderStatus(mystatus)
                }
                if (listOfstatus['paymentStatus'] != null) {
                    const mystatus = listOfstatus['paymentStatus'];
                    mystatus.map((item) => item['isAdd'] = false)
                    setIsPaymentStatus(mystatus)
                }
                if (listOfstatus['fulfillmentStatus'] != null) {
                    const mystatus = listOfstatus['fulfillmentStatus'];
                    mystatus.map((item) => item['isAdd'] = false)
                    setIsFulfilStatus(mystatus)
                }
            }
        }
    }
    useEffect(() => {
        resetStateVarible();
        console.log('storeId:- ', storeId);
        return function cleanup() {
        }
    }, [storeId]);
    const resetStateVarible = () => {
        setIsOpenorderStatus(false);
        setIsOrderStatus(null);

        setIsOpenPaymentStatus(false);
        setIsPaymentStatus(null);

        setIsOpenFulfilStatus(false);
        setIsFulfilStatus(null);

        setIsOpenOrderDate(false);
        setIsOrderDate(null);
        setIsOpenCalendar(false);

        setIsOpenPayMethod(false);
        setIsPaymentMethod(null);

        setIsOpenSaleAgent(false);
        setIsSaleAgent(null);

        setIsOpenCoupon(false);
        setIsCouponCode(null);
    }
    const Drawline = () => (
        <View style={{ width: '100%', height: 0.5, backgroundColor: COLORS.borderColor }}></View>
    );
    const closeModal = () => {
        onClose();
    }
    //get data for  drop down ********************************************************************
    const getOrderStatus = () => {
        setIsOpenorderStatus(!openOrderstatus);
        if (!openOrderstatus) {
            if (orderStatus == null) {
                getOrderStatuslist();
            }
        }
    }
    const getPaymentStatus = () => {
        setIsOpenPaymentStatus(!openPaymentstatus);
        if (!openPaymentstatus) {
            if (paymentStatus == null) {
                getOrderStatuslist();
            }
        }
    }
    const getFulfilStatus = () => {
        setIsOpenFulfilStatus(!openFulfilstatus);
        if (!openFulfilstatus) {
            if (fulfilStatus == null) {
                getOrderStatuslist();
            }
        }
    }
    const getOrderDate = () => {
        setIsOpenOrderDate(!openDate);
    }
    const getPaymentMethod = async () => {
        setIsOpenPayMethod(!openPaymethod);
        if (!openPaymethod) {
            if (paymentMethod == null) {
                const params = {
                    "table": "paymentoptions",
                    "isFetchAll": false,
                    "storeId": 0
                }
                setIsLoader(true);
                const response = await getDropdownApi.request(params);
                setIsLoader(false);
                if (response['data'] != null) {
                    const mydata = response['data'];
                    if (mydata['data'] != null) {

                        const myPaymethod = mydata['data'];
                        myPaymethod.map((item) => item['isAdd'] = false)
                        setIsPaymentMethod(myPaymethod)
                    }
                }
            }
        }
    }
    const getSaleAgent = async () => {
        setIsOpenSaleAgent(!opensaleAgent);
        if (!opensaleAgent) {
            if (saleAgent === null) {
                const params = {
                    "storeId": [storeId]
                }
                setIsLoader(true);
                const response = await getSaleAgentApi.request(params);
                setIsLoader(false);
                if (response['data'] != null) {
                    const mydata = response['data'];
                    if (mydata['data'] != null) {
                        const mysaleagent = mydata['data'];
                        mysaleagent.map((item) => item['isAdd'] = false)
                        setIsSaleAgent(mysaleagent);
                    }
                }
            }
        }
    }
    const getCouponCode = async () => {
        setIsOpenCoupon(!openCoupon);
        if (!openCoupon) {
            if (couponCode == null) {
                const params = {
                    "table": "promotion",
                    "isFetchAll": false,
                    "storeId": 0
                }
                setIsLoader(true);
                const response = await getDropdownApi.request(params);
                setIsLoader(false);
                if (response['data'] != null) {
                    const mydata = response['data'];
                    if (mydata['data'] != null) {
                        const mycouponcode = mydata['data'];
                        mycouponcode.map((item) => item['isAdd'] = false)
                        setIsCouponCode(mycouponcode)
                    }
                }
            }
        }
    }
    //Check- unCheck ****************************************************************************
    const checkedOrderStatus = (index) => {
        const values = [...orderStatus];
        values[index].isAdd = !values[index].isAdd;
        setIsOrderStatus(values);
    }
    const checkedPaymenStatus = (index) => {
        const values = [...paymentStatus];
        values[index].isAdd = !values[index].isAdd;
        setIsPaymentStatus(values);
    }
    const checkedFulfilStatus = (index) => {
        const values = [...fulfilStatus];
        values[index].isAdd = !values[index].isAdd;
        setIsFulfilStatus(values);
    }
    const checkedPaymentMethod = (index) => {
        const values = [...paymentMethod];
        values[index].isAdd = !values[index].isAdd;
        setIsPaymentMethod(values);
    }
    const checkedSaleAgent = (index) => {
        const values = [...saleAgent];
        values[index].isAdd = !values[index].isAdd;
        setIsSaleAgent(values);
    }
    //render components **************************************************************************
    const renderOrderStatus = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => getOrderStatus()} style={styles.touchContainer}>
                    <Text style={styles.subText}>Order Status</Text>
                    <Icon type={Icons.Ionicons} name={openOrderstatus ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {openOrderstatus &&
                    <>
                        <Drawline />
                        <Loader visible={isLoader} />
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                            {
                                orderStatus && <FlatList
                                    scrollEnabled={false}
                                    data={orderStatus}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => <CheckBoxItem title={item['name']} isselected={item.isAdd} onPress={() => {
                                        checkedOrderStatus(index);

                                    }} />}
                                />
                            }
                        </View>
                    </>
                }
            </View>
        )
    }
    const renderPaymentStatus = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => getPaymentStatus()} style={styles.touchContainer}>
                    <Text style={styles.subText}>Payment Status</Text>
                    <Icon type={Icons.Ionicons} name={openPaymentstatus ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {openPaymentstatus &&
                    <>
                        <Drawline />
                        <Loader visible={isLoader} />
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                            {
                                paymentStatus && <FlatList
                                    scrollEnabled={false}
                                    data={paymentStatus}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => <CheckBoxItem title={item['name']} isselected={item.isAdd} onPress={() => {
                                        checkedPaymenStatus(index);

                                    }} />}
                                />
                            }
                        </View>
                    </>
                }
            </View>
        )
    }
    const renderFulfillmentStatus = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => getFulfilStatus()} style={styles.touchContainer}>
                    <Text style={styles.subText}>Fulfillment Status</Text>
                    <Icon type={Icons.Ionicons} name={openFulfilstatus ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {openFulfilstatus &&
                    <>
                        <Drawline />
                        <Loader visible={isLoader} />
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                            {
                                fulfilStatus && <FlatList
                                    scrollEnabled={false}
                                    data={fulfilStatus}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => <CheckBoxItem title={item['name']} isselected={item.isAdd} onPress={() => {
                                        checkedFulfilStatus(index);

                                    }} />}
                                />
                            }
                        </View>
                    </>
                }
            </View>
        )
    }
    const renderOrderDate = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => getOrderDate()} style={styles.touchContainer}>
                    <Text style={styles.subText}>Order Date</Text>
                    <Icon type={Icons.Ionicons} name={openDate ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {openDate && <>
                    <Drawline />
                    <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                        <View style={{ margin: 10, borderRadius: 4, borderWidth: 0.75, borderColor: COLORS.borderColor }}>
                            <TouchableOpacity style={styles.orderDateWrapper} onPress={() => setIsOpenCalendar(!openCalendar)}>
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
        )
    }
    const renderPaymentMethod = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => getPaymentMethod()} style={styles.touchContainer}>
                    <Text style={styles.subText}>Payment Method</Text>
                    <Icon type={Icons.Ionicons} name={openPaymethod ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {openPaymethod &&
                    <>
                        <Drawline />
                        <Loader visible={isLoader} />
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                            {
                                paymentMethod && <FlatList
                                    scrollEnabled={false}
                                    data={paymentMethod}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => <CheckBoxItem title={item['label']} isselected={item.isAdd} onPress={() => {
                                        checkedPaymentMethod(index);

                                    }} />}
                                />
                            }
                        </View>
                    </>
                }
            </View>
        )
    }
    const renderCountry = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => { }} style={styles.touchContainer}>
                    <Text style={styles.subText}>Country</Text>
                    <Icon type={Icons.Ionicons} name={openOrderstatus ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
            </View>
        )
    }
    const renderSaleAgent = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => getSaleAgent()} style={styles.touchContainer}>
                    <Text style={styles.subText}>Sale Agent</Text>
                    <Icon type={Icons.Ionicons} name={opensaleAgent ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {opensaleAgent &&
                    <>
                        <Drawline />
                        <Loader visible={isLoader} />
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                            {
                                saleAgent && <FlatList
                                    scrollEnabled={false}
                                    data={saleAgent}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => <CheckBoxItem title={item['label']} isselected={item.isAdd} onPress={() => {
                                        checkedSaleAgent(index);

                                    }} />}
                                />
                            }
                        </View>
                    </>
                }
            </View>
        )
    }
    const renderCouponCode = () => {
        return (
            <View style={styles.rowContainer}>
                <TouchableOpacity onPress={() => getCouponCode()} style={styles.touchContainer}>
                    <Text style={styles.subText}>Coupon Code</Text>
                    <Icon type={Icons.Ionicons} name={openCoupon ? 'chevron-down-outline' : 'chevron-forward-sharp'} size={22} color={COLORS.lightText} style={{ opacity: 0.5 }} />
                </TouchableOpacity>
                {openCoupon &&
                    <>
                        <Drawline />
                        <Loader visible={isLoader} />
                        <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 4, }}>
                            {
                                couponCode && <FlatList
                                    scrollEnabled={false}
                                    data={couponCode}
                                    keyExtractor={(_, index) => index.toString()}
                                    renderItem={({ item, index }) => <CheckBoxItem title={item['label']} isselected={item.isAdd} onPress={() => {
                                        // checkedPaymentMethod(index);

                                    }} />}
                                />
                            }
                        </View>
                    </>
                }
            </View>
        )
    }
    //Apply and Clear **********************************************************************
    const applyFilter = () => {
        filterPayload = [];
        filterCount = 0;
        if (orderStatus !== null) { // for order status
            let newValue = [];
            let newOrderStatus = '';
            const selectedStatus = orderStatus.filter(item => item.isAdd === true);
            selectedStatus.map((item) => {
                newValue.push(`${item['name']}`);
            });
            filterCount = filterCount + newValue.length;
            newOrderStatus = (newValue.toString());
            if (newOrderStatus.length > 0) {
                filterPayload.push({
                    "field": "orderStatus",
                    "operator": 0,
                    "value": newOrderStatus
                })
            }
        }
        if (paymentStatus !== null) {
            let newValue = [];
            let newPaymentstatus = '';
            const selectedPayStatus = paymentStatus.filter(item => item.isAdd === true);
            selectedPayStatus.map((item) => {
                newValue.push(`${item['name']}`);
            });
            filterCount = filterCount + newValue.length;
            newPaymentstatus = (newValue.toString());
            if (newPaymentstatus.length > 0) {
                filterPayload.push({
                    "field": "paymentStatus",
                    "operator": 0,
                    "value": newPaymentstatus
                })
            }
        }
        if (fulfilStatus !== null) {
            let newValue = [];
            let newfullfilstatus = '';
            const selectedFulfil = fulfilStatus.filter(item => item.isAdd === true);
            selectedFulfil.map((item) => {
                newValue.push(`${item['name']}`);
            });
            filterCount = filterCount + newValue.length;
            newfullfilstatus = (newValue.toString());
            if (newfullfilstatus.length > 0) {
                filterPayload.push({
                    "field": "fulfillmentStatus",
                    "operator": 0,
                    "value": newfullfilstatus
                })
            }
        }
        if (orderDate != null) {
            filterCount = filterCount + 1;
            filterPayload.push({
                "field": "orderDate",
                "operator": 1,
                "value": orderDate
            });
        }
        if (paymentMethod !== null) {
            let newValue = [];
            let newpaymentmethod = '';
            const selectedPayMethod = paymentMethod.filter(item => item.isAdd === true);
            selectedPayMethod.map((item) => {
                newValue.push(`${item['label'].toUpperCase()}`)
            });
            filterCount = filterCount + newValue.length;
            newpaymentmethod = (newValue.toString());
            if (newpaymentmethod.length > 0) {
                filterPayload.push({
                    "field": "paymentMethod",
                    "operator": 1,
                    "value": newpaymentmethod
                })
            }
        }
        if (saleAgent !== null) {
            let newValue = [];
            let newsaleAgent = '';
            const selectedSaleAgent = saleAgent.filter(item => item.isAdd === true);
            selectedSaleAgent.map((item) => {
                newValue.push(`${item['value']}`);
            });
            filterCount = filterCount + newValue.length;
            newsaleAgent = (newValue.toString());
            if (newsaleAgent.length > 0) {
                filterPayload.push({
                    "field": "salesagent",
                    "operator": 1,
                    "value": newsaleAgent
                })
            }
        }
        if (filterPayload.length > 0) {
            const params = {
                "payload": filterPayload,
                "count": filterCount
            }
            onApply(params);
        }
    }
    const clearFilter = () => {
        resetStateVarible();
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
                            {renderOrderStatus()}
                            {renderPaymentStatus()}
                            {renderFulfillmentStatus()}
                            {renderOrderDate()}
                            {renderPaymentMethod()}
                            {/* {renderCountry()} */}
                            {renderSaleAgent()}
                            {/* {renderCouponCode()} */}
                        </View>
                    </ScrollView>
                    {renderFooter()}
                </View>
            </View>
        </Modal>
    )
}
export default OrderFilterModal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    baseView: {
        height: '100%', width: '70%', backgroundColor: '#fff', alignSelf: 'flex-end',
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
    subText: {
        color: COLORS.lightText,
        fontFamily: Font.RalewaySemiBold,
        fontSize: 13,
        letterSpacing: 1.2,
    },
    orderDateWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
        padding: 5
    }

})
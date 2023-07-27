import { ScrollView, StyleSheet, Text, View, Dimensions, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Appscreen, Loader } from '../components/global'
//API
import useApi from '../hooks/useApi';
import orderApi from '../api/order';
import FastImage from 'react-native-fast-image';
import FastImageView from '../components/global/FastImageView';
import OrderStoreImage from '../components/items/OrderStoreImage';
import GlobalStyle from '../styles/GlobalStyle';
import { COLORS } from '../constant';
import moment from 'moment';
import Font from '../config/CustomFont';
import colors from '../constant/colors';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');


const OrderDetails = ({ route }) => {
    const { order } = route.params;
    const [isLoader, setIsLoader] = useState(false);
    const [orderDetail, setOrderDetails] = useState(null);

    const [cartItem, setCartItems] = useState(null);

    const orderdetailApi = useApi(orderApi.getOrderdetailsById);
    const orderShoppingcartApi = useApi(orderApi.getOrderShoppingCart);

    let orderStatus = '';

    const today = moment()
        .utcOffset('+05:30')
        .format('YYYY-MM-DD hh:mm');

    const getOrderedShoppingCartdetail = async () => {

        if (order != null) {
            const orderId = order['id'];
            const params = {
                'orderId': orderId
            }
            setIsLoader(true);
            const response = await orderShoppingcartApi.request(params);
            setIsLoader(false);
            if (response['data'] != null) {
                const mydata = response['data'];
                const item = mydata['data'];
                if (item != null) {
                    setCartItems(item);
                }
            }
        }
    }
    const getOrderdetailsById = async () => {

        const storeId = order['storeId'];
        const orderId = order['id'];
        const params = {
            'orderNumber': orderId,
            'storeIdList': [
                storeId
            ]
        }
        setIsLoader(true);
        const response = await orderdetailApi.request(params);
        setIsLoader(orderdetailApi.isLoader);
        if (response['data'] != null) {
            const mydata = response['data'];
            if (mydata['data'] != null) {
                const item = mydata['data'];
                if (item['orderStatus'] != null) {
                    orderStatus = item['orderStatus'];
                    orderStatus = orderStatus.toLowerCase();
                }
                setOrderDetails(mydata['data']);
                getOrderedShoppingCartdetail();

            }
        }
    }
    const isObjectEmpty = (objectName) => {
        return Object.keys(objectName).length === 0
    }
    const getOrderDate = () => {

        if (orderDetail['orderDate'] != null) {

            return moment(orderDetail['orderDate']).format('MM/DD/YYYY hh:mm A');
        }
        else {
            return ''
        }
    }
    useEffect(() => {
        if (order != null) {
            getOrderdetailsById();
        }

    }, []);
    const orderDetailHeader = () => {
        let orderStatus = '';
        if (orderDetail['orderStatus'] != null) {
            orderStatus = orderDetail['orderStatus'];
            orderStatus = orderStatus.toLowerCase();
        }
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', }}>
                <View style={{ width: '50%', }}>
                    <Text style={[styles.subtitleText,]}>Order Status</Text>
                </View>
                <View style={{ width: '50%', alignItems: 'flex-end' }}>
                    <View style={styles.orderStatus(orderStatus)}>
                        <Text style={[styles.statusText(orderStatus)]}>{orderStatus}</Text>
                    </View>
                </View>
            </View>
        )
    }
    const orderTotalHeader = () => {

        let orderTotal = '';
        if (orderDetail['total'] != null) {
            orderTotal = orderDetail['total'];
        }
        return (
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ width: '49%' }}>
                    <Text style={[GlobalStyle.titleText, { textAlign: 'left', color: COLORS.titleColor }]}>Total</Text>
                </View>
                <View style={{ width: '49%', alignItems: 'flex-end' }}>
                    <Text style={[GlobalStyle.titleText, { textAlign: 'right', color: 'rgba(94, 162, 81,1)', opacity: 1.0 }]} >{`$${orderDetail['total']}`}</Text>
                </View>
            </View>
        )
    }
    const Drawline = () => {
        return (
            <View style={{ width: '100%', height: 1, backgroundColor: COLORS.textBgcolor, marginVertical: 12 }} />

        );
    }
    const orderPaymentStatus = () => {

        return orderDetail['paymentStatus'] && (
            <>

                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '49%' }}>
                        <Text style={[GlobalStyle.subtitleText, {}]}>Payment Method</Text>
                    </View>
                    <View style={{ width: '49%', alignItems: 'flex-end' }}>
                        <Text style={[GlobalStyle.subtitleText, { fontSize: 13, textAlign: 'right', color: 'rgba(94, 162, 81,1)', opacity: 1.0, textTransform: 'uppercase' }]} >{`${orderDetail['paymentMethod']}`}</Text>
                    </View>
                </View>
                <Drawline />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '49%' }}>
                        <Text style={[GlobalStyle.subtitleText, {}]}>Payment Status</Text>
                    </View>
                    <View style={{ width: '49%', alignItems: 'flex-end' }}>
                        <Text style={[GlobalStyle.subtitleText, { fontSize: 13, textAlign: 'right', color: 'rgba(94, 162, 81,1)', opacity: 1.0, textTransform: 'uppercase' }]} >{`${orderDetail['paymentStatus']}`}</Text>
                    </View>
                </View>
            </>
        );
    }
    const renderShippingAddress = () => {

        if (orderDetail['shippingAddress'] != null) {
            const shippAddress = orderDetail['shippingAddress'];
            const email = shippAddress['email'].toLowerCase();
            const address = `${shippAddress['address1']} ${shippAddress['address2']}`

            return shippAddress && <View style={[GlobalStyle.card, { marginTop: 0 }]}>
                <Text style={[GlobalStyle.titleText, { color: COLORS.titleColor, marginVertical: 5 }]}>{`Shipping Address`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { width: '100%', textAlign: 'left', }]}>{`Name: ${shippAddress['name']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { width: '100%', textAlign: 'left', }]}>{`Email: ${email}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { width: '100%', textAlign: 'left', }]}>{`Phone: ${shippAddress['phone']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { width: '100%', textAlign: 'left', }]}>{`Company: ${shippAddress['company']}`}</Text>
                <Drawline />
                {
                    shippAddress['address1'] && <>
                        <View style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
                            <Text style={[GlobalStyle.lightText, { textAlign: 'left', marginRight: 10 }]}>{`Address:`}</Text>
                            <Text style={[GlobalStyle.lightText, { textAlign: 'left', flex: 1 }]}>{`${address}`}</Text>
                        </View>
                        <Drawline />
                    </>
                }
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`Suite:- ${shippAddress['suite']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`zipCode:- ${shippAddress['zipCode']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`City:- ${shippAddress['city']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`State:- ${shippAddress['state']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`Country:- ${shippAddress['country']}`}</Text>


            </View>
        }

    }
    const renderBillingAddress = () => {

        if (orderDetail['billingAddress'] != null) {
            const billingAddress = orderDetail['shippingAddress'];
            const email = billingAddress['email'].toLowerCase();
            const address = `${billingAddress['address1']} ${billingAddress['address2']}`

            return billingAddress && <View style={[GlobalStyle.card, { marginTop: 0 }]}>
                <Text style={[GlobalStyle.titleText, { color: COLORS.titleColor, marginVertical: 5 }]}>{`Billing Address`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { width: '100%', textAlign: 'left', }]}>{`Name: ${billingAddress['name']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { width: '100%', textAlign: 'left', }]}>{`Email: ${email}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { width: '100%', textAlign: 'left', }]}>{`Phone: ${billingAddress['phone']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { width: '100%', textAlign: 'left', }]}>{`Company: ${billingAddress['company']}`}</Text>
                <Drawline />
                {
                    billingAddress['address1'] && <>
                        <View style={{ alignSelf: 'flex-start', flexDirection: 'row' }}>
                            <Text style={[GlobalStyle.lightText, { textAlign: 'left', marginRight: 10 }]}>{`Address:`}</Text>
                            <Text style={[GlobalStyle.lightText, { textAlign: 'left', flex: 1 }]}>{`${address}`}</Text>
                        </View>
                        <Drawline />
                    </>
                }
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`Suite:- ${billingAddress['suite']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`zipCode:- ${billingAddress['zipCode']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`City:- ${billingAddress['city']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`State:- ${billingAddress['state']}`}</Text>
                <Drawline />
                <Text style={[GlobalStyle.lightText, { textAlign: 'left', alignSelf: 'flex-start' }]}>{`Country:- ${billingAddress['country']}`}</Text>


            </View>
        }
    }
    const renderPaymentInfo = () => {
        return (
            <View style={[GlobalStyle.card, { marginTop: 0 }]}>

                <Text style={[GlobalStyle.titleText, { color: COLORS.titleColor, marginVertical: 5 }]}>{`Payment`}</Text>
                <Drawline />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '49%' }}>
                        <Text style={[GlobalStyle.subtitleText, {}]}>Payment Method</Text>
                    </View>
                    <View style={{ width: '49%', alignItems: 'flex-end' }}>
                        <Text style={[GlobalStyle.subtitleText, { fontSize: 13, textAlign: 'right', color: 'rgba(94, 162, 81,1)', opacity: 1.0, textTransform: 'uppercase' }]} >{`${orderDetail['paymentMethod']}`}</Text>
                    </View>
                </View>
                <Drawline />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '49%' }}>
                        <Text style={[GlobalStyle.subtitleText, {}]}>Payment Status</Text>
                    </View>
                    <View style={{ width: '49%', alignItems: 'flex-end' }}>
                        <Text style={[GlobalStyle.subtitleText, { fontSize: 13, textAlign: 'right', color: 'rgba(94, 162, 81,1)', opacity: 1.0, textTransform: 'uppercase' }]} >{`${orderDetail['paymentStatus']}`}</Text>
                    </View>
                </View>
                <Drawline />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '49%' }}>
                        <Text style={[GlobalStyle.subtitleText, {}]}>Sub Total</Text>
                    </View>
                    <View style={{ width: '49%', alignItems: 'flex-end' }}>
                        <Text style={[GlobalStyle.subtitleText, { textAlign: 'right', opacity: 1.0 }]} >{`$${orderDetail['subTotal']}`}</Text>
                    </View>
                </View>
                <Drawline />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '49%' }}>
                        <Text style={[GlobalStyle.subtitleText, {}]}>Shipping</Text>
                    </View>
                    <View style={{ width: '49%', alignItems: 'flex-end' }}>
                        <Text style={[GlobalStyle.subtitleText, { textAlign: 'right', opacity: 1.0 }]} >{`+ $${orderDetail['shipping']}`}</Text>
                    </View>
                </View>
                <Drawline />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '49%' }}>
                        <Text style={[GlobalStyle.subtitleText, {}]}>Tax</Text>
                    </View>
                    <View style={{ width: '49%', alignItems: 'flex-end' }}>
                        <Text style={[GlobalStyle.subtitleText, { textAlign: 'right', opacity: 1.0 }]} >{`+ $${orderDetail['tax']}`}</Text>
                    </View>
                </View>
                <Drawline />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '49%' }}>
                        <Text style={[GlobalStyle.subtitleText, {}]}>Discount</Text>
                    </View>
                    <View style={{ width: '49%', alignItems: 'flex-end' }}>
                        <Text style={[GlobalStyle.subtitleText, { textAlign: 'right', opacity: 1.0 }]} >{`- $${orderDetail['discounts']}`}</Text>
                    </View>
                </View>
                <Drawline />
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ width: '49%' }}>
                        <Text style={[GlobalStyle.titleText, { textAlign: 'left', color: COLORS.titleColor }]}>Total</Text>
                    </View>
                    <View style={{ width: '49%', alignItems: 'flex-end' }}>
                        <Text style={[GlobalStyle.titleText, { textAlign: 'right', color: 'rgba(94, 162, 81,1)', opacity: 1.0 }]} >{`$${orderDetail['total']}`}</Text>
                    </View>
                </View>
            </View>
        )
    }

    //f5894b5921a1a036321e5102b7df1f5d
    //Kiran#130303$

    const renderCartItem = () => {
        return cartItem && (
            <View style={[GlobalStyle.card, { marginTop: 0 }]}>
                <Text style={[GlobalStyle.titleText, { color: COLORS.titleColor, marginTop: 5, marginBottom: 15 }]}>{`Cart Item(${orderDetail['totalItems']})`}</Text>
                {
                    cartItem.map((item, index) =>


                        <View key={index} style={{ flexDirection: 'row', width: '100%', borderWidth: 1, borderColor: COLORS.textBgcolor, borderRadius: 4, padding: 5, marginVertical: 5 }}>
                            <View style={{ width: 80, height: 80, backgroundColor: COLORS.textBgcolor }}>
                                {
                                    item['colorImage'] && <FastImageView imageUrl={item['colorImage']} />
                                }
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.nameText}>{item['productName']}</Text>
                                {
                                    item['attributeOptionValue'] && <Text style={styles.colorText}>{`${item['attributeOptionValue']}`}</Text>
                                }
                                {
                                    item['sku'] && <Text style={[styles.colorText, { fontSize: 13, marginVertical: 0 }]}>{`SKU: ${item['sku']}`}</Text>
                                }
                                <View style={{ flexDirection: 'row', marginVertical: 5, justifyContent: 'space-between' }}>
                                    {
                                        item['totalPrice'] && <Text style={[styles.colorText, { fontSize: 13, }]}>{`Total $${item['totalPrice']}`}</Text>
                                    }
                                    {
                                        item['totalQty'] && <Text style={[styles.colorText, { fontSize: 13 }]}>{`Qty ${item['totalQty']}`}</Text>
                                    }
                                </View>

                            </View>


                        </View>)
                }
            </View>
        );
    }
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                <View style={styles.container}>
                    <ScrollView>
                        {
                            orderDetail && <>
                                <View style={[GlobalStyle.card]}>
                                    <Text style={[GlobalStyle.titleText, { color: COLORS.titleColor, marginVertical: 5 }]}>{`Order Detail`}</Text>
                                    <Drawline />
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={[GlobalStyle.subtitleText, { marginVertical: 0, flex: 1, fontFamily: Font.RalewayBold }]}>{`Order#${orderDetail['orderNumber']}`}</Text>
                                        <Text style={[GlobalStyle.lightText, { flex: 1, fontSize: 11, marginTop: 5 }]}>{getOrderDate()}</Text>
                                    </View>
                                    <Drawline />
                                    {orderDetailHeader()}
                                    <Drawline />
                                    {orderPaymentStatus()}
                                    <Drawline />
                                    {orderTotalHeader()}
                                    {
                                        orderDetail['orderNotes'] && <Text style={[GlobalStyle.lightText, { fontSize: 13, textAlign: 'left', alignSelf: 'flex-start', marginTop: 5 }]}>{`Notes:- ${orderDetail['orderNotes']}`}</Text>
                                    }
                                </View>
                                <View style={[GlobalStyle.card, { marginTop: 0 }]}>
                                    <Text style={[GlobalStyle.titleText, { color: COLORS.titleColor, marginVertical: 5 }]}>{`Store Detail`}</Text>
                                    <Drawline />
                                    <Text style={[styles.subtitleText, { width: '100%', textAlign: 'left', }]}>{`Name: ${orderDetail['storeName']}`}</Text>
                                    <Drawline />
                                    <Text style={[styles.subtitleText, { width: '100%', textAlign: 'left', }]}>{`store Id: ${orderDetail['storeId']}`}</Text>
                                    <Drawline />
                                    <Text style={[styles.subtitleText, { width: '100%', textAlign: 'left', }]}>{`customer Id: ${orderDetail['customerId']}`}</Text>

                                </View>
                                {

                                }
                                {renderShippingAddress()}
                                {renderBillingAddress()}
                                {renderCartItem()}
                                {renderPaymentInfo()}


                            </>
                        }
                    </ScrollView>
                </View>
            </Appscreen>
        </>
    )
}

export default OrderDetails

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    subtitleText: {
        fontFamily: Font.RalewaySemiBold,
        color: COLORS.titleColor,
        fontSize: 15,
        letterSpacing: 1.2,
        marginVertical: 5,
        textAlign: 'left',
        textTransform: 'capitalize',
    },
    colorText: {
        fontFamily: Font.RalewaySemiBold,
        color: COLORS.titleColor,
        opacity: 0.7,
        fontSize: 14,
        letterSpacing: 1.2,
        paddingLeft: 5,
        marginVertical: 5,
        textAlign: 'left',
        textTransform: 'capitalize',
    },
    nameText: {
        color: COLORS.titleColor,
        opacity: 0.9,
        letterSpacing: 1.2,
        fontSize: 14,
        padding: 5,
        textTransform: 'capitalize',
        fontFamily: Font.RalewayBold,
    },
    statusText: (status) => (
        {
            fontSize: 12,
            opacity: 0.9,
            fontFamily: Font.RalewaySemiBold,
            color: COLORS.titleColor,
            letterSpacing: 1.1,
            textTransform: 'uppercase',
            color: status === 'new' ? 'rgba(2, 132,199,1)' : status === 'pending' ? 'rgba(202,138,4,1)' : status === 'shipped' ? 'rgba(22, 163, 74,1)' : status === 'cancelled' ? 'rgba(198,36 ,40,1)' : 'rgba(87, 82, 80, 1)',
        }
    ),
    orderStatus: (status) => ({

        backgroundColor: status === 'new' ? 'rgba(224, 242,254,1)' : status === 'pending' ? 'rgba(254,249,195,1)' : status === 'shipped' ? 'rgba(220, 252, 231,1)' : status === 'cancelled' ? 'rgba(241, 169, 171, 1)' : 'rgba(241, 245, 249,1)',
        // padding: 5,
        paddingBottom: 5,
        paddingTop: 5,
        paddingRight: 20,
        paddingLeft: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 0.6,
        borderColor: status === 'new' ? 'rgba(125, 211,252,1)' : status === 'pending' ? 'rgba(253,224,71,1)' : status === 'shipped' ? 'rgba(134,239 , 172,1)' : status === 'cancelled' ? 'rgba(228, 83, 122, 1)' : 'rgba(210, 220, 230, 1)',
    })
})
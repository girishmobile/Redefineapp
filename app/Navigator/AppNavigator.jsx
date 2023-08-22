import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import Dashboard from '../screens/Dashboard'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon, { Icons } from '../components/Icons';
import { COLORS } from '../constant';
import Applogo from '../components/global/Applogo';
import Settings from '../screens/Settings';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
//screen
import Showsetting from '../screens/Showsetting';
import CustomerDetails from '../screens/CustomerDetails';
import ProductDetals from '../screens/ProductDetals';
import OrderDetails from '../screens/OrderDetails';

//Redux  for ProductNavigator
import ProductFilterModal from '../screens/Model/ProductFilterModal';
import Font from '../config/CustomFont';
import FriendScreen from '../screens/DummyData/FriendScreen';
import ProductList from '../screens/ProductList';
import OrderList from '../screens/OrderList';
import NewcustomerList from '../screens/NewcustomerList';
import MasterProductFeed from '../screens/MasterProductFeed';
import MasterStore from '../screens/MasterStore';
import MasterPromotions from '../screens/MasterPromotions';
import PromotionDetail from '../screens/PromotionDetail';


//Navigator 
const cusomerStack = createNativeStackNavigator();
const dashStack = createNativeStackNavigator();
const orderStack = createNativeStackNavigator();
const settingStack = createNativeStackNavigator();
const productStack = createNativeStackNavigator();
const friendStack = createNativeStackNavigator();

const promotionStack = createNativeStackNavigator();


const MoreButton = () => {
    return (

        <TouchableOpacity style={{ flexDirection: 'column' }} onPress={() => { }}>
            <Icon type={Icons.Ionicons} name={'close-outline'} size={30} color={COLORS.lightText} />
        </TouchableOpacity>
    );
}
const CustomerScreen = () => (

    <cusomerStack.Navigator screenOptions={{
        animation: 'fade',
        headerTintColor: COLORS.lightText,
        title: '',
        headerTitle: () => <Applogo isNavigation={true} />,
    }}>
        <cusomerStack.Screen name='customer' component={NewcustomerList} />
        <cusomerStack.Screen name='customerDetail' component={CustomerDetails} options={{
            headerTitle: () => renderTitle('Customer Details'),
        }} />
    </cusomerStack.Navigator>
);
const PromotionScreen = () => (
    <promotionStack.Navigator screenOptions={{
        animation: 'fade',
        headerTintColor: COLORS.lightText,
        title: '',
        headerShown: false,

    }}>
        <productStack.Screen name='Promotions' component={MasterPromotions} />
        <productStack.Screen name='PromotionDetail' component={PromotionDetail} />

    </promotionStack.Navigator>
)
const DashboardScreen = () => (
    <dashStack.Navigator screenOptions={{
        animation: 'fade',
        headerTintColor: COLORS.lightText,
        title: '',
        headerTitle: () => <Applogo isNavigation={true} />
    }}>
        <dashStack.Screen name='DasBoard' component={Dashboard} />
        <dashStack.Screen name='MasterProductFeed' component={MasterProductFeed} options={{
            headerTitle: () => renderTitle('Master Product Feed'),
        }} />
        <dashStack.Screen name='MasterStore' component={MasterStore} options={{
            headerTitle: () => renderTitle('Master Store'),
        }} />
        <dashStack.Screen name='MasterPromotions' component={MasterPromotions} options={{
            headerTitle: () => renderTitle('Master Promotions'),
        }} />
        <dashStack.Screen name='PromotionDetail' component={PromotionDetail} options={{
            headerTitle: () => renderTitle('Promotions Detail'),
        }} />
    </dashStack.Navigator>
);
const OrderScreen = () => (
    <orderStack.Navigator screenOptions={{
        animation: 'fade',
        headerTintColor: COLORS.lightText,
        title: '',
        headerTitle: () => <Applogo isNavigation={true} />
    }}>
        <orderStack.Screen name='Order' component={OrderList} />
        <orderStack.Screen name='Orderdetails' component={OrderDetails} />
    </orderStack.Navigator>
);
const SettingScreen = () => (
    <settingStack.Navigator screenOptions={{
        animation: 'fade',
        headerTitle: () => <Applogo isNavigation={true} />
    }}>
        <settingStack.Screen name='Setting' component={Settings} />
        <settingStack.Screen name='Showsetting' component={Showsetting} />
    </settingStack.Navigator>
);
const FriendMain = () => (
    <friendStack.Navigator screenOptions={{
    }}>
        <friendStack.Screen name='Setting' component={FriendScreen} />

    </friendStack.Navigator>
)
const ProductScreen = () => (
    <productStack.Navigator screenOptions={{
        animation: 'fade',
        headerTintColor: COLORS.lightText,
        title: '',
        headerTitle: () => <Applogo isNavigation={true} />
    }}>
        <productStack.Screen name='Product' component={ProductList} options={{
            // headerRight: () => <MoreButton />
        }} />
        <productStack.Screen name='ProductDetails' component={ProductDetals} options={{
            headerTitle: () => renderTitle('Product Detail'),
        }} />
        <productStack.Screen name='ProductFilter' component={ProductFilterModal} options={{
            presentation: 'containedModal',
            animation: 'slide_from_right',

        }} />
    </productStack.Navigator>
);
const Tab = createBottomTabNavigator();
const tabArr = [
    { route: 'Dashboard', label: 'Board', type: Icons.Ionicons, icon: 'speedometer-outline', component: DashboardScreen },
    { route: 'Customers', label: 'Customers', type: Icons.Ionicons, icon: 'people-outline', component: CustomerScreen },
    { route: 'Orders', label: 'Orders', type: Icons.Ionicons, icon: 'basket-outline', component: OrderScreen },
    { route: 'Products', label: 'Products', type: Icons.Ionicons, icon: 'grid-outline', component: ProductScreen },
    { route: 'Settings', label: 'Setting', type: Icons.Ionicons, icon: 'settings-outline', component: FriendMain },
];
const renderTitle = (title) => (
    <Text style={{ fontFamily: Font.RalewaySemiBold, fontSize: 16, letterSpacing: 1.2, color: COLORS.lightText, }}>{title}</Text>
)
const AppNavigator = () => {

    return (
        <Tab.Navigator
            screenOptions={{
                unmountOnBlur: true, // for previous page
                headerShown: false,
                tabBarActiveTintColor: COLORS.officialRed,
                tabBarInactiveTintColor: COLORS.lightText,
                headerTitle: () => <Applogo isNavigation={true} />,
                //headerLeft: () => backButton ? renderHeaderLeft() : <></>
            }}>
            {tabArr.map((item, index) => (
                <Tab.Screen
                    key={index}
                    name={item.route}
                    component={item.component}
                    options={{
                        //tabBarButton: (props) => <TabButton {...props} item={item} />
                        headerTitle: () => <Applogo isNavigation={true} />,
                        tabBarIcon: ({ focused, color, size }) => (
                            <Icon type={item.type} name={item.icon} size={size} color={color} />
                        )
                    }}
                />
            ))}
        </Tab.Navigator>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        top: Platform.OS === 'ios' ? 5 : 0,
    },

})
export default AppNavigator


// const TabButton = (props) => {
    //     const { item, onPress, accessibilityState } = props;
    //     const focused = accessibilityState.selected;
    //     const viewRef = useRef(null);

    //     useEffect(() => {
    //         if (focused) {
    //             viewRef.current.animate({ 0: { scale: .3 }, 1: { scale: 1.0 } });
    //         }
    //         else {
    //             viewRef.current.animate({ 0: { scale: 1.0 }, 1: { scale: 1 } });
    //         }
    //     }, [focused]);

    //     return (
    //         <TouchableOpacity onPress={onPress} style={[styles.container]}>
    //             <Animatable.View
    //                 ref={viewRef}
    //                 duration={1000}
    //                 style={styles.circle}>
    //                 <Icon type={item.type} name={item.icon} size={24} color={focused ? COLORS.officialRed : COLORS.lightText} />
    //             </Animatable.View>
    //         </TouchableOpacity>
    //     );
    // }
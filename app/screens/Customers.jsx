import { StyleSheet, View, Text, Button, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Appscreen from '../components/global/Appscreen';

//server process
import customerApi from '../api/customers';
import useApi from '../hooks/useApi';
//utility 
import { useIsFocused } from '@react-navigation/native';
import { AppText, Loader } from '../components/global';
import CustomerItem from '../components/items/CustomerItem';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import storage from '../auth/storage';

const Customers = ({ navigation }) => {
    const isFocused = useIsFocused();
    const [mydata, setMydata] = useState([]);
    // const { data, error, isLoader, request: loadCustomers } = useApi(customerApi.getCustomerreportdata);
    const [error, setError] = useState();
    const getCustomerApi = useApi(customerApi.getCustomerreportdata)
    const loadCustomers = async () => {

        const header = { 'header': false }
        await storage.mergeUserdata(header, async (added) => {
            const result = await getCustomerApi.request();
            if (!result.ok) {
                if (result.data) setError(result.data.error);
                setError("An unexpected error occurred. ");
                return;
            }
            if (result.data != null) {
                setError(false);
                const dataArray = Object.entries(result.data['data']).map(([key, val]) => ({
                    [key]: val,
                    id: uuid(),
                    type: key
                }));
                setMydata(dataArray);
            }
        });

    }
    useEffect(() => {
        loadCustomers();
    }, []);
    return (
        <>
            <Loader visible={getCustomerApi.isLoader} />
            <Appscreen>
                {error && <View style={{ justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                    <AppText style={{ color: '#767676' }}>Couldn't retrieve the customer report.</AppText>
                    <Button title='Retry' onPress={loadCustomers} />
                </View>}
                <View style={styles.container}>

                    <FlatList
                        style={{ padding: 10 }}
                        contentContainerStyle={{ paddingBottom: 20, }}
                        data={mydata}
                        keyExtractor={item => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}

                        renderItem={({ item, index }) => <CustomerItem key={index} item={item} index={index} onPress={() => navigation.navigate('customerList', { 'item': item })} />}

                    />
                </View>
            </Appscreen>
        </>
    )
}

export default Customers
//l
const styles = StyleSheet.create({
    container: {
        flex: 1,

    },
})
//'Settings', { screen: 'ShowSetting' }

  // var string1 = JSON.stringify(data['data']);
            // const parsed = JSON.parse(string1);

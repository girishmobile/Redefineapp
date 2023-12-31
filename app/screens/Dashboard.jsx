import { View, Text, StyleSheet, Dimensions, FlatList, Alert, Image, TouchableOpacity, } from 'react-native'
import React, { useEffect, useState, useContext } from 'react'
const { width, height } = Dimensions.get('screen');
import Appscreen from '../components/global/Appscreen';

import { DashItem } from '../components/items';
import { Icons } from '../components/Icons';
import storage from '../auth/storage';

import useApi from '../hooks/useApi';
import authApi from '../api/auth';
import { Loader } from '../components/global';
import UserContext from '../context/UserContext';


import { launchImageLibrary } from 'react-native-image-picker';

const data = [
    { id: 1, label: 'Master Product Feed', type: Icons.Ionicons, icon: 'grid-outline', sublabel: 'PRODUCT MANAGEMENT' },
    { id: 2, label: 'Content Management', type: Icons.Ionicons, icon: 'people-outline', sublabel: 'CONTENT MANAGEMENT' },
    { id: 3, label: 'Stores', type: Icons.Ionicons, icon: 'storefront-outline', sublabel: 'STORES MANAGEMENT' },
    { id: 4, label: 'Promotions', type: Icons.MaterialCommunityIcons, icon: 'tag-outline', sublabel: 'PROMOTIONS MANAGEMENT' },
    { id: 5, label: 'Settings', type: Icons.Ionicons, icon: 'settings-outline', sublabel: 'Product Management' },
];
const Dashboard = ({ navigation }) => {

    const [isLoader, setIsLoader] = useState(false);
    const { currentuser, setcurrentUser } = useContext(UserContext);
    const getUserApi = useApi(authApi.getUserdata);
    const [isSuperUser, setIsSuperUser] = useState(false);

    const loadUserprofile = async () => {
        setIsLoader(true);
        await storage.getUser(async (user) => {
            if (user != null) {
                const { userId } = user;
                const result = await getUserApi.request(userId);
                setIsLoader(false);
                if (result['data'] != null) {
                    const userdata = result['data']['data'];

                    if (userdata != null) {
                        const { isSuperUser } = userdata;
                        if (isSuperUser != null) {
                            const SuperUser = { "isSuperUser": isSuperUser }
                            await storage.mergeUserdata(SuperUser, async (result) => {

                                if (isSuperUser === true) {
                                    setIsSuperUser(isSuperUser);
                                }
                            });
                        }
                    }
                    else {

                        Alert.alert('Error', 'Oops, something went wrong.\n Token is invalid/expired, please login again', [
                            {
                                text: 'OK',
                                onPress: async () => {
                                    await storage.clearUser();
                                    setcurrentUser({ token: '' });
                                },
                                style: 'default'
                            }
                        ])
                    }
                }

            }
            else {
                setIsLoader(false);
            }
        });
    }
    useEffect(() => {
        loadUserprofile();
    }, []);
    //IMAGE 
    let options = {
        storageOptions: {
            skipBackup: true,
            path: 'images',
        },
    };
    const openImageLibrary = () => {
        console.log('launchImageLibrary');
        try {
            setTimeout(() => launchImageLibrary(options, res => {
                if (res.didCancel) {
                    console.log('User cancelled image picker');
                } else if (res.error) {
                    console.log('ImagePicker Error: ', res.error);
                } else if (res.customButton) {
                    console.log('User tapped custom button: ', res.customButton);

                } else {
                    console.log('imagePath:- ', res.assets[0].uri);

                    setImagePath(res.assets[0].uri);
                }
            }), 400);
        } catch (error) {
            console.warn('error', error);
        }
    }
    const OndashboardItem = (index) => {

        switch (index) {
            case 0:
                navigation.navigate('MasterProductFeed');
                break;
            case 2: {
                navigation.navigate('MasterStore');
                break;
            }
            case 3: {
                navigation.navigate('MasterPromotions');
                break;
            }
            default:
                break;
        }
    }
    return (
        <>
            <Loader visible={isLoader} />

            <Appscreen>
                {
                    isSuperUser && <FlatList
                        style={{ padding: 10 }}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        data={data}
                        keyExtractor={item => item.id}
                        renderItem={({ item, index }) => <DashItem key={index} item={item} index={index} onPress={() => OndashboardItem(index)} />}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                    />
                }

            </Appscreen>
        </>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    listContainer: {
        //flex: 1,
        width: Dimensions.get('window').width / 2 - 20,
        backgroundColor: 'white',
        margin: 10,
        borderRadius: 10,
    },
    imageContainer: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: undefined,
        aspectRatio: 1,
    },
    nameText: {
        color: 'black',
        fontWeight: '700',
        marginLeft: 15,
    },
    priceText: {
        color: 'orange',
        fontWeight: '700',
        marginLeft: 15,
        marginTop: 10,
    },
    button: {
        backgroundColor: '#62513E',
        padding: 10,
        margin: 15,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center'
    },
})
export default Dashboard

/**
 * 
 * const pieData = [
        { value: 34, color: '#177AD5', text: '34%', key: 1, name: 'store 1' },
        { value: 26, color: '#79D2DE', text: '26%', key: 2, name: 'store 2' },
        { value: 20, color: '#ED6665', text: '20%', key: 3, name: 'store 3' },
        { value: 20, color: '#f4ede6', text: '20%', key: 4, name: 'store 4' },
    ];
    
 * <ScrollView style={{}} contentContainerStyle={{}}>
                <View key={uuid()} style={styles.piachartWrap}>
                    <Piachart pieData={pieData} />
                </View>
                <View key={'customer'} style={styles.piachartWrap}>
                    <View style={{ padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: '700' }}> TOTAL ORDER 1200</Text>
                    </View>
                </View>
            </ScrollView>
 */
import { StyleSheet, Text, View, Switch, TouchableOpacity, Alert, ScrollView, Image, } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { COLORS } from '../constant';
import Card from '../components/Card';
import { useIsFocused } from '@react-navigation/native';
import storage from '../auth/storage';
import Appscreen from '../components/global/Appscreen';
import Icon, { Icons } from '../components/Icons';
import UserContext from '../context/UserContext';
import { Loader } from '../components/global';
import AppBiometrics from '../config/AppBiometrics';
import BiometricModal from '../components/BiometricModal';


//API 
import useApi from '../hooks/useApi';
import authApi from '../api/auth';

const Settings = () => {



    const isFocused = useIsFocused();
    const [isEnabled, setIsEnabled] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const { currentuser, setcurrentUser } = useContext(UserContext);
    const [openBiometric, setIsOpenBiometric] = useState(false);

    const logoutApi = useApi(authApi.logout);

    const toggleSwitch = async () => {
        if (isEnabled) {

            const Isbiometric = { Isbiometric: false }
            setIsLoader(true);
            await storage.mergeUserdata(Isbiometric, async (result) => {
                setIsLoader(false);
            });
        }
        else {
            setIsOpenBiometric(true);
            console.log('isEnabled :- ', !isEnabled);

        }
        setIsEnabled(previousState => !previousState);
    }
    const isEnableBiometrics = async () => {
        AppBiometrics.checkBiometricsIsSupported(async (resultObject) => {
            const { available } = resultObject;
            if (available) {
                AppBiometrics.authBiometrics(async (result) => {
                    if (result) {
                        const biometric = { Isbiometric: true }
                        await storage.mergeUserdata(biometric, async (result) => {
                            setcurrentUser({ token: 'redefine101' });
                        })
                    }
                    else if (!result) {
                        console.log('Biometric authentication failed or cancel')
                    }
                    else {
                        console.log('Biometric authentication error...')
                    }
                    setIsLoader(false);
                });
            }
            else {
                console.log('Biometric authentication error');
            }

        });
    }
    const getUserCredential = async () => {

        await storage.getUser(async (user) => {
            if (user != null) {
                const { Isbiometric } = user;
                if (Isbiometric === true) {
                    setIsEnabled(true);
                }
            }
        });
    }




    useEffect(() => {


        getUserCredential();

    }, [isFocused]);
    const logoutbutton = async () => {

        const logout = { 'header': true, }
        await storage.mergeUserdata(logout, async (logoutadd) => {
            const logoutObj = {
                "browser": "Chrome/114.0.0.0 - (Windows NT 10.0; Win64; x64)",
                "location": "RI",
                "ipAddress": "127.0.0.0",
                "macAddress": "00-00-00-00-00-00"
            }
            setIsLoader(true);
            const result = await logoutApi.request(logoutObj);
            setIsLoader(logoutApi.isLoader);
            if (result['data'] != null) {
                await storage.clearUser();
                const logoutdata = result['data'];
                const logoutSuccess = logoutdata['data'];
                if (logoutSuccess === 'Success') {

                    setcurrentUser({ token: '' });
                }
                else {
                    Alert.alert('Error', 'Oops, something went wrong.\n Token is invalid/expired, please login again', [
                        {
                            text: 'OK',
                            onPress: () => {
                                setcurrentUser({ token: '' });
                            },
                            style: 'default'
                        }
                    ])
                }

            }
            else {
                await storage.clearUser();
                setcurrentUser({ token: '' });
            }
        });

    }
    const logout = () => {
        Alert.alert('Logout', 'Do you want to logout from redefine mobile app. if yes to press logout  otherwise press cancel',
            [
                {
                    text: 'Cancel',
                    onPress: () => { },
                    style: 'Cancel',

                },
                {
                    text: 'Logout',
                    onPress: () => logoutbutton(),
                    style: 'destructive'

                }
            ]);
    }
    return (

        <>
            <Loader visible={isLoader} />
            <Appscreen>
                <View style={{ flex: 1 }}>
                    <View style={styles.itemContainer}>
                        <Text style={styles.text}>
                            Setup simple authentication with your existing security from your
                            device.
                        </Text>
                        <Switch
                            trackColor={{ false: '#757575', true: COLORS.officialRed }}
                            thumbColor={isEnabled ? '#fff' : '#fff'}
                            ios_backgroundColor={COLORS.textBgcolor}
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                    <TouchableOpacity style={styles.itemContainer} onPress={logout} >
                        <Text style={styles.text}> Logout</Text>
                        <Icon type={Icons.SimpleLineIcons} name={'logout'} size={24} color={'#757575'} />
                    </TouchableOpacity>
                </View>
                <BiometricModal open={openBiometric} onSkipped={() => { setIsOpenBiometric(false), setIsEnabled(previousState => !previousState) }} />
            </Appscreen>
        </>
    );


}

export default Settings

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        marginTop: 20,
        marginLeft: 20,
        marginRight: 20,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        padding: 15,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 13,
        opacity: 0.7,
        lineHeight: 20,
        letterSpacing: 1.2,
        flex: 1,
        color: COLORS.titleColor,
    },

})
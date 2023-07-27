import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import Applogo from '../components/global/Applogo';
import Loader from '../components/global/Loader';
import storage from '../auth/storage';
import UserContext from '../context/UserContext';
import AppBiometrics from '../config/AppBiometrics';


const InitailPage = ({ navigation }) => {
    const [isLoader, setIsLoader] = useState(false);
    const isFocused = useIsFocused();

    const [cancelBiometric, setIsCancelBiometric] = useState(false);

    const { currentuser, setcurrentUser } = useContext(UserContext);

    const confirmBiometrics = async () => {

        AppBiometrics.checkBiometricsIsSupported(async (resultObject) => {
            const { available } = resultObject;
            if (available) {

                AppBiometrics.authBiometrics((result) => {
                    if (result) {
                        setcurrentUser({ token: 'redefine101' });
                    }
                    else if (!result) {
                        setIsCancelBiometric(!result);

                        //Biometric authentication failed or cancel'
                    }
                    else {

                        //Biometric authentication error.
                    }
                    setIsLoader(false);
                })
            }
            else {

                setIsLoader(false);
            }
        });
    }
    const getUserdata = async () => {


        await storage.getUser(async (user) => {

            setIsLoader(false);

            if (user != null) {
                const { Islogin, Isbiometric, } = user;
                if (Islogin && Isbiometric === true) {
                    setIsLoader(true);
                    // setcurrentUser({ token: 'redefine101' });
                    confirmBiometrics();
                }
                else if (Islogin && Isbiometric === false) {

                    console.log('Islogin:-', Islogin, '= Isbiometric', Isbiometric);

                    navigation.navigate('Login', { 'user': user });
                }
                else {
                    navigation.navigate('Login', { 'user': null });
                }
            }
            else {
                navigation.navigate('Login', { 'user': null });
            }

        })
    }
    useEffect(() => {
        setIsLoader(true);
        getUserdata();
    }, []);
    return (
        <>
            <Loader visible={isLoader} />
            <View style={styles.container}>
                <Applogo />
            </View>
        </>
    )
}

export default InitailPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    }
})
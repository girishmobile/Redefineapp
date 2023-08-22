import { View, Text, TouchableOpacity, StyleSheet, Switch, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform, Image, Alert } from 'react-native'
import React, { useContext, useEffect, useState, } from 'react'
import { COLORS, SIZES } from '../constant'
//components
import { AppText, Applogo, Appscreen, Loader } from '../components/global'
import Card from '../components/Card'
import { AppForm, AppFormField, SubmitButton } from '../components/forms';
import AppBiometrics from '../config/AppBiometrics';
import * as Yup from 'yup';
import Verification from '../components/Verification';
import { useIsFocused } from '@react-navigation/native';
import UserContext from '../context/UserContext';
import Icon, { Icons } from '../components/Icons';
import storage from '../auth/storage';
import useApi from '../hooks/useApi'
import authApi from '../api/auth'
import { getIpAddress, getMacAddress } from 'react-native-device-info';
import Font from '../config/CustomFont'

const validationSchema = Yup.object().shape({
    email: Yup.string().required().email().label('Email'),
    password: Yup.string().required().min(4).label('Password')
})
const Login = ({ route }) => {
    const { user } = route.params;

    const { currentuser, setcurrentUser } = useContext(UserContext);
    const [openVerify, setIsOpenVerify] = useState(false);
    const [openBiometrics, setIsOpenBiometrics] = useState(false);
    const [ipAddress, setIpAddress] = useState('10.0.10.151');
    const [macAddress, setMacAddress] = useState('00-33-00-00-00-11');
    //Error handling...
    const [isLoader, setIsLoader] = useState(false);
    const [errorMsg, setIsErrorMsg] = useState('');
    const [Error, setIsError] = useState(false);
    const [userId, setIsUserId] = useState('');
    const [emailId, setIsEmailId] = useState('');
    const isFocused = useIsFocused();
    const loginApi = useApi(authApi.login);
    const authtokenApi = useApi(authApi.sendAuthToken);
    const checkCodeApi = useApi(authApi.checkAuthToken);
    const getUser = async () => {
        if (user != null) {
            const { Islogin, Isbiometric } = user;
            if (Islogin && Isbiometric === true) {
                setcurrentUser({ token: 'redefine101' });
            }
            else if (Islogin && Isbiometric === false) {
                setIsOpenVerify(true);
                setIsOpenBiometrics(true);
            }
            else if (Islogin) {
                setIsOpenVerify(true);
            }
        }
    }
    const getIPAddressAndMacAddress = async () => {

        getIpAddress().then((ip) => {
            setIpAddress(ip);
        });
        getMacAddress().then((macAdd) => {

            setMacAddress(macAdd);
        });
    }
    useEffect(() => {
        if (Platform.OS === 'ios') {

            getIPAddressAndMacAddress();
        }
        else {

        }
        getUser();
    }, [isFocused]);
    const handleSubmit = async (user) => {
        //setIsOpenVerify(true);
        setIsErrorMsg('');
        user = { email: 'girish@redefinesolutions.com', password: 'admin@123', Islogin: true, verifycode: '', Isbiometric: '', verifystatus: false, token: '', userId: '' };
        const me = {
            email: user.email,
            password: user.password,
            ipAddress: ipAddress,
            browser: 'iPhone',
            location: 'Location',
            macAddress: macAddress
        }
        setIsEmailId(user.email);
        setIsLoader(true);
        const response = await loginApi.request(me);
        setIsLoader(loginApi.isLoader);
        if (!response.ok) {
            if (response.data) {
                setIsError(loginApi.error);
                setIsErrorMsg("An unexpected error occurred. ");
            }
            else if (response.status === 404) {
                setIsError(loginApi.error);
                setIsErrorMsg('Oops, something went wrong.\nPlease try again later.');
            }
            else {
                setIsError(loginApi.error);
                setIsErrorMsg("An unexpected error occurred. ");
            }
            return;
        }
        if (response.data != null) {
            const userlogin = response["data"];
            if (!userlogin['data']) {
                setIsError(true);
                return setIsErrorMsg('Email or password invalid.');
            }
            else {
                if (!userlogin['isauthorized']) {
                    //verificalll
                    const userid = userlogin["data"]["userid"];
                    setIsUserId(userid);
                    setIsLoader(true);
                    const result = await authtokenApi.request(userid);
                    setIsLoader(authtokenApi.isLoader);
                    const authdata = result['data'];
                    if (authdata['data']['result']) {
                        setIsOpenVerify(true);
                    }
                }
                else {
                }
            }
        }
        else {
            setIsError(loginApi.error);
            setIsErrorMsg('Oops, something went wrong.\nPlease try again later.');
        }
    }
    const sendOtp = async () => {
        setIsLoader(true);
        const result = await authtokenApi.request(userId);
        setIsLoader(authtokenApi.isLoader);
        const authdata = result['data'];
        if (authdata['data']['result']) {
            //setIsOpenVerify(true);
        }
    }
    const verifyOnPress = async (code) => {
        setIsLoader(true);
        const result = await checkCodeApi.request(userId, code);
        setIsLoader(authtokenApi.isLoader);
        if (result['data'] != null) {
            const checkcode = result['data'];
            if (checkcode['data']['isauthorized']) {
                //local storage
                if (checkcode['data']['token'] != null) {
                    const tokenId = checkcode['data']['token'];
                    const user = {
                        emailId: emailId,
                        userId: userId,
                        tokenId: tokenId,
                        Islogin: true,
                        Isbiometric: false,
                        header: false,
                        userId: userId
                    }
                    setIsLoader(true);
                    await storage.storeUser(user, (result) => {
                        setIsLoader(false);
                        setIsOpenBiometrics(true);
                        //setcurrentUser({ token: 'redefine101' });
                    });
                }
            }
            else {
                Alert.alert('Redefine', "You have entered a wrong code.\n Please enter valid code to continue...");
            }
        }
        // setIsLoader(true);
        // const status = { 'verifystatus': true, verifycode: code }
        // await storage.mergeUserdata(status, async (result) => {
        //     setIsOpenBiometrics(true);
        //     setIsLoader(false);
        // });
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
    const biomatricIsEnabled = (isEnabled) => {
        if (isEnabled) {
            setIsLoader(true);
            isEnableBiometrics();
        }
        else {
            setcurrentUser({ token: 'redefine101' })
        }
    }
    const renderLoginPopup = () => {
        return (
            <Card>
                <Applogo />
                <Text style={styles.welcome} >Welcome !</Text>
                <AppForm
                    initialValues={{ email: "", password: "" }}
                    onSubmit={handleSubmit}
                // validationSchema={validationSchema}
                >
                    <AppFormField
                        icon='mail-outline'
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder='Email'
                        keyboardType="email-address"
                        name="email"
                        textContentType="emailAddress"
                    />
                    <AppFormField
                        icon="lock-closed-outline"
                        autoCapitalize="none"
                        autoCorrect={false}
                        placeholder='Password'
                        name="password"
                        secureTextEntry={true}
                        textContentType='password'
                    />
                    <SubmitButton title={'Login'} />
                </AppForm>
            </Card>
        );
    }
    const renderVerifyPopup = () => {
        return (
            <Card>
                {!openBiometrics ? <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Applogo />
                    <Verification onPress={code => verifyOnPress(code)} onResend={sendOtp} />
                </View> : renderBiometricsPop()}
            </Card>
        );
    }
    const renderBiometricsPop = () => {
        return (
            <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <Applogo />
                <Icon style={{ marginVertical: 10 }} name={'shield-checkmark-outline'} color={COLORS.secondary} size={41} type={Icons.Ionicons} />
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                    <Text style={[styles.text,]}>{`Do you want to allow Redefine Solutions App to use biometrics. like (FaceId or TouchID) authentication ?`}</Text>
                </View>
                <TouchableOpacity style={styles.buttonStyle} onPress={() => biomatricIsEnabled(true)}>
                    <Text style={styles.buttonText}>Enable</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSkip} onPress={() => biomatricIsEnabled(false)}>
                    <Text style={[styles.buttonText, { color: COLORS.officialRed }]}>Skip</Text>
                </TouchableOpacity>
            </View>
        );
    }
    return (
        <>
            <Loader visible={isLoader} />
            <Appscreen>
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            {Error && <View style={{ justifyContent: 'center', alignItems: 'center', }}>
                                <AppText style={{ color: COLORS.secondary }}>{errorMsg}</AppText>
                            </View>}
                            {!openVerify ? renderLoginPopup() : renderVerifyPopup()}
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Appscreen>
        </>
    )
}
export default Login
const styles = StyleSheet.create({
    welcome: {
        fontSize: 28,
        marginVertical: SIZES.base * 1.5,
        textAlign: 'center',
        letterSpacing: 1.2,
        fontFamily: Font.RalewayBold,
        color: COLORS.titleColor,
        opacity: 0.8
    },
    text: {
        color: COLORS.titleColor,
        fontSize: 14,
        opacity: 0.7,
        marginTop: 10,
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginVertical: 10,
        letterSpacing: 1.2,
        fontFamily: Font.RalewaySemiBold
    },
    sendlinkText: {
        fontSize: 13,
        color: COLORS.titleColor,
        opacity: 0.7, marginTop: 10,
        alignSelf: 'flex-start',
        letterSpacing: 1.2,
        fontFamily: Font.RalewayRegular,

    },
    buttonStyle: {
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.base,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 12,
        marginTop: SIZES.base * 2,
        fontFamily: Font.RalewayBold
    },
    buttonSkip: {
        backgroundColor: COLORS.primary,
        borderRadius: SIZES.base,
        borderWidth: 0.5,
        borderColor: COLORS.lighRed,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 12,
        marginTop: SIZES.base * 1.5,

    },
    buttonText: {
        color: COLORS.primary,
        fontSize: 15,
        textTransform: 'uppercase',
        letterSpacing: 1.2,
        fontFamily: Font.RalewayBold,
    }
});
/**
 *  const sign = require('jwt-encode');
        const secret = 'secret';
        const jwtToken = sign(user, secret);
        const userdata = jwtDecode(jwt);
        console.log('userdata:- ', userdata);
 * const getOneDayToLocal = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('OneDay');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        return null;
    }
}
const setUserTolocal = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem('USER', jsonValue);
    } catch (error) {
        console.log('userlocal error', error);
    }
}
 */
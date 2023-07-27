import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { COLORS } from '../constant';
import AppButton from './global/AppButton';
import { ErrorMessage } from '../components/forms'
import BackgroundTimer from 'react-native-background-timer';
import Font from '../config/CustomFont';

const CELL_COUNT = 6;

const Verification = ({ onPress, onResend }) => {

    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [isValidCode, setIsValidCode] = useState(false);

    //Time count-down
    //  const [second, setIsSecond] = useState(59);

    const [minutes, setIsMinutes] = useState(1);
    const [disableRes, setIsDisableRes] = useState(true);
    const [disabled, setIsDisabled] = useState(true);
    //BackgroundTimer 
    const [secondsLeft, setSecondsLeft] = useState(59);
    const [timerOn, setTimerOn] = useState(true);
    const handleOnResend = () => {
        setIsDisableRes(true);
        setSecondsLeft(59);
        setIsMinutes(1);
    }
    const handleVerifyCode = () => {

        if (value.length < 6) {
            setIsValidCode(true)
            return;
        }
        setIsValidCode(false);
        onPress(value);
    }
    useEffect(() => {
        if (value.length === 6) {
            setIsDisabled(false);
            return;
        }
        else {
            setIsDisabled(true);
        }

    }, [value]);
    useEffect(() => {
        const intervalId = BackgroundTimer.setInterval(() => {
            if (secondsLeft > 0) {
                const mysec = secondsLeft - 1;
                setSecondsLeft(mysec);
            }
            if (secondsLeft === 0) {
                if (minutes === 0) {
                    setIsDisableRes(false);
                    BackgroundTimer.clearInterval(intervalId);
                }
                else {
                    setSecondsLeft(59);
                    const mymin = minutes - 1;
                    setIsMinutes(mymin);
                }
            }
        }, 1000);
        return () => {
            BackgroundTimer.clearInterval(intervalId);
        }

    }, [secondsLeft]);

    //Now we need to define another useEffect hook to handle 
    //when secondsLeft reaches 0 so the backgroundTimer can be stopped
    return (
        <View style={{ width: '100%' }} >
            <Text style={styles.text}>Two-Factor Authentication</Text>
            <CodeField
                ref={ref}
                {...props}
                value={value}
                onChangeText={setValue}
                cellCount={CELL_COUNT}
                rootStyle={styles.codeFieldRoot}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoFocus={true}
                renderCell={({ index, symbol, isFocused }) => (
                    <Text
                        key={index}
                        style={[styles.cell, isFocused && styles.focusCell]}
                        onLayout={getCellOnLayoutHandler(index)}
                    >
                        {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                )}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                <Text style={[styles.timerText,]}>Timeout: {minutes} : {secondsLeft}</Text>
                <TouchableOpacity onPress={() => handleOnResend()} disabled={disableRes}>
                    <Text style={[styles.timerText, { color: COLORS.blueText, opacity: disableRes ? 0.7 : 1, fontWeight: '500' }]}>Resend Otp</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.text}>A message with a verification code has been sent to your devices. Enter the code to continue.</Text>
            <AppButton title={'Verify'} onPress={handleVerifyCode} disabled={disabled} />
            {/* <View style={{ marginVertical: 10 }}>
                <ErrorMessage error={'Enter valid 6 digit code'} visible={isValidCode} />
            </View> */}
        </View>
    )
}
//            

const styles = StyleSheet.create({

    codeFieldRoot: {
        marginTop: 0,

    },
    cell: {
        width: 42,
        height: 42,
        lineHeight: 38,
        fontSize: 18,
        borderWidth: 1,
        borderColor: COLORS.bgColor,
        textAlign: 'center',
        color: COLORS.titleColor,
        marginHorizontal: 3,

    },
    focusCell: {
        borderColor: 'rgba(212,16,34,0.4)'
    },
    timerText: {
        fontSize: 14,
        color: COLORS.titleColor,
        opacity: 0.7,
        padding: 5,
        letterSpacing: 1.2,
        fontFamily: Font.RalewaySemiBold,
    },
    text: {
        color: COLORS.titleColor,
        fontSize: 15,
        opacity: 0.7,
        textAlign: 'left',
        alignSelf: 'flex-start',
        marginVertical: 10,
        letterSpacing: 1.2,
        fontFamily: Font.RalewaySemiBold,
    },
})
export default Verification

/**
 *  
        const myInterval = setInterval(() => {
            if (second > 0) {
                const mysec = second - 1;
                setIsSecond(second => second - 1);
            }
            if (second === 0) {
                if (minutes === 0) {
                    setIsTimeout(true);
                    setIsDisableRes(false);
                    clearInterval(myInterval);
                }
                else {
                    setIsMinutes(minutes - 1);
                    setIsSecond(59);
                }
            }
        }, 1000);

        return () => clearInterval(myInterval);


        //BackTimer
         const intervalId = BackgroundTimer.setInterval(() => {
            if (second > 0) {
                const mysec = second - 1;
                setIsSecond(mysec);
            }
            if (second === 0) {
                if (minutes === 0) {
                    setIsDisableRes(false);
                    BackgroundTimer.clearInterval(intervalId);
                }
                else {
                    setIsSecond(59);
                    const mymin = minutes - 1;
                    setIsMinutes(mymin);
                }
            }
        }, 1000);
        return () => {
            BackgroundTimer.clearInterval(intervalId);
        }

        1:59 second login
        // const myInterval = setInterval(() => {
        //     if (second > 0) {
        //         const mysec = second - 1;
        //         setIsSecond(mysec);
        //     }
        //     if (second === 0) {
        //         if (minutes === 0) {
        //             setIsDisableRes(false);
        //             clearInterval(myInterval);
        //         }
        //         else {
        //             setIsSecond(59);
        //             setIsMinutes(minutes - 1);
        //         }
        //     }
        // }, 1000);
        // return () => {
        //     clearInterval(myInterval);
        // }
 */
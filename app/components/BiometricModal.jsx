import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Applogo } from './global';
import Icon, { Icons } from './Icons';
import Card from './Card';
import { COLORS, SIZES } from '../constant';

const BiometricModal = ({ open, onSkipped, onEnabled }) => {

    const skippedBiometrics = () => {
        onSkipped();
    }
    return (
        <Modal animationType='fade' transparent={true} visible={open}>
            <View style={styles.container}>
                <Card>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                        <Applogo />
                        <Icon style={{ marginVertical: 10 }} name={'shield-checkmark-outline'} color={COLORS.secondary} size={41} type={Icons.Ionicons} />
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
                            <Text style={[styles.text,]}>{`Do you want to allow Redefine Solutions App to use biometrics. like (FaceId or TouchID) authentication ?`}</Text>
                        </View>
                        <TouchableOpacity style={styles.buttonStyle} onPress={() => biomatricIsEnabled(true)}>
                            <Text style={styles.buttonText}>Enable</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonSkip} onPress={() => skippedBiometrics()}>
                            <Text style={[styles.buttonText, { color: COLORS.officialRed }]}>Skip</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </View>
        </Modal>
    );
}

export default BiometricModal

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: "rgba(0,0,0,0.4)",
        justifyContent: 'center',
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
        lineHeight: 20
    },
    buttonStyle: {
        backgroundColor: COLORS.secondary,
        borderRadius: SIZES.base,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 12,
        marginTop: SIZES.base * 2,
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
        fontWeight: '700',
        letterSpacing: 1.2,
    }
})
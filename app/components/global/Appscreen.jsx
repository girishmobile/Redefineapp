import { View, Text, SafeAreaView, StyleSheet, useColorScheme, ImageBackground } from 'react-native'
import React from 'react'
import { IMGS } from '../../constant'
import FastImageView from './FastImageView'

const Appscreen = ({ children }) => {

    return (

        <ImageBackground source={IMGS.bg} style={{ width: '100%', height: '100%' }}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1, }}>
                    {children}
                </View>
            </SafeAreaView>
        </ImageBackground>
    )
}
export default Appscreen

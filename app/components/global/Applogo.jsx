import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { IMGS } from '../../constant'

const Applogo = ({ isNavigation = false }) => {
    return (
        <Image source={IMGS.logo} style={[styles.imglogo, { width: isNavigation ? 140 : 200, height: isNavigation ? 35 : 50 }]} />
    )
}
const styles = StyleSheet.create({
    imglogo: {
        width: 200,
        height: 50,
        resizeMode: 'contain',
    },

})
export default Applogo
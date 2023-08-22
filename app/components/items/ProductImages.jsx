import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React from 'react'
import FastImageView from '../global/FastImageView'
import { COLORS } from '../../constant'

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('screen');

const ProductImages = ({ item }) => {
    return (
        <View style={styles.container}>
            <FastImageView imageUrl={`${item['imagePath']}`} />
        </View>
    )
}
export default ProductImages

const styles = StyleSheet.create({
    container: {
        width: SCREEN_WIDTH,
        height: undefined,
        backgroundColor: COLORS.textBgcolor,
        aspectRatio: 1,
        // padding: 10,

    }
})
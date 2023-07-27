import { StyleSheet, Text, View, TouchableOpacity, Dimensions, } from 'react-native'
import React from 'react'
import { COLORS, } from '../../constant';
import FastImageView from '../global/FastImageView';
import GlobalStyle from '../../styles/GlobalStyle';
const { width } = Dimensions.get('screen');
const ProductItem = ({ item, index, onPress }) => {
    const indexrow = index + 1;
    let imageUrl = '';
    const recStatus = item['recStatus'];
    if (item['productImage'] != null && item['productImage'].length > 0) {
        imageUrl = item['productImage'][0];
        const fchar = imageUrl.substring(0, 1);
        if (fchar === '/') {
            imageUrl = imageUrl.replace(fchar, '');
        }
    }
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <View style={styles.itemContainer(indexrow)} >
                {imageUrl != 'NoImage' && <View style={styles.imageContainer}>
                    <FastImageView imageUrl={imageUrl} />
                </View>}
                <Text style={[GlobalStyle.nameText, { minHeight: 40, }]}>{item.name}</Text>
                <Text style={[GlobalStyle.brandText, { minHeight: 40 }]}>{`Brand: ${item.brandName}`}</Text>
                <Text style={GlobalStyle.priceText}>{`Price:-$${item.salePrice}`}</Text>
                <View style={styles.button(recStatus)}>
                    <Text style={styles.buttonText(recStatus)}>{recStatus === 'A' ? 'Active' : recStatus === 'I' ? 'Inactive' : 'Draft'}</Text>
                </View>
            </View >
        </TouchableOpacity>
    );
}
export default ProductItem
const styles = StyleSheet.create({
    itemContainer: (index) => ({
        backgroundColor: '#fff',
        borderRadius: 4,
        width: (width / 2) - 15,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: index % 2 === 0 ? 5 : 0,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,

    }),
    imageContainer: {
        margin: 10,
        borderRadius: 10,
        overflow: 'hidden'
    },
    button: (recStatus) => (
        {
            backgroundColor: recStatus === 'A' ? 'rgba(220, 252, 231,1)' : recStatus === 'I' ? 'rgba(241, 169, 171,1)' : 'rgba(241, 245, 249,1)',
            padding: 7,
            margin: 15,
            borderRadius: 4,
            width: '80%',
            borderColor: recStatus === 'A' ? 'rgba(134,239 , 172,1)' : recStatus === 'I' ? 'rgba(228, 83, 122, 1)' : 'rgba(241, 245, 249, 1)', //71-85-105
            borderWidth: 0.6,
        }
    ),
    buttonText: (recStatus) => (
        {
            color: recStatus === 'A' ? 'rgba(22, 163, 74,1)' : recStatus === 'I' ? 'rgba(198,36 ,40,1)' : 'rgba(71,85 ,105,1)',
            textAlign: 'center',
            fontSize: 12,
            letterSpacing: 1.2,
            fontWeight: '500'
        }
    ),
});

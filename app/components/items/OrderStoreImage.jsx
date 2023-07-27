import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { IMGS } from '../../constant';
import FastImage from 'react-native-fast-image'

const OrderStoreImage = ({ imageURL }) => {

    let IMGURL = '';
    if (imageURL != null && imageURL.length > 0) {
        IMGURL = imageURL;
        const fchar = IMGURL.substring(0, 1);
        if (fchar === '/') {
            IMGURL = IMGURL.replace(fchar, '');
        }
        console.log(`${IMGS.baseUrl}${IMGURL}`);
    }
    return (
        <View style={{ backgroundColor: 'orange' }}>
            <Text>OrderStoreImage</Text>


            <FastImage

                style={{ width: 200, height: 200 }}
                source={{
                    uri: 'https://facebook.github.io/react/img/logo_og.png',
                    headers: { Authorization: 'someAuthToken' },
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
        </View>
    )
}

export default OrderStoreImage

const styles = StyleSheet.create({})
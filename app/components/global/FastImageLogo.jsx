import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import FastImage from 'react-native-fast-image';
import { COLORS, IMGS } from '../../constant';

const FastImageLogo = ({ imageUrl }) => {

    const [loading, setIsLoading] = useState(false)

    let IMGURL = '';
    if (imageUrl != null && imageUrl.length > 0) {
        IMGURL = imageUrl

        const fchar = IMGURL.substring(0, 1);
        if (fchar === '/') {
            IMGURL = IMGURL.replace(fchar, '');
        }
    }

    return (
        <View style={styles.imageContainer}>
            <FastImage
                style={[styles.image,]}
                source={{
                    uri: `${IMGS.baseUrl}${IMGURL}`,
                    priority: FastImage.priority.normal,

                }}
                resizeMode='contain'
                onLoadStart={() => setIsLoading(true)}
                onLoadEnd={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
            <ActivityIndicator animating={loading} style={{ position: 'absolute', zIndex: 1, }} />
        </View>
    )
}

export default FastImageLogo

const styles = StyleSheet.create({

    image: {
        width: '50%',
        height: 'auto',
        overflow: 'hidden',
        aspectRatio: 1,
    },
    imageContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 10,
        backgroundColor: COLORS.primary,
        borderColor: COLORS.borderColor,
        borderWidth: 0.75
    },
}) 
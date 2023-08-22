import { StyleSheet, Text, View, ActivityIndicator, Dimensions } from 'react-native'
import React, { useMemo, useState } from 'react'
import { COLORS, IMGS } from '../../constant'
import FastImage from 'react-native-fast-image'
const { width: SCREEN_WIDTH } = Dimensions.get('screen')
const FastImageView = ({ imageUrl, resizeMode = 'cover' }) => {

  const [loading, setIsLoading] = useState(false)
  let IMGURL = '';
  if (imageUrl != null && imageUrl.length > 0) {
    IMGURL = imageUrl

    const fchar = IMGURL.substring(0, 1);
    if (fchar === '/') {
      IMGURL = IMGURL.replace(fchar, '');
    }
  }
  return useMemo(() => (

    <View style={{ justifyContent: 'center', alignItems: 'center', }}>
      <FastImage
        style={[styles.image,]}
        source={{
          uri: `${IMGS.baseUrl}${IMGURL}`,
          priority: FastImage.priority.normal,

        }}
        resizeMode={resizeMode}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => setIsLoading(false)}
      />
      <ActivityIndicator animating={loading} style={{ position: 'absolute', zIndex: 1, }} />
    </View>
  ));
}

export default FastImageView

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: undefined,
    backgroundColor: COLORS.textBgcolor,
    aspectRatio: 1,
  },
})
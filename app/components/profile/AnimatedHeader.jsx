import { StyleSheet, Text, View, Image, Animated } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
const HEADER_HEIGHT = 200;

const AnimatedHeader = ({ animatedValue }) => {
    const insets = useSafeAreaInsets();
    const headerHeight = animatedValue.interpolate({
        inputRange: [0, HEADER_HEIGHT + insets.top],
        outputRange: [HEADER_HEIGHT + insets.top, insets.top + 44],
        extrapolate: 'clamp'
    })
    return (
        <Animated.View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            height: headerHeight,
            backgroundColor: 'lightblue'
        }}>
            <Image source={require('../../assets/banner.jpg')} style={{ flex: 1, width: '100%', height: '100%' }} />

        </Animated.View>
    )
}

export default AnimatedHeader

const styles = StyleSheet.create({})
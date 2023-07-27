
import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

const Loader = ({ visible = false }) => {
    if (!visible) return null;

    return (
        <View style={styles.overlay}>
            <LottieView
                autoPlay
                loop
                source={require('../../assets/animations/loader.json')}
            />
        </View>
    )
}
const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 1,
        backgroundColor: 'white',
        opacity: 0.7
    },
});
export default Loader
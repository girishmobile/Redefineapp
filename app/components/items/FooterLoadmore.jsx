import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { COLORS } from '../../constant'
const FooterLoadmore = ({ OnloadMore }) => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.loadMoreBtn}
                activeOpacity={0.9}
                onPress={() => OnloadMore()}
            >
                <Text style={styles.btnText}>Load More</Text>
            </TouchableOpacity>
        </View>
    )
}
export default FooterLoadmore
const styles = StyleSheet.create({
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: COLORS.lightText,
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#fff',
        fontSize: 13,
        textAlign: 'center',
        letterSpacing: 1.2,
    }
})
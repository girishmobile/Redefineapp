import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Font from '../../config/CustomFont'
import { COLORS } from '../../constant'

const LoadMoreBtn = ({ totalPages, pageIndex, OnloadMore }) => {
    return (
        <View style={styles.footer}>
            <TouchableOpacity style={styles.loadMoreBtn}
                onPress={() => OnloadMore()}
            >
                <Text style={styles.btnText}>Load More {`[${pageIndex}/${totalPages}]`}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LoadMoreBtn

const styles = StyleSheet.create({
    footer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    loadMoreBtn: {
        padding: 10,
        backgroundColor: 'rgba(99,102, 241, 1)',
        borderRadius: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnText: {
        color: '#fff',
        fontFamily: Font.RalewaySemiBold,
        fontSize: 13,
        textAlign: 'center',
        letterSpacing: 1.2,
    },

})
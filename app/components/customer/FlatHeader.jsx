import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLORS } from '../../constant'

const FlatHeader = ({ title }) => {
    return (
        <View style={styles.container}>
            <View style={styles.item}>
                <Text>FlatHeader</Text>
            </View>
            <View style={styles.item}>
                <Text>FlatHeader</Text>
            </View>
        </View>
    )
}

export default FlatHeader

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',

    },
    item: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.lightText,
        padding: 10,
        opacity: 0.7,
        marginHorizontal: 5,
        //marginHorizontal: 10,
    }
})
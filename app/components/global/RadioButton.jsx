import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import Icon, { Icons } from '../Icons'
import { COLORS } from '../../constant'
import Font from '../../config/CustomFont'

const RadioButton = ({ data, onSelected, onClear, isSelected = '' }) => {
    const [userOption, setUserOption] = useState(isSelected);

    const onSelectedStatus = (recStatus) => {
        setUserOption(recStatus);

        onSelected(recStatus);

    }
    const onClearStatus = () => {
        setUserOption('');
        onClear();
    }
    const Drawline = () => (
        <View style={{ width: '100%', height: 1, backgroundColor: COLORS.borderColor, opacity: 0.5 }}></View>
    );
    return (
        <>
            <View style={{ padding: 10, }}>
                {
                    data.map((item, index) => {
                        return <View key={index.toString()} style={{ flexDirection: 'row', marginVertical: 5 }}>
                            <TouchableOpacity onPress={() => onSelectedStatus(item.label)}>
                                <Icon type={Icons.Ionicons} name={item.label === userOption ? 'ios-radio-button-on-outline' : 'ios-radio-button-off-outline'} size={22} color={item.label === userOption ? 'rgba(99,102, 241, 1)' : COLORS.lightText} />
                            </TouchableOpacity>
                            <Text style={[styles.titleText, { alignSelf: 'center' }]}>{item.label}</Text>
                        </View>
                    })

                }
            </View>
            <View>
                {/* <Drawline />
                <TouchableOpacity style={styles.clearBtn} onPress={() => onClearStatus()}>
                    <Text style={styles.semiboldText}>Clear</Text>
                </TouchableOpacity> */}
            </View>
        </>
    )
}
export default RadioButton
const styles = StyleSheet.create({
    titleText: {
        fontSize: 13,
        fontFamily: Font.RalewayRegular,
        textAlign: 'left',
        letterSpacing: 1.2,
        opacity: 0.7,
        marginLeft: 5,
        flex: 1
    },
    semiboldText: {
        color: COLORS.lightText,
        fontFamily: Font.RalewaySemiBold,
        fontSize: 13,
        letterSpacing: 1.2,
    },
    clearBtn: {

        width: 70,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }

})
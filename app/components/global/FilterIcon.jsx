import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import Font from '../../config/CustomFont'
import { COLORS } from '../../constant'
import Icon, { Icons } from '../Icons'

const FilterIcon = ({ filterCount = 0, onPress }) => {
    return (
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={styles.container} onPress={() => onPress()}>
                {
                    filterCount > 0 && <View style={{ zIndex: 1, marginRight: -10, width: 20, height: 20, backgroundColor: 'rgba(99,102,241,1)', borderRadius: 10, justifyContent: 'center', alignItems: 'center', }}>
                        <Text style={{ textAlign: 'center', fontFamily: Font.RalewaySemiBold, fontSize: 12, color: COLORS.primary, }}>{filterCount}</Text>
                    </View>
                }
                <Icon type={Icons.Ionicons} name={'options-outline'} size={30} color={filterCount > 0 ? 'rgba(99,102, 241, 1)' : COLORS.lightText} />
            </TouchableOpacity>
        </View>
    )
}

export default FilterIcon

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    },

})
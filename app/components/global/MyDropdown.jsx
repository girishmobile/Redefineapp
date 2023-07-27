import { StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker'
import { COLORS } from '../../constant';
import Font from '../../config/CustomFont';
const MyDropdown = ({ stores, onSelecte, placeholder = true }) => {
    //dropdown
    let placeText = 'All store...';
    if (placeholder) {
        if (stores.length > 0) {
            const lable = stores[0]['label'];
            placeText = lable;
        }
    }
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const onChangeValue = useCallback(() => {
        onSelecte(value);
    }, [value]);
    return useMemo(() => (
        <DropDownPicker
            listMode='SCROLLVIEW'
            dropDownDirection='BOTTOM'
            open={open}
            value={value}
            style={styles.dropDownstyle}
            textStyle={styles.dropDownTextStyle}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            containerProps={{
                height: open == true ? 330 : 35,
                marginBottom: 10
            }}
            maxHeight={330}
            placeholder={placeText}
            items={stores}
            setOpen={setOpen}
            setValue={setValue}
            onChangeValue={onChangeValue}

        //setItems={setIsStores}
        />
    ));
}
export default MyDropdown
const styles = StyleSheet.create({
    dropDownstyle: {
        borderWidth: 0.5,
        borderColor: COLORS.borderColor,
        borderRadius: 4,
        backgroundColor: COLORS.primary
    },
    dropDownTextStyle: {
        fontSize: 13,
        color: COLORS.lightText,
        fontFamily: Font.RalewayRegular,
        letterSpacing: 1.2
    },
    dropDownContainerStyle: {
        backgroundColor: COLORS.primary,
        borderWidth: 0.5,
        borderColor: COLORS.borderColor,
        marginTop: 0,
    },
})
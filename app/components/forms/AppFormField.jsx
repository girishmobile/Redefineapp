import { View, Text } from 'react-native'
import React from 'react'
import AppTextInput from '../global/AppTextInput';
import ErrorMessage from './ErrorMessage';

import { useFormikContext } from 'formik';
const AppFormField = ({ name, ...otherProps }) => {
    const { setFieldTouched, handleChange, errors, touched } = useFormikContext();
    return (
        <>
            <AppTextInput
                onBlur={() => setFieldTouched(name)}
                onChangeText={handleChange(name)}
                {...otherProps}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]} />
        </>
    )
}
export default AppFormField

 // autoCapitalize="none"
                // autoCorrect={false}
                // placeholder='Email'
                // keyboardType="email-address"
                //textContentType="emailAddress"
                //name="email"
                //onChangeText={text => setIsEmail(text)}
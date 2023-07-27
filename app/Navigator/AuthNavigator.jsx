import { View, Text } from 'react-native'
import React from 'react'
import Login from '../screens/Login'

import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Applogo from '../components/global/Applogo';
import InitailPage from '../screens/InitailPage';
const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name='Initial' component={InitailPage} />
            <Stack.Screen name='Login' component={Login} options={{
                title: '',
                headerTitle: () => <Applogo isNavigation={true} />
            }} />
        </Stack.Navigator>

    )
}
export default AuthNavigator
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, { useState } from 'react';


import AuthNavigator from './app/Navigator/AuthNavigator';
import AppNavigator from './app/Navigator/AppNavigator';
import { UserProvider } from './app/context/UserContext';
import { NavigationContainer } from '@react-navigation/native';
import SignIn from './app/screens/SignIn';
import ChatScreen from './app/screens/ChatScreen';
import ProductList from './app/screens/ProductList';

function App(): JSX.Element {
  let x = 1;
  const [user, setcurrentUser] = useState({ email: '', token: '' })
  console.log('x value =', x);
  return (
    <UserProvider value={{ user, setcurrentUser }}>
      <NavigationContainer>
        {user.token === '' ? <AuthNavigator /> : <AppNavigator />}
      </NavigationContainer>
    </UserProvider>


  );
}
export default App;

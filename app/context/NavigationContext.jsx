import React from 'react';
const NavigationContext = React.createContext({});

export const NaviProvider = NavigationContext.Provider;
export const NaviConsumer = NavigationContext.Consumer;

export default NavigationContext;
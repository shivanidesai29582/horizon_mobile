import "./../../global";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { get, set } from '../storage';
import { darkTheme, defaultTheme, greyTheme } from '../Themehelper/theme';

// App Conext for App Theme, display height and Video Volume
export const AppContext = createContext({});


import WalletConnectProvider from '@walletconnect/react-native-dapp';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SCHEME_FROM_APP_JSON = "Cryptonium";

export const useTheme = () => useContext(AppContext);

export const AppContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(darkTheme);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);
  const [isMute, setIsMute] = useState(true);

  const findOldTheme = async () => {
    const themeMode = await get('themeMode');
    if (themeMode !== null) {
      setTheme(defaultTheme)
      setIsLoadingTheme(false);
    }
    else if (themeMode !== 'dark') {
      setTheme(darkTheme);
      setIsLoadingTheme(false);
    }
    else if (themeMode !== 'grey') {
      setTheme(greyTheme)
      setIsLoadingTheme(false);
    }
    setIsLoadingTheme(false);
  };

  useEffect(() => {
    findOldTheme();
  }, []);

  const updateTheme = (currentThemeMode, newthemeMode) => {
    let newTheme = defaultTheme;
    if (newthemeMode === 'dark' && darkTheme) { newTheme = darkTheme; }
    else if (newthemeMode === 'grey' && greyTheme) { newTheme = greyTheme; }
    setTheme(newTheme);
    set('themeMode', newTheme.themeMode);
  };

  const onSetIsMute = () => {
    setIsMute(!isMute);
  };

  return (
    <AppContext.Provider
      value={{
        isMute,
        setIsMute: onSetIsMute,
        theme,
        isLoadingTheme,
        updateTheme
      }}>
      <WalletConnectProvider
        redirectUrl={
          Platform.OS === "web"
            ? window.location.origin
            : `${SCHEME_FROM_APP_JSON}://`
        }
        storageOptions={{
          asyncStorage: AsyncStorage,
        }}
      >
        {children}
      </WalletConnectProvider>
    </AppContext.Provider>
  );
};

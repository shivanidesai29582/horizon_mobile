import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './app/store/configureStore';
import Router from './app/Router';
import ReactNative from 'react-native';
import { AppContextProvider } from './app/Context';
import { requestUserPermission, notificationListener } from './app/notification/notificationServices'
import ThemeWrapper from './app/Components/ThemeWrapper';
import CustomStatusBar from './app/Components/CustomStatusBar';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const App = () => {
  useEffect(() => {
    try {
      ReactNative.I18nManager.allowRTL(false);
      requestUserPermission();
      notificationListener();
    } catch (e) {
      // console.log(e);
    }
  }, []);

  return (
    // Provider makes the redux store and provide state to components by connect function.
    <AppContextProvider>
      <ThemeWrapper>

        <Provider store={store}>
          {/*PersistGate get data from storage and intialize to state*/}
          <CustomStatusBar />

          <Router />
          {/*<PersistGate loading={<AppContainer/>} persistor={persistor}>*/}
          {/*   */}
          {/*</PersistGate>*/}
        </Provider>
      </ThemeWrapper>

    </AppContextProvider>
  );
}

export default App;

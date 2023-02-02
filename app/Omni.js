/**
 * Created by InspireUI on 17/02/2017.
 *
 * @format
 */
// import { SIDEMENU_CLOSE, SIDEMENU_OPEN, SIDEMENU_TOGGLE } from "@redux/types";
//
// import reactotron from "reactotron-react-native";
// import store from "@store/configureStore";
import { Platform, ToastAndroid, Alert } from 'react-native';
import { Constants } from "../app/common";
import { EventRegister } from 'react-native-event-listeners'
import _Icon from "react-native-vector-icons/MaterialCommunityIcons";
import _IconIO from "react-native-vector-icons/Ionicons";
// import _Validate from "./ultils/Validate";
// import _BlockTimer from "./ultils/BlockTimer";

export const Icon = _Icon;
export const IconIO = _IconIO;
// export const EventEmitter = EventRegister;
// export const Validate = _Validate;
// export const BlockTimer = _BlockTimer;
// export const Reactotron = reactotron;

// TODO: replace those function after app go live
// export const log = (values) => __DEV__ && reactotron.log(values);
// export const warn = (values) => __DEV__ && reactotron.warn(values);
// export const error = (values) => __DEV__ && reactotron.error(values);

/**
 * An async fetch with error catch
 * @param url
 * @param data
 * @returns {Promise.<*>}
 */
/*export const request = async (url, data = {}) => {
  try {
    const response = await fetch(url, data);

    return await response.json();
  } catch (err) {
    error(err);
    return { error: err };
  }
};

// Drawer
export const openDrawer = () =>
  store.dispatch({
    type: SIDEMENU_OPEN,
  });
export const closeDrawer = () =>
  store.dispatch({
    type: SIDEMENU_CLOSE,
  });
export const toggleDrawer = () =>
  store.dispatch({
    type: SIDEMENU_TOGGLE,
  });*/

/**
 * Display the message toast-like (work both with Android and iOS)
 * @param msg Message to display
 * @param duration Display duration
 */
export const toast = (msg, duration = 4000) => {
  (Platform.OS === 'android') ? ToastAndroid.show(msg, duration) : Alert.alert(msg);
  // EventRegister.emit(Constants.EmitCode.Toast, msg, duration);
}


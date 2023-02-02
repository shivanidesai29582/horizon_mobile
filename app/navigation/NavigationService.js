import * as React from 'react';
import { StackActions } from '@react-navigation/native';

export const navigationRef = React.createRef();

export function navigate(name, params) {
    navigationRef.current?.navigate(name, params);

}

export function replace(name, params) {
    navigationRef.current?.dispatch(StackActions.replace(name, params));

}

export function pop() {
    navigationRef.current?.dispatch(StackActions.pop());

}

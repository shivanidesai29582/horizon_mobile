import React from 'react';
import { Text, View } from 'react-native';

const ErrorText = ({ title = "Something's Missing", titleColor, viewStyle = { marginTop: 5, alignSelf: 'flex-start' } }) => {
    return (<View style={viewStyle}><Text style={{ color: titleColor }}>{title}</Text></View>)
}

export default ErrorText;


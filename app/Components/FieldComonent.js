import React from 'react';
import {
    TextInput,
    View,
    Text,
} from 'react-native';
import { Constants } from "../common";
import Color from '../common/Color';
import { useTheme } from './../Context';



export default function FieldComonent({ autoCompleteType, autoFocus, title, secureTextEntry, onChangeText, children, value, exterViewStyle, exterTextStyle, placeholderTextColor = Color.placeHolderGrey, keyboardType, onSubmitEditing }) {
    const { theme } = useTheme();

    return (

        <View style={[{ paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", backgroundColor: '#F4F4F4', borderRadius: 30 }, exterViewStyle]}>
            {children}
            <TextInput onSubmitEditing={onSubmitEditing} keyboardType={keyboardType} autoCompleteType={autoCompleteType} secureTextEntry={secureTextEntry} autoFocus={autoFocus} value={value} onChangeText={onChangeText} style={[{ marginHorizontal: 15, fontSize: 17, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: 'black' }, exterTextStyle]} placeholderTextColor={placeholderTextColor} placeholder={title}></TextInput >
        </View>
    );

}


export function UpdateFieldComponenet({ image, autoCompleteType, autoFocus, title, secureTextEntry, onChangeText, value, exterViewStyle, exterTextStyle, placeholderTextColor }) {
    return (

        <View style={[{ paddingVertical: 5, paddingHorizontal: 10, marginTop: 10, backgroundColor: "#fff", width: '100%' }, exterViewStyle]}>

            <Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 15, alignSelf: 'center', color: '#333333', includeFontPadding: false }}>{title}</Text>
            <TextInput autoCompleteType={autoCompleteType} secureTextEntry={secureTextEntry} autoFocus={autoFocus} value={value} onChangeText={onChangeText} style={[{ fontSize: 13, paddingVertical: 10, backgroundColor: 'rgba(18,110,179,0.10)', borderRadius: 10, paddingHorizontal: 10, marginTop: 5 }, exterTextStyle]} placeholderTextColor={placeholderTextColor} placeholder={title}></TextInput >

        </View>
    );

}

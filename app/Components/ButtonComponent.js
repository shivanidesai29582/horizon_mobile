import React, { Component, useState } from 'react';
import {
    TextInput,
    View,

    TouchableOpacity,
    Text,
} from 'react-native';
import globals from '../common/globals';
import moment from "moment";
import Constants from "../common/Constants";


export default function TimePikerComponent({ disable, extratextstyle, title, extraviewstyle, onPress }) {
    return (
        <TouchableOpacity disabled={disable} onPress={onPress} style={[
            { paddingVertical: 5, borderRadius: 40, backgroundColor: globals.theme_color }, extraviewstyle]}>
            <Text style={[{ fontFamily: Constants.fontFamilyMedium, paddingVertical: 6, color: '#fff', alignSelf: 'center', paddingHorizontal: 15 }, extratextstyle]}>
                {title}
            </Text>

        </TouchableOpacity>
    )

}


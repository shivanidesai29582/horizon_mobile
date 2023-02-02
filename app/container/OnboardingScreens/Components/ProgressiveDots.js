import { View } from "react-native";
import { useEffect, useState } from "react";
import Color from "../../../common/Color";
import React from 'react';
import { useTheme } from './../../../Context';

export default function ProgressiveDots({ selectedIndex }) {
    const { theme } = useTheme();

    const [index, setIndex] = useState(0)
    useEffect(() => {
        setIndex(selectedIndex)
    }, [selectedIndex])

    return (
        <View style={{ flexDirection: 'row', marginRight: 15 }}>
            <View style={{ height: 10, width: index == 0 ? 40 : 10, borderRadius: 5, backgroundColor: index == 0 ? Color.secondary : theme.textColor }} />
            <View style={{ height: 10, width: index == 1 ? 40 : 10, borderRadius: 5, backgroundColor: index == 1 ? Color.secondary : theme.textColor, marginHorizontal: 5 }} />
            <View style={{ height: 10, width: index == 2 ? 40 : 10, borderRadius: 5, backgroundColor: index == 2 ? Color.secondary : theme.textColor }} />
        </View>
    )
}

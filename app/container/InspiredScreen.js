import React from 'react';
import { SafeAreaView, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "../common/Constants";
import { useTheme } from '../Context';

const InspiredScreen = (props) => {
    const { theme } = useTheme();
    
    return (<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, width: '100%', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => {
                props.navigation.pop()
            }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />

            </TouchableOpacity>
            <View style={{ flex: 1 }}>
            </View>
        </View>


        <ScrollView>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 18, textAlign: 'center' }}>To follow other profile that business or creator and engang to grow your community</Text>
            </View>
        </ScrollView>
    </SafeAreaView>
    )
}

export default InspiredScreen;


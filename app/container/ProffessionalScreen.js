import React, { useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Color from '../common/Color';
import Constants from "../common/Constants";
import { useTheme } from '../Context';

const ProffessionalScreen = (props) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);

    return (<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>


        <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, width: '100%', justifyContent: 'space-between' }}>
            <TouchableOpacity onPress={() => {
                props.navigation.pop()
            }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />

            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 20, textAlign: 'center' }}>Horizon for professional</Text>
            </View>
        </View>


        <Image source={require('../Images/ic_proffessional.png')} resizeMode='stretch' style={{ alignSelf: 'center', marginTop: 20, height: 150, width: 325 }} />

        <View style={{ flex: 1, marginHorizontal: 10, justifyContent: 'center' }}>

            <View style={{ flexDirection: 'row' }}>
                <Ionicons name={'ellipse-outline'} color={theme.textColor} size={20} style={{ marginRight: 10, alignSelf: 'center' }} />
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 16, marginRight: 15, flex: 1 }}>Get you know about your account performance with new contact options.</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <Ionicons name={'ellipse-outline'} color={theme.textColor} size={20} style={{ marginRight: 10, alignSelf: 'center' }} />
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 16, marginRight: 15, flex: 1 }}>Build your comunity and also people geting touch with you.</Text>
            </View>

            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                <Ionicons name={'ellipse-outline'} color={theme.textColor} size={20} style={{ marginRight: 10, alignSelf: 'center' }} />
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 16, marginRight: 15, flex: 1 }}>To see how's yours stories and reels are performing.</Text>
            </View>
        </View>

        <View style={{ alignSelf: 'center', bottom: 30, }}>
            <TouchableOpacity onPress={() => { props.navigation.navigate('ProffessionalScreen2') }} style={{ marginVertical: 5, paddingHorizontal: 10, paddingVertical: 12, borderRadius: 40, backgroundColor: Color.yellow, }}>
                <Text style={{ textAlign: 'center', marginHorizontal: 15, fontFamily: Constants.fontFamilyMedium, color: 'black', fontSize: 18 }}>Continue</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    )
}

export default ProffessionalScreen;


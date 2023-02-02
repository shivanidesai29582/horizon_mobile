import React, { useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import Constants from "../common/Constants";
import { Card } from 'react-native-paper';
import { useTheme } from '../Context';

const WalletScreen = (props) => {
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
                <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyBold, fontSize: 20, textAlign: 'center' }}>Your Python wallet</Text>
            </View>
        </View>


        <Image source={require('../Images/ic_wallet.png')} resizeMode='contain' style={{ alignSelf: 'center', marginTop: 20, height: 200, width: 200 }} />

        <View style={{ flex: 1, marginHorizontal: 10, marginTop: 80 }}>

            <Card style={[SettingsStyle.CardViewStyle, { backgroundColor: theme.modalBackgroundColor }]}>

                <View style={[{
                    marginVertical: 25,
                    flexDirection: 'row', margin: 10,

                }]}>
                    <Image source={require('../Images/ic_python.png')} resizeMode='contain' style={{ alignSelf: 'center', marginRight: 10, height: 25, width: 25 }} />

                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 20, marginRight: 45 }}>Total coins :</Text>
                    <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 20, marginRight: 45 }}>50 PCH</Text>

                </View>
            </Card>


            <View style={{ flexDirection: 'row' }}>
                <Card style={[SettingsStyle.CardViewStyle, { marginTop: 40, marginHorizontal: 15, flex: 1, backgroundColor: theme.modalBackgroundColor }]}>

                    <TouchableOpacity style={[{
                        height: 120,
                        flexDirection: 'row', justifyContent: 'center'
                    }]} onPress={() => { props.navigation.navigate('WebviewScreen', { url: 'https://exchange.pythonecosystem.com/#/' }) }}>
                        <Text style={{ color: theme.textColor, alignSelf: 'center', fontFamily: Constants.fontFamilySemiBold, fontSize: 20 }}>Send to</Text>
                    </TouchableOpacity>
                </Card>

                <Card style={[SettingsStyle.CardViewStyle, { marginTop: 40, marginHorizontal: 15, flex: 1, backgroundColor: theme.modalBackgroundColor }]}>

                    <View style={[{
                        height: 120,
                        flexDirection: 'row', justifyContent: 'center'
                    }]}>
                        <Text style={{ alignSelf: 'center', color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 20 }}>Recived</Text>
                    </View>
                </Card>
            </View>
            {/* 
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Card style={[SettingsStyle.CardViewStyle, { marginVertical: 10, marginHorizontal: 15, backgroundColor: theme.modalBackgroundColor }]}>

                    <View style={[{
                        height: 100,
                        flexDirection: 'row', margin: 10, justifyContent: 'center'

                    }]}>
                        <Text style={{ alignSelf: 'center', color: theme.textColor, fontFamily: Constants.fontFamilySemiBold, fontSize: 20 }}>Buy</Text>
                    </View>
                </Card>
            </View> */}

        </View>


    </SafeAreaView>
    )
}


const SettingsStyle = StyleSheet.create({
    CardViewStyle: {
        borderRadius: 15,
        marginVertical: 10,
        elevation: 5
    }
});
export default WalletScreen;


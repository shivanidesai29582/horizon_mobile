import React, { useState } from 'react';
import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import Ionicons from "react-native-vector-icons/Ionicons";
import { WebView } from "react-native-webview";
import { useTheme } from './../Context';
import LoaderScreen from '../Components/LoaderScreen';

const WebviewScreen = (props) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(true);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10, width: '100%', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => {
                    props.navigation.pop()
                }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />
                </TouchableOpacity>
            </View>
            <LoaderScreen visible={loading} />

            <WebView
                source={{ uri: props?.route?.params?.url, }}
                style={{ flex: 1 }}
                onLoadEnd={() => { setLoading(false) }}
            />
        </SafeAreaView>
    )
}

export default WebviewScreen;


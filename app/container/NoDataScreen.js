import React from 'react';
import { SafeAreaView, Text, View, Image, Dimensions } from 'react-native';
import { useTheme } from './../Context';
import Constants from "../common/Constants";
import Color from '../common/Color';
import LoaderScreen from '../Components/LoaderScreen';
const { width } = Dimensions.get("window");
const windowWidth = Dimensions.get('window').width;

const NoDataScreen = (props) => {
    const { theme } = useTheme();
    const { isVisible, message } = props;
    return (
        <>
            {isVisible &&
                <SafeAreaView style={{ flex: 1, width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={require('../Images/noData.png')} resizeMode='stretch' style={{ height: windowWidth - 200, width: windowWidth - 200, opacity: 0.8 }} />
                    <View style={{ flexDirection: "row", justifyContent: "center", width: windowWidth - 100, paddingVertical: 15, opacity: 0.8 }}>
                        <Text style={{ fontSize: 14, lineHeight: 20, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor, textAlign: 'center' }}>
                            <Text style={{ color: Color.secondary }}>Oops,</Text>
                            &nbsp;&nbsp;
                            {(message && message != '') ? message : 'Looks like you have not saved anything yet.'}
                        </Text>
                    </View>
                    <LoaderScreen visible={isVisible} />
                </SafeAreaView>
            }
        </>
    )
}

export default NoDataScreen;


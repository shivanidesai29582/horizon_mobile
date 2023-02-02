import React, { useState, useRef } from 'react';
import { Image, SafeAreaView, Text, View, } from 'react-native';
import PagerView from 'react-native-pager-view';
import MyButtonComponent from "../../Components/MyButtonComponent";
import Constants from "../../common/Constants";
import Color from "../../common/Color";
import ProgressiveDots from "./Components/ProgressiveDots";
import ForwardBackButton from "./Components/ForwardBackButton";
import { useTheme } from './../../Context';
const onBoardingArray = [
    {
        title: "What is Horizon?",
        description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
        image: require('../../Images/onboarding1.png')
    },
    {

        title: "How to Earn?",
        description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
        image: require('../../Images/onboarding2.png')
    }
    ,
    {

        title: "NFT Part",
        description: 'Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s',
        image: require('../../Images/onboarding3.png')
    }
];


const OnBoardingScreen = (props) => {
    const { theme } = useTheme();
    const [Selected, setSelected] = useState(0);
    const pager = useRef(null);
    const Screen = (index) => {
        return (

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={onBoardingArray[index].image} style={{
                    height: undefined,
                    width: '80%',
                    aspectRatio: 1,
                    marginTop: '15%',
                    alignSelf: 'center'
                }} />

                <Text style={{
                    fontSize: 18,
                    fontFamily: Constants.fontFamilyBold,
                    color: theme.textColor,
                    marginTop: 15,
                    includeFontPadding: false,
                    padding: 0
                }}>{onBoardingArray[index].title}</Text>
                <Text style={{
                    fontSize: 12,
                    paddingHorizontal: '10%',
                    marginTop: 15,
                    color: theme.textColor,
                    fontFamily: Constants.fontFamilyRegular,
                    textAlign: 'center'
                }}>{onBoardingArray[index].description}</Text>


            </View>


        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor, padding: 20 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MyButtonComponent disable={Selected == 2} onPress={() => {
                    props.navigation.replace("MainScreen")
                }} title={'Skip'} extratextstyle={{ paddingHorizontal: 30, fontFamily: Constants.fontFamilyMedium, fontSize: 12, paddingVertical: 3, includeFontPadding: false, color: Selected == 2 ? theme.backgroundColor : 'white' }} extraviewstyle={Selected == 2 ? { backgroundColor: theme.backgroundColor, borderWidth: 3, borderColor: theme.backgroundColor } : { borderWidth: 3, borderColor: Color.secondary }} />
                <View style={{ flex: 1 }} />

                <ProgressiveDots selectedIndex={Selected} />
            </View>
            <PagerView onPageSelected={(e) => {
                setSelected(e?.nativeEvent?.position)
            }} ref={pager} style={{ flex: 1 }} initialPage={0}>
                <View key="1">
                    {Screen(0)}
                </View>
                <View key="2">
                    {Screen(1)}
                </View>
                <View key="3">
                    {Screen(2)}
                </View>
            </PagerView>
            <View style={{ marginVertical: '5%', justifyContent: 'center', alignItems: 'center' }}>
                <ForwardBackButton onBackPress={() => {
                    pager.current.setPage(Selected - 1)
                    setSelected((Selected - 1))
                }} selectedIndex={Selected} onForwardPress={() => {
                    if (Selected < 2) {
                        pager.current.setPage(Selected + 1)
                        setSelected((Selected + 1))
                    } else {
                        props.navigation.replace('MainScreen')
                    }


                }} />


            </View>

        </SafeAreaView>
    );


}
export default OnBoardingScreen;
import React, { useState, useEffect } from 'react';
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View, StyleSheet, Switch } from 'react-native';
import Color from "../../common/Color";
import Constants from "../../common/Constants";
import global from "../../common/globals"
import { useTheme } from '../../Context';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useDispatch, useSelector } from 'react-redux';
import { putUserUpdate, userAuth } from "./../../redux/userlogin"
import LoaderScreen from '../../Components/LoaderScreen';
import { Card } from 'react-native-paper';

const LocarnoaSettingsScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const profileImage = { uri: user?.profile_photo == null ? global.USER_PROFILE_URL : user?.profile_photo };
    const [isInvisible, setIsInvisible] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        dispatch(userAuth()).then(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setIsInvisible(user ? user?.invisible_mode : false);
    }, [user]);

    const toggleInvisible = () => {
        setLoading(true);

        dispatch(putUserUpdate({ invisible_mode: !isInvisible })).then(() => {
            setLoading(false);
            setIsInvisible(previousState => !previousState);
        });
    }


    return (
        <SafeAreaView style={SettingsStyle.Maincontainer}>

            <View style={{ flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 10 }}>
                <TouchableOpacity onPress={() => { props.navigation.pop() }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: '#9F9696', justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name={'md-chevron-back'} color={'black'} size={20} />
                </TouchableOpacity>
                <Text style={{ color: 'black', fontFamily: Constants.fontFamilyBold, fontSize: 22, flex: 1, textAlign: 'center' }}>Settings</Text>
            </View>

            <ScrollView style={{ marginVertical: 10 }}>
                <LoaderScreen visible={loading} />
                <View style={{ marginHorizontal: 15, marginTop: 10, flex: 1 }}>

                    <Text style={SettingsStyle.TitleStyle}>My mapline</Text>
                    <Text style={SettingsStyle.Sub2TitleStyle}>mapline update when you open Horizon</Text>


                    <Card style={[SettingsStyle.CardViewStyle, {}]}>
                        <View style={[{
                            marginVertical: 15,
                            flexDirection: 'row', margin: 10,

                        }]}>
                            <Image style={{ height: 45, width: 45, borderRadius: 40, borderColor: Color.secondary, borderWidth: 2, alignSelf: 'center' }} source={profileImage} />
                            <View style={[{ justifyContent: 'space-between', flex: 1, marginLeft: 10 }]} >
                                <Text style={[SettingsStyle.SubTitleStyle, { fontSize: 17, }]}>Invisible Mode</Text>
                                <Text style={[SettingsStyle.Sub2TitleStyle]}>When you enable your friends can't see your mapline activity and location.</Text>

                            </View>
                            <Switch
                                style={{ alignSelf: 'center', transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                                trackColor={{ true: theme.trackActiveColor, false: theme.trackDisableColor }}
                                thumbColor={isInvisible ? theme.toggleActiveButtonColor : theme.toggleDisableButtonColor}
                                onValueChange={toggleInvisible}
                                value={isInvisible}></Switch>

                        </View>
                    </Card>

                    <Card style={[SettingsStyle.CardViewStyle, {}]}>

                        <TouchableOpacity disabled={!isInvisible} style={[SettingsStyle.ViewStyle, { justifyContent: 'space-between', flex: 1, marginLeft: 10 }]} onPress={() => {
                            props.navigation.navigate('CloseFriendsScreen')
                        }}>
                            <View style={[{ justifyContent: 'space-between', flex: 1, marginLeft: 10 }]} >
                                <Text style={[SettingsStyle.SubTitleStyle]}>Close friends</Text>
                                <Text style={SettingsStyle.Sub2TitleStyle}>When you disable Invisible mode you can choose which friend in your mapline you want to share your location</Text>
                            </View>
                            <Ionicons name={'ellipse-outline'} color={'black'} size={20} style={{ alignSelf: 'center', marginRight: 10 }} />
                        </TouchableOpacity>

                    </Card>

                    <Card style={[SettingsStyle.CardViewStyle, {}]}>

                        <TouchableOpacity style={[SettingsStyle.ViewStyle, { justifyContent: 'space-between', flex: 1, marginLeft: 10 }]} onPress={() => {
                            props.navigation.navigate('AddPlaceScreen')
                        }}>
                            <View style={[{ justifyContent: 'space-between', flex: 1, marginLeft: 10 }]} >
                                <Text style={[SettingsStyle.SubTitleStyle]}>Add Place in Horizon</Text>
                            </View>
                            <MaterialIcons name={'navigate-next'} color={'black'} size={20} style={{ alignSelf: 'center', right: 10 }} />
                        </TouchableOpacity>

                    </Card>


                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

const SettingsStyle = StyleSheet.create({
    Maincontainer: {
        flex: 1,
        backgroundColor: 'white'
    },
    ViewStyle: {
        marginVertical: 15,
        flexDirection: 'row'
    },
    CardViewStyle: {
        borderRadius: 15,
        marginVertical: 10,
        elevation: 5
    },
    TitleStyle: {
        marginVertical: 15,
        color: 'black',
        fontFamily: Constants.fontFamilySemiBold,
        fontSize: 18,
        textAlign: 'left'
    },
    SubTitleStyle: {
        color: 'black',
        fontFamily: Constants.fontFamilySemiBold,
        fontSize: 16,
        textAlign: 'left'
    },
    Sub2TitleStyle: {
        color: 'black',
        fontFamily: Constants.fontFamilyRegular,
        fontSize: 14,
        textAlign: 'left'
    }
});

export default LocarnoaSettingsScreen;

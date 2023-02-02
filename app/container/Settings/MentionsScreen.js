import React, { useState, useEffect } from 'react';
import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from 'react-redux';
import { SettingsStyle, IconSize } from './SettingsStyle'
import { toast } from '../../Omni';
import { useTheme } from '../../Context';
import { putUserUpdate, userAuth } from "./../../redux/userlogin"
import LoaderScreen from '../../Components/LoaderScreen';

const MentionsScreen = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const [isSelectedValue, setIsSelectedValue] = useState(0);

    useEffect(() => {
        setLoading(true);
        dispatch(userAuth()).then(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        setIsSelectedValue(user?.mention_check === true ? 0 : 1);
    }, [user]);

    const onSave = (mention) => {
        setLoading(true);

        const data = { mention_check: mention }

        dispatch(putUserUpdate(data)).then((response) => {
            setLoading(false);
            if (response.statusCode !== 200) {
                toast(response?.message)
            }
        });

    }

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"Mentions"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <LoaderScreen visible={loading} />


            <View style={{ marginLeft: 25, marginTop: 10, flex: 1, marginRight: 10 }}>

                <Text style={SettingsStyle(theme).TitleStyle}>Allow @mentions From</Text>

                <TouchableOpacity disabled={isSelectedValue === 0 ? true : false} style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {
                    setIsSelectedValue(0);
                    onSave(true);
                }} >
                    <Text style={SettingsStyle(theme).SubTitleStyle}>Everyone</Text>
                    <Ionicons name={isSelectedValue === 0 ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />

                </TouchableOpacity>

                {/* <TouchableOpacity disabled={isSelectedValue === 1 ? true : false} style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {
                    setIsSelectedValue(1)
                }} >
                    <Text style={SettingsStyle(theme).SubTitleStyle}>People You Follow</Text>
                    <Ionicons name={isSelectedValue === 1 ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />

                </TouchableOpacity> */}

                <TouchableOpacity disabled={isSelectedValue === 1 ? true : false} style={[SettingsStyle(theme).ViewStyle, { justifyContent: 'space-between' }]} onPress={() => {
                    setIsSelectedValue(1);
                    onSave(false);
                }} >
                    <Text style={SettingsStyle(theme).SubTitleStyle}>No One</Text>
                    <Ionicons name={isSelectedValue === 1 ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={theme.activeIcon} size={IconSize} style={{ marginRight: 5 }} />

                </TouchableOpacity>

            </View>
        </SafeAreaView>
    );

}

export default MentionsScreen;

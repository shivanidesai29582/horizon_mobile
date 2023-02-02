import React, { useEffect } from 'react';
import { FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import { Header } from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import global from "../../common/globals"
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { SettingsStyle } from './SettingsStyle'
import { useTheme } from '../../Context';
import NoDataScreen from '../NoDataScreen';
import { getMyCloseFriends, removeCloseFriend } from './../../redux/userlogin';

const CloseFriendsScreen = (props) => {
    const { theme } = useTheme();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const closeFriendsList = useSelector((state) => state?.userlogin?.closefriendslist);

    useEffect(() => {
        ReLoad();
    }, [isFocused, useFocusEffect]);

    const ReLoad = () => {
        dispatch(getMyCloseFriends());
    }

    const OnRemoveCloseFriends = (id) => {
        dispatch(removeCloseFriend(id)).then(() => {
            ReLoad();
        })

    }

    const UserComponent = ({ item }) => {
        return (

            <View style={{ padding: 8, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', backgroundColor: theme.backgroundColor, marginHorizontal: 10, marginVertical: 5, borderRadius: 10 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Image style={{ height: 60, width: 60, borderRadius: 100 }} source={{ uri: item?.profile_photo == null ? global.USER_PROFILE_URL : item?.profile_photo }} />
                    {/* <View style={{ width: 14, height: 14, backgroundColor: item.isActive == 2 ? '#f4cd1f' : item.isActive == 1 ? '#00ec00' : item.isActive == 3 ? '#bebebe' : null, borderRadius: 20, top: 20, right: 12, borderWidth: 2, borderColor: "#fff" }}></View> */}

                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: theme.textColor, fontSize: 15, fontFamily: Constants.fontFamilyRegular }}>{item?.username}</Text>
                        {/* <Text style={{ color: item.isRead ? "#fff" : "rgba(236,77,78,0.98)", fontSize: 12, marginTop: 13, fontFamily: Constants.fontFamilyRegular }}>{item.lastMsg}</Text> */}
                    </View>
                </View>

                <View >
                    <TouchableOpacity onPress={() => { OnRemoveCloseFriends(item?.id) }} style={[{ justifyContent: 'center', borderRadius: 5, borderColor: theme.textColor, paddingVertical: 2, height: 30, borderWidth: 1 }]}>
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={[{ fontFamily: Constants.fontFamilySemiBold, color: theme.textColor, alignSelf: 'center', fontSize: 12, marginHorizontal: 10 }]}>remove</Text>
                        </View>
                    </TouchableOpacity>
                </View>

            </View>

        )
    };

    return (
        <SafeAreaView style={SettingsStyle(theme).Maincontainer}>
            <Header isShownSearch={false} title={"Close friends"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <View style={{ marginTop: 10, flex: 1, marginVertical: 10 }}>
                {(!closeFriendsList || closeFriendsList.length === 0) ?
                    <NoDataScreen isVisible={(!closeFriendsList || closeFriendsList.length === 0)} message="Looks like you did not add anyone as a close friend" />
                    :
                    <FlatList data={closeFriendsList} style={{ marginTop: 20 }} renderItem={({ item, index }) => {

                        return (
                            UserComponent({ item })
                        )

                    }} />}

            </View>
        </SafeAreaView>
    );

}

export default CloseFriendsScreen;

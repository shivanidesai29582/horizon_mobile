import React, { useEffect } from 'react';
import {
    Text,
    View,
    Image,
    TouchableOpacity, SafeAreaView, FlatList

} from 'react-native';
import { Header } from "./Components/LoginHeader";
import Constants from "./../common/Constants";
import { getMyFollowing, getMyFollower } from './../redux/userlogin'
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import global from "./../common/globals";
import { useTheme } from './../Context';
import NoDataScreen from './NoDataScreen';



const UserFriendsList = (props) => {
    const { theme } = useTheme();

    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const TYPE = props?.route?.params?.Type;

    let myFollowingsList = TYPE === 'Followers' ? useSelector((state) => state?.userlogin?.myFollowers) : useSelector((state) => state?.userlogin?.myFollowings);


    // myFollowers
    useEffect(() => {
        dispatch(TYPE === 'Followers' ? getMyFollower() : getMyFollowing())
    }, [isFocused, useFocusEffect]);

    const MessageComponent = ({ item }) => {
        return (

            <TouchableOpacity onPress={() => {
                props.navigation.navigate('UserProfile', { item })
            }} style={{ padding: 8, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', backgroundColor: theme.backgroundColor, marginHorizontal: 10, marginVertical: 5, borderRadius: 10 }}>

                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Image style={{ height: 60, width: 60, borderRadius: 100 }} source={{ uri: item?.profile_photo == null ? global.USER_PROFILE_URL : item?.profile_photo }} />
                    {/* <View style={{ width: 14, height: 14, backgroundColor: item.isActive == 2 ? '#f4cd1f' : item.isActive == 1 ? '#00ec00' : item.isActive == 3 ? '#bebebe' : null, borderRadius: 20, top: 20, right: 12, borderWidth: 2, borderColor: "#fff" }}></View> */}

                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ color: theme.textColor, fontSize: 15, fontFamily: Constants.fontFamilyRegular }}>{item?.username === null ? "unnamed" : item?.username}</Text>
                        {/* <Text style={{ color: item.isRead ? "#fff" : "rgba(236,77,78,0.98)", fontSize: 12, marginTop: 13, fontFamily: Constants.fontFamilyRegular }}>{item.lastMsg}</Text> */}
                    </View>
                </View>

                {/* <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: 'rgba(141,141,141,0.75)', fontSize: 13, fontFamily: Constants.fontFamilyRegular }}>{item.time}</Text>
                    <View style={{ backgroundColor: '#960001', height: 22, width: 22, justifyContent: 'center', borderRadius: 30, marginTop: 10 }}>
                        <Text style={{ fontSize: 13, alignSelf: 'center', color: theme.textColor, fontFamily: Constants.fontFamilyRegular }}>{item.numberOfMsg}</Text>
                    </View>
                </View> */}

            </TouchableOpacity>

        )
    };

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <Header title={TYPE} isShownSearch={false} onBackPress={() => {
                props.navigation.pop();

            }} />
            {(!myFollowingsList || myFollowingsList.length === 0) ?
                <NoDataScreen isVisible={(!myFollowingsList || myFollowingsList.length === 0)} message="Looks like you dont't follow anyone yet." />
                :
                <FlatList data={myFollowingsList} style={{ marginTop: 20 }} renderItem={({ item, index }) => {

                    return (
                        MessageComponent({ item })
                    )

                }} />
            }
        </SafeAreaView>
    );
}


export default UserFriendsList;

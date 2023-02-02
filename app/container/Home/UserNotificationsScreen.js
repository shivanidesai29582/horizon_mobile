import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View } from 'react-native';
import Color from "../../common/Color";
import { Header } from "../Components/LoginHeader";
import { useSelector } from 'react-redux';

const UserNotificationsScreen = (props) => {
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const username = user?.username === null ? "unnamed" : user?.username;
    const [isEnabled, setIsEnabled] = useState(true);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>
            <Header isShownSearch={false} title={"Notifications"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <ScrollView style={{ marginVertical: 10 }}>
                <View style={{ marginLeft: 25, marginTop: 10, flex: 1 }}>

                </View>
            </ScrollView>
        </SafeAreaView>
    );

}

export default UserNotificationsScreen;

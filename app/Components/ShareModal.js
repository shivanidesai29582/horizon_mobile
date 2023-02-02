import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Image } from 'react-native';
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";

import { useTheme } from './../Context';
import Color from "../common/Color";
import Constants from "../common/Constants";

export default function ShareModal({ isSendModalVisible, setModalVisibility, userData, OnUserSend }) {
    const { theme } = useTheme();
    const [searchTxt, setSearchTxt] = useState('')
    userData = userData?.filter((following) => following.username.toLowerCase().includes(searchTxt.toLowerCase())) || [];
    return (
        <Modal
            animationType="slide"
            transparent={true}
            isVisible={isSendModalVisible}
            // backdropColor={'transparent'}
            onRequestClose={() => {
                setModalVisibility(false);
            }}
            onBackdropPress={() => {
                setModalVisibility(false);
            }}
            style={{
                margin: 0,
                bottom: 0,
                position: 'absolute',
                width: '100%',
                backgroundColor: 'transparent',
                backfaceVisibility: 'visible'
            }}>
            <View style={{ backgroundColor: theme.modalBackgroundColor, borderTopRightRadius: 20, borderTopLeftRadius: 20, height: 500 }}>
                <FlatList
                    data={userData}
                    stickyHeaderIndices={[0]}
                    style={{ marginTop: 20 }}
                    bounces={false}
                    ListHeaderComponent={
                        <View style={styles.searchView}>
                            <Ionicons name={'search-outline'} size={20} style={{ marginHorizontal: 8, color: "#fff" }} />
                            <TextInput
                                value={searchTxt}
                                placeholder='Search'
                                placeholderTextColor={Color.grey}
                                style={{ height: 30, width: '80%', fontFamily: Constants.fontFamilyRegular, textAlignVertical: 'center', color: '#fff', paddingVertical: 0 }}
                                onChangeText={(val) => setSearchTxt(val)}
                            />
                        </View>
                    }
                    renderItem={({ item, index }) => {
                        return (
                            <TouchableOpacity style={{ marginVertical: 8, flexDirection: 'row' }} onPress={() => {
                                // setIsSendModalVisible(false)
                            }} >
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between', width: '100%' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <Image style={{ height: 50, width: 50, borderRadius: 25 }} source={{ uri: item?.profile_photo == null ? global.USER_PROFILE_URL : item?.profile_photo }} />
                                        <Text
                                            style={{ marginLeft: 15, color: theme.textColor, fontSize: 15, fontFamily: Constants.fontFamilyRegular, width: '60%' }}
                                            numberOfLines={1}>{item?.username}</Text>
                                    </View>

                                    <TouchableOpacity style={{ height: 30, width: 70, backgroundColor: '#458eff', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }} onPress={() => { OnUserSend(item) }}>
                                        <Text style={{
                                            fontFamily: Constants.fontFamilySemiBold,
                                            color: '#fff'
                                        }}>Send</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        );
                    }} />

            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    searchView: {
        height: 40,
        marginHorizontal: 15,
        backgroundColor: Color.darkGrey3,
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center'
    }
});
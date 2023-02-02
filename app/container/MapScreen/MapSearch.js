import React, { useState, useEffect } from 'react';
import { TextInput, Image, SafeAreaView, Text, TouchableOpacity, View, FlatList } from 'react-native';
import Constants from "../../common/Constants";
import global from "../../common/globals"
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from 'react-redux';
import { getSearch, getRecentSearch, addRecentSearch, removeRecentSearch, removeAllRecentSearch } from '../../redux/search'
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import NoDataScreen from '../NoDataScreen';
import { useTheme } from './../../Context';

const MapSearch = (props) => {
    const { theme } = useTheme();
    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const [searchString, setSearchString] = useState('');
    const [isRecent, setIsRecent] = useState(true);
    let searchUserList = useSelector((state) => state?.search?.userList);
    let recentUserList = useSelector((state) => state?.search?.userRecentList);

    useEffect(() => {
        dispatch(getRecentSearch());
    }, [isFocused, useFocusEffect]);

    const OnSearch = (text) => {
        setSearchString(text);
        dispatch(getSearch(text));
        setIsRecent(false);
    }

    const OnAddRecentSearch = (item, isRecent) => {
        dispatch(addRecentSearch({ user_id: isRecent ? item?.user_id : item?.id, profile_photo: item?.profile_photo, username: item?.username, first_name: item?.first_name }));
        setIsRecent(true);
        props.navigation.navigate('UserProfile', { item: { id: isRecent ? item?.user_id : item?.id } })
    }

    const OnRemoveRecentSearch = (item) => {
        dispatch(removeRecentSearch({ id: item?.id })).then(() => {
            dispatch(getRecentSearch());
        });
    }

    const OnRemoveAllRecentSearch = () => {
        dispatch(removeAllRecentSearch()).then(() => {
            dispatch(getRecentSearch());
        });
    }

    const SearchUserComponent = (data, isRecent = true) => {
        return (
            <FlatList
                data={data}
                style={{}}
                renderItem={({ item, index }) => {
                    return (
                        <TouchableOpacity style={{ flexDirection: 'row', marginHorizontal: 10, marginVertical: 10 }} onPress={() => { OnAddRecentSearch(item, isRecent) }}>
                            <Image source={{ uri: item?.profile_photo == null ? global.USER_PROFILE_URL : item?.profile_photo }}
                                style={{ width: 50, height: 50, aspectRatio: 1, borderRadius: 50 }} />
                            <View style={{ flex: 1 }}>
                                <Text numberOfLines={1} style={{
                                    color: theme.textColor,
                                    fontFamily: Constants.fontFamilySemiBold,
                                    includeFontPadding: false,
                                    paddingHorizontal: 10,
                                    fontSize: 14
                                }}>{item?.username}</Text>
                                <Text numberOfLines={1} style={{
                                    color: theme.textColor,
                                    fontFamily: Constants.fontFamilyRegular,
                                    includeFontPadding: false,
                                    paddingHorizontal: 10,
                                    fontSize: 14
                                }}>{item?.first_name === null ? "unnamed" : `${item?.first_name}`}</Text>
                            </View>

                            {isRecent ? <Ionicons name={'close'} color={theme.textColor} size={25} onPress={() => { OnRemoveRecentSearch(item) }} /> : null}

                        </TouchableOpacity>
                    )
                }} />

        )
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>

            <View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10 }}>
                <TouchableOpacity onPress={() => { props.navigation.pop() }} style={{ marginHorizontal: 5, height: 35, width: 35, borderRadius: 35, borderWidth: 1, borderColor: theme.textColor, justifyContent: 'center', alignItems: 'center' }}>
                    <Ionicons name={'md-chevron-back'} color={theme.textColor} size={20} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>

                    <View style={{ borderRadius: 10, borderColor: theme.borderColor, borderWidth: 1, height: 35, alignSelf: 'flex-end', flexDirection: 'row', paddingHorizontal: 10, width: "100%" }}>

                        <Ionicons name={'search'} color={theme.textColor} size={20} style={{ alignSelf: 'center' }} />
                        <View style={{ justifyContent: 'center', width: "100%" }}>
                            <TextInput value={searchString} onSubmitEditing={(text) => { OnSearch(text) }} onChangeText={(text) => OnSearch(text)} style={{ width: "90%", alignSelf: 'flex-start', color: theme.textColor, fontSize: 12, padding: 5, fontFamily: Constants.fontFamilyRegular, paddingLeft: 10 }} placeholderTextColor={'#B9B8BC'} placeholder={'Search'} />
                        </View>

                    </View>
                </View>

            </View>

            <View style={{ flex: 1, marginHorizontal: 10, marginTop: 10 }}>
                {isRecent ?
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontFamily: Constants.fontFamilySemiBold, fontSize: 16, paddingVertical: 5, includeFontPadding: false, color: theme.textColor }}>Recent search</Text>

                            <TouchableOpacity onPress={() => { OnRemoveAllRecentSearch() }}>
                                <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 16, paddingVertical: 5, includeFontPadding: false, color: theme.textColor }}>Clear All</Text>

                            </TouchableOpacity>
                        </View>
                        {!recentUserList || recentUserList.length === 0 ?
                            <NoDataScreen isVisible={(!recentUserList || recentUserList.length === 0)} message="Looks like you dont't search anything yet." />
                            :
                            SearchUserComponent(recentUserList, isRecent)
                        }
                    </View>
                    :
                    (!searchString || searchString.length === 0 ?
                        <NoDataScreen isVisible={(!searchString || searchString.length === 0)} message="Looks like you dont't search anything yet." />
                        :
                        SearchUserComponent(searchUserList, isRecent)
                    )
                }

            </View>


        </SafeAreaView>
    );

}

export default MapSearch;

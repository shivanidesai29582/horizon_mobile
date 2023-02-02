import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Modal from "react-native-modal";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Dropdown } from 'react-native-element-dropdown';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';

import { useTheme } from './../Context';
import Color from "../common/Color";
import Constants from "../common/Constants";
import global from "./../common/globals";
import Button1Component from "../Components/Button1Component";
import { toast } from '../Omni';
const windowHeight = Dimensions.get('window').height;

import { Deletepost } from './../redux/post';
import { AddReport, getReportCategory } from './../redux/contentreport';
import { addFavCollection } from './../redux/userlogin';

export default function PostMenu({ navigation, isMoreModalVisible, selectedItem, setIsMoreModalVisible, currentLogedUserID, onClose }) {

    const { theme } = useTheme();
    const dispatch = useDispatch();

    let reportsCategory = useSelector((state) => state?.contentreport?.reportcategories);

    const [reportKey, setreportKey] = useState(reportsCategory ? reportsCategory[0]?.key : '');
    const [isAlertModalVisible, setAlertModalVisible] = useState(false);
    const [isReportModalVisible, setIsReportModalVisible] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [loading, setLoading] = useState(false);

    const buildLink = async () => {

        const link = await dynamicLinks().buildShortLink({
            link: `${global.DEEPLINKING_URL}/${itemType}/${selectedItem?.id}`,
            domainUriPrefix: 'https://horizonbird.page.link',
            android: { packageName: 'com.whiteorigin.horizon' },
            // ios: { bundleId: '' }

        });

        let options = {
            title: 'Horizon',
            message: `Check out this awesome post from ${link}`
        }
        Share.open(options)
            .then((res) => {
                setIsMoreModalVisible(false);
            })
            .catch((err) => {
                setIsMoreModalVisible(false);
            });

    }


    useEffect(() => {
        dispatch(getReportCategory());
    }, []);

    const OnSaved = () => {
        dispatch(addFavCollection(selectedItem?.id, 'posts'))
        setIsSaved(() => !isSaved)
    }

    const OnReportSend = () => {

        setLoading(true);
        dispatch(AddReport(selectedItem?.id, 'posts', reportKey)).then((resp) => {
            toast(resp.message);
            setIsMoreModalVisible(false);
            setIsReportModalVisible(false);
            setLoading(false);
        });
    }

    const OnReport = async () => {
        setIsReportModalVisible(true);
    }

    const OnDelete = async () => {
        setAlertModalVisible(true);
    }

    const OnPostDeleteReject = async () => {
        setAlertModalVisible(false);
        setIsMoreModalVisible(false);
    }

    const OnEdit = () => {
        setIsMoreModalVisible(false);
        if (navigation) {
            navigation.navigate('CreatePostScreen', { item: selectedItem })
        }
    }

    const OnPostDeleteConform = async () => {
        dispatch(Deletepost(selectedItem?.id, 'tranding')).then((resp) => {
            setIsMoreModalVisible(false);
            setAlertModalVisible(false);
            if (resp.status == 200) {
                console.log('Hide Post id ' + selectedItem);
            }
        });
    }
    return (
        <Modal
            transparent={true}
            isVisible={isMoreModalVisible}
            // backdropColor={'transparent'}
            onRequestClose={() => {
                setAlertModalVisible(false);
                setIsReportModalVisible(false);
                setIsMoreModalVisible(false);
            }}
            onBackdropPress={() => {
                setAlertModalVisible(false);
                setIsReportModalVisible(false);
                setIsMoreModalVisible(false);
            }}
            style={{
                margin: 0,
                bottom: 0,
                position: 'absolute',
                width: '100%',
                backgroundColor: 'transparent',
                backfaceVisibility: 'visible'
            }}>
            <View style={{ backgroundColor: theme.modalBackgroundColor, borderTopRightRadius: 20, borderTopLeftRadius: 20, }}>

                {isReportModalVisible ?
                    <View style={{ marginTop: 10 }}>
                        <Dropdown
                            style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, { alignSelf: 'center', marginVertical: 10, borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, }]}
                            placeholderStyle={[styles.droupdownText, { color: theme.textColor }]}
                            selectedTextStyle={[styles.droupdownText, { color: theme.textColor }]}
                            data={reportsCategory}
                            maxHeight={windowHeight - 200}
                            labelField="value"
                            valueField="key"
                            placeholder={reportsCategory[0]?.value}
                            value={reportsCategory[0]?.key}
                            containerStyle={{ backgroundColor: theme.backgroundColor }}
                            activeColor={theme.backgroundColor}
                            onChange={item => {
                                setreportKey(item.value);
                            }}
                        />
                        <Button1Component visible={loading} onPress={() => { OnReportSend() }} title={'Submit Report'} extraviewstyle={{ margin: 70 }} />

                    </View> :

                    (
                        isAlertModalVisible ?
                            (
                                <View style={{ marginTop: 10 }}>
                                    <Text style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row', color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Are you sure you want to delete this?</Text>
                                    <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnPostDeleteConform(); }} >
                                        <Ionicons name={'ios-checkmark-sharp'} color={theme.deletetextColor} size={25} style={{ marginRight: 10 }} />
                                        <Text style={{ color: theme.deletetextColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Yes</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnPostDeleteReject(); }} >
                                        <Ionicons name={'ios-close-sharp'} color={theme.textColor} size={25} style={{ marginRight: 10 }} />
                                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>No</Text>
                                    </TouchableOpacity>

                                </View>
                            )
                            :
                            (
                                <View style={{ marginTop: 10, flex: 1 }}>

                                    <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => {
                                        setIsMoreModalVisible(false);
                                        buildLink();
                                    }} >
                                        <Ionicons name={'share-social-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Share</Text>
                                    </TouchableOpacity>


                                    <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnSaved(); }} >
                                        <Ionicons name={isSaved ? 'bookmark' : 'bookmark-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>{isSaved ? "Saved" : "Save"}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnReport() }}>
                                        <Ionicons name={'alert-circle-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Report</Text>
                                    </TouchableOpacity>

                                    {(currentLogedUserID && selectedItem?.authorId == currentLogedUserID) && <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnDelete() }}>
                                        <Ionicons name={'ios-trash-outline'} color={theme.deletetextColor} size={25} style={{ marginRight: 5 }} />
                                        <Text style={{ color: theme.deletetextColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Delete</Text>
                                    </TouchableOpacity>}

                                    {(currentLogedUserID && selectedItem?.authorId == currentLogedUserID) && <TouchableOpacity style={{ paddingLeft: 20, paddingVertical: 15, flexDirection: 'row' }} onPress={() => { OnEdit() }}>
                                        <Ionicons name={'ios-trash-outline'} color={theme.textColor} size={25} style={{ marginRight: 5 }} />
                                        <Text style={{ color: theme.textColor, fontFamily: Constants.fontFamilyRegular, fontSize: 17, textAlign: 'left' }}>Edit</Text>
                                    </TouchableOpacity>}


                                </View >
                            )
                    )
                }
            </View >
        </Modal >
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
    },
    droupdownText: {
        fontFamily: Constants.fontFamilyRegular,
        fontSize: 13
    },
    iosDropUpDownStyle: {
        height: 48,
        width: '95%',
        padding: 15,
        borderRadius: 10,
    },
    androidDropUpDownStyle: {
        height: 48,
        width: '95%',
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 10,
    },
});
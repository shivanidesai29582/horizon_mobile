import React, { Component } from 'react';
import {
    Image,
    PermissionsAndroid,
    Platform,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

import Color from "../../common/Color";
import FieldComonent from "../../Components/FieldComonent";
import LoginHeader from "../Components/LoginHeader";
import Constants from "../../common/Constants";
import Button1Component from "../../Components/Button1Component";
import { launchCamera } from "react-native-image-picker";
const options = {
    mediaType: 'photo',
    maxWidth: 500,
    maxHeight: 500,
    quality: 0.5,
    cameraType: 'back',
    includeBase64: true,
    saveToPhotos: false

}
export default class CreateCollectionScreen extends Component {


    constructor(props) {

        super(props);
        this.state = {
            Selected: 0,
            avatarPic: undefined,
        }
        this.pager = React.createRef();


    }
    requestCameraPermission = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                );
                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    return true
                } else {
                    toast("Camera permission denied");
                    return false
                }
            } else {
                return true
            }

        } catch (err) {
            console.warn(err);
        }
    };
    pickImageFromCamera = async () => {
        if (await this.requestCameraPermission()) {
            launchCamera(options, (response) => {
                if (response.didCancel) {
                    // console.log('User cancelled image picker')
                } else if (response.error) {
                    // console.log('ImagePicker Error: ', response.error)
                } else if (response.customButton) {
                    // console.log('User tapped custom button: ', response.customButton)
                } else {
                    if (response.assets && response.assets.length > 0) {
                        const value = response.assets[0]
                        if (value) {
                            value.uri = Platform.OS == 'ios' ? value.uri.replace('file://', '/private') : value.uri
                            value.name = value.fileName
                            this.setState({ avatarPic: value })
                        } else {
                            toast('Something went wrong, please try again')
                        }

                    } else {
                        if (response.errorMessage) {
                            toast(response.errorMessage)

                        } else {
                            toast('Something went wrong, please try again')

                        }
                    }

                }
            })
        }


    }

    render() {


        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>
                <LoginHeader onBackPress={() => {
                    this.props.navigation.pop()
                }} />
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ padding: 20, flex: 1 }}>

                        <Image source={require('../../Images/signupIcon.png')} style={{
                            height: undefined,
                            width: '30%',
                            aspectRatio: 1,
                            alignSelf: 'center'
                        }} />
                        <Text style={{
                            fontSize: 25,
                            fontFamily: Constants.fontFamilyBold,
                            color: '#fff',
                            marginTop: 15,
                            includeFontPadding: false,
                            padding: 0
                        }}>Create Collection</Text>

                        <FieldComonent exterViewStyle={{ marginTop: 30 }} value={this.state.email} title={'Collection Name'} onChangeText={(text) => {
                            this.setState({ email: text })
                        }}>
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>
                        <FieldComonent exterViewStyle={{ marginTop: 10 }} value={this.state.email} title={'Collection Description'} onChangeText={(text) => {
                            this.setState({ email: text })
                        }}>
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>
                        <FieldComonent exterViewStyle={{ marginTop: 10 }} value={this.state.email} title={'Collection Symbol'} onChangeText={(text) => {
                            this.setState({ email: text })
                        }}>
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>
                        <FieldComonent exterViewStyle={{ marginTop: 10 }} value={this.state.email} title={'Select Collection'} onChangeText={(text) => {
                            this.setState({ email: text })
                        }}>
                            <Image source={require('../../Images/email_icon.png')} resizeMode={"contain"}
                                style={{ width: 25, aspectRatio: 1, height: undefined, tintColor: 'black' }} />
                        </FieldComonent>
                        <Text style={{ color: Color.textColor, fontFamily: Constants.fontFamilyRegular, alignItems: 'center', fontSize: 18, marginTop: 10 }}>Select Collection Image</Text>
                        <View style={{ flexDirection: 'row' }}>


                            <TouchableOpacity onPress={() => {
                                this.pickImageFromCamera()
                            }}>
                                <Image source={require('../../Images/nftCamera.png')} style={{
                                    height: 80,
                                    width: 80,
                                    aspectRatio: 1,
                                    alignSelf: 'center'
                                }} />

                            </TouchableOpacity>

                            {this.state.avatarPic && <Image source={{ uri: this.state.avatarPic.uri }} style={{
                                height: 80,
                                width: 80,
                                borderRadius: 10,
                                marginLeft: 10,
                                aspectRatio: 1,
                                alignSelf: 'center'
                            }} />}
                        </View>



                    </View>
                </ScrollView>
                <View style={{ alignItems: 'center', marginVertical: 20 }}>

                    <Button1Component onPress={() => { this.props.navigation.pop() }} extraviewstyle={{ width: '90%' }} title={'Create Collection'} />
                </View>
            </SafeAreaView>
        );
    }





}

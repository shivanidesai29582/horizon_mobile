import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Dimensions, Image, SafeAreaView, Text, TouchableOpacity, View, } from 'react-native';
import Color from "../../common/Color";
import Constants from "../../common/Constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import ProgressBar from "react-native-animated-progress";
import { Menu, MenuItem } from 'react-native-material-menu';
import { Camera, sortDevices, useCameraDevices } from 'react-native-vision-camera'
import { toast } from './../../Omni';
import useStopwatch from '../../utils/timer/useStopwatch';
import { launchImageLibrary } from 'react-native-image-picker';
import { toast } from "./../../Omni";

const options = {
    mediaType: 'video',
    videoQuality: 'high',
    durationLimit: 90,
    allowsEditing: true
}

const CreateReelScreen = (props) => {
    const {
        seconds,
        start,
        reset,
    } = useStopwatch({ autoStart: false });
    const camera = useRef(null)

    const [videoRecordingMaxTime, setVideoRecordingMaxTime] = useState(15);
    const [isFlashOn, setIsFlashOn] = useState(false);
    const [isTimeModalVisible, setIsTimeModalVisible] = useState(false);
    const [isRecordingPressed, setIsRecordingPressed] = useState(false);
    const [permissons, setPermissons] = useState(false);
    const [cameraPosition, setCameraPosition] = useState('back');

    const devices = useCameraDevices();
    const device = devices[cameraPosition];

    useEffect(() => {
        getPermissons();
    }, [])

    const getPermissons = async () => {
        const cameraPermission = await Camera.getCameraPermissionStatus();
        const microphonePermission = await Camera.getMicrophonePermissionStatus();
        if (microphonePermission === 'authorized' && cameraPermission === 'authorized') {
            setPermissons(true)
        } else {
            requestMicrophonePermission();
            requestCameraPermission();
        }
    }


    const requestMicrophonePermission = useCallback(async () => {
        console.log('Requesting microphone permission...');
        const permission = await Camera.requestMicrophonePermission();
        if (permission === 'denied') await Linking.openSettings();
        setMicrophonePermissionStatus(permission);
    }, []);

    const requestCameraPermission = useCallback(async () => {
        console.log('Requesting camera permission...');
        const permission = await Camera.requestCameraPermission();
        if (permission === 'denied') await Linking.openSettings();
        setCameraPermissionStatus(permission);
    }, []);


    const onFlipCameraPressed = useCallback(() => {
        setCameraPosition((p) => (p === 'back' ? 'front' : 'back'));
    }, []);


    const recordVideo = () => {

        if (isRecordingPressed) {
            toast('Please wait to end the video')
            return;
        }

        if (camera) {
            setIsRecordingPressed(true);
            start();
            camera.current.startRecording({
                flash: isFlashOn ? 'on' : 'off',
                onRecordingFinished: (video) => {
                    reset();
                    setIsRecordingPressed(false);
                    props.navigation.navigate('UploadReelScreens', { data: { path: video?.path, duration: videoRecordingMaxTime } });
                },
                onRecordingError: (error) => {
                    setIsRecordingPressed(false);
                    reset();
                },
            })

            setTimeout(() => {
                camera.current?.stopRecording();
            }, videoRecordingMaxTime * 1000);
        }
    }

    const hideMenu = (value) => {
        setVideoRecordingMaxTime(value);
        setIsTimeModalVisible(false);
    };

    const showMenu = () => setIsTimeModalVisible(true);

    if (device == null) {
        return null;
    }

    const pickImageFromGallery = () => {
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker')
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error)
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton)
            } else {

                if (response.assets && response.assets.length > 0) {
                    const value = response.assets[0]
                    if (value) {
                        value.uri = Platform.OS == 'ioss' ? value.uri.replace('file://', '/private') : value.uri
                        value.name = value.fileName;
                        props.navigation.navigate('UploadReelScreens', { data: { path: value?.uri, duration: value?.duration } });
                    } else {
                        toast('Something went wrong, please try again')
                    }
                } else {
                    toast('Something went wrong, please try again')
                }

            }
        })
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Color.primary }}>

            <Camera
                ref={camera}
                style={{ flex: 1 }}
                device={device}
                isActive={true}
                video={true}
                audio={true}
                orientation="portrait"
                torch={isFlashOn ? 'on' : 'off'}
                enableZoomGesture
            />
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                }}>
                {isRecordingPressed ? <View style={{ width: '100%', position: 'absolute', top: 0, justifyContent: 'center' }}>

                    <ProgressBar progress={(seconds * 100) / videoRecordingMaxTime} height={7} backgroundColor={Color.secondary} />

                    {/* <Text style={{
                        fontFamily: Constants.fontFamilyMedium,
                        fontSize: 14,
                        includeFontPadding: false,
                        color: 'white',
                        position: 'absolute',
                        right: 20,
                        top: 20
                    }}>{`${seconds}s`}</Text> */}
                </View> : <></>}
                <View style={{ flex: 1, padding: 20 }}>
                    <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center' }}>

                        <Ionicons onPress={() => { props.navigation.pop() }} name={'close'} color={'#fff'} size={25} style={{ position: 'absolute', left: 10 }} />

                        {isRecordingPressed ? <></> : <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                            <Image source={require('../../Images/musicIcon.png')}
                                style={{ width: 15, height: undefined, aspectRatio: 1 }} />
                            <Text style={{
                                fontFamily: Constants.fontFamilyMedium,
                                fontSize: 12,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Sounds</Text>
                        </View>}


                    </View>



                    {isRecordingPressed ? <></> : <View style={{ position: 'absolute', right: 5, top: 100 }}>
                        <TouchableOpacity style={{ height: 50, width: 50, alignItems: 'center' }} onPress={() => onFlipCameraPressed()}>
                            <Image source={require('../../Images/revertIcon.png')}
                                style={{ width: 25, height: 25, aspectRatio: 1, resizeMode: 'contain' }} />
                            <Text style={{
                                fontFamily: Constants.fontFamilySemiBold,
                                fontSize: 10,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Flip</Text>
                        </TouchableOpacity>

                        <Menu
                            visible={isTimeModalVisible}
                            anchor={<TouchableOpacity style={{ alignItems: 'center', justifyContent: 'center', marginTop: 10, height: 50, width: 50 }}
                                onPress={showMenu}>

                                <Ionicons onPress={() => { }} name={'timer-outline'} color={'#fff'} size={25} style={{ aspectRatio: 1, }} />

                                <Text style={{
                                    fontFamily: Constants.fontFamilySemiBold,
                                    fontSize: 10,
                                    includeFontPadding: false,
                                    color: 'white',
                                    marginHorizontal: 5
                                }}>{`${videoRecordingMaxTime}s`}</Text>
                            </TouchableOpacity>}
                            onRequestClose={() => { hideMenu(videoRecordingMaxTime) }}
                        >
                            <MenuItem onPress={() => { hideMenu(15) }}>15s</MenuItem>
                            <MenuItem onPress={() => { hideMenu(30) }}>30s</MenuItem>
                            <MenuItem onPress={() => { hideMenu(60) }}>60s</MenuItem>
                            <MenuItem onPress={() => { hideMenu(90) }}>90s</MenuItem>

                        </Menu>



                        <TouchableOpacity style={{ alignItems: 'center', marginTop: 15, height: 50, width: 50 }} onPress={() => {
                            setIsFlashOn(() => !isFlashOn)
                        }}>
                            <Image source={require('../../Images/flashIcon.png')}
                                style={{ width: 25, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilySemiBold,
                                fontSize: 10,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Flash</Text>

                        </TouchableOpacity>

                    </View>}


                    <View style={{ flex: 1 }} />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {isRecordingPressed ? <></> : <TouchableOpacity style={{ flex: 1, alignItems: 'center' }} >
                            <Image source={require('../../Images/emojisIcon.png')}
                                style={{ width: 40, height: undefined, aspectRatio: 1 }} />
                            <Text style={{
                                fontFamily: Constants.fontFamilyMedium,
                                fontSize: 12,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Effects</Text>
                        </TouchableOpacity>}


                        <TouchableOpacity onPress={() => { recordVideo() }} style={{ flex: 1, alignItems: 'center' }}>
                            <Image source={require('../../Images/captureIcon.png')}
                                style={{ width: 70, height: undefined, aspectRatio: 1 }} />
                        </TouchableOpacity>
                        {isRecordingPressed ? <></> : <TouchableOpacity onPress={() => { pickImageFromGallery() }} style={{ flex: 1, alignItems: 'center' }}>
                            <Image source={require('../../Images/galleryIcon.png')}
                                style={{ width: 40, height: undefined, aspectRatio: 1 }} />

                            <Text style={{
                                fontFamily: Constants.fontFamilyMedium,
                                fontSize: 12,
                                includeFontPadding: false,
                                color: 'white',
                                marginHorizontal: 5
                            }}>Upload</Text>
                        </TouchableOpacity>}
                    </View>
                </View>
            </View>
        </SafeAreaView >
    );
}



export default CreateReelScreen;
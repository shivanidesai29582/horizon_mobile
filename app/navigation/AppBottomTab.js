import React, { useState } from 'react'
import { Image, Platform, TouchableOpacity, View, DeviceEventEmitter, Dimensions } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { HomeStack, ReelsStack, ProfileStack, MapStack } from "./index";
import { useSelector } from 'react-redux';
import global from "./../common/globals";
import { useTheme } from './../Context';
import DrawerContent from './DrawerContent'
import NftScreen from '../container/Home/NftScreen';

const Tab = createBottomTabNavigator();
// const Tab = createMaterialTopTabNavigator();
const Drawer = createDrawerNavigator();

const tabIcons = [{ icon: require('../Images/home.png'), style: { width: 20, aspectRatio: 1.7 } }, { icon: require('../Images/nft.png'), style: { width: 20, aspectRatio: 1.7 } }, { icon: require('../Images/reel.png'), style: { width: 20, aspectRatio: 1.52 } }, { icon: require('../Images/map.png'), style: { width: 20, aspectRatio: 0.91 } }, { icon: require('../Images/ic_user.png'), style: { width: 20, aspectRatio: 1 } }]
const activeTabIcons = [{ icon: require('../Images/home_Fill.png'), style: { width: 20, aspectRatio: 1.7 } }, { icon: require('../Images/nft_Fill.png'), style: { width: 20, aspectRatio: 1.7 } }, { icon: require('../Images/reel_Fill.png'), style: { width: 20, aspectRatio: 1.52 } }, { icon: require('../Images/map_Fill.png'), style: { width: 20, aspectRatio: 0.91 } }, { icon: require('../Images/ic_user.png'), style: { width: 20, aspectRatio: 1 } }]
const windowWidth = Dimensions.get('window').width;

const AppBottomTab = () => {
    return (<Drawer.Navigator drawerContent={(props) => {
        return <DrawerContent  {...props} />
    }}
        screenOptions={{
            drawerStyle: {
                width: windowWidth - 50
            },
        }}
    >
        {/* <Drawer.Screen
            name="AppBottomTab"
            component={AppHomeBottomTab}
            options={{ headerShown: true }}
        /> */}
        <Drawer.Screen
            name="AppBottomTab" options={{ headerShown: false }} >
            {(props) => <AppHomeBottomTab {...props} ></AppHomeBottomTab>}

        </Drawer.Screen>
    </Drawer.Navigator>);
};

const AppHomeBottomTab = () => {
    const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
    const profileImage = { uri: user?.profile_photo == null ? global.USER_PROFILE_URL : user?.profile_photo };
    const [swipeEnabled, setSwipeEnabled] = useState(true);

    return (<Tab.Navigator
        tabBar={props => <MyTabBar {...props} profileImage={profileImage} />}
        tabBarPosition='bottom'
        // tabBarOptions={{

        //     style: {
        //         backgroundColor: 'transparent',
        //         position: 'absolute',
        //         borderTopWidth: 0,
        //         elevation: 0,
        //     },
        //     showLabel: false
        // }}
        theme={{ colors: { backgroundColor: 'transparent' } }}
        sceneContainerStyle={{ backgroundColor: 'transparent' }}
        initialRouteName={'Home'}
        backBehavior={'initialRoute'}
        // lazy={false}
        // screenOptions={{ headerShown: false  }} 
        swipeEnabled={swipeEnabled}
        screenOptions={[({ navigation, route }) => {
            if (route?.name === 'MapScreen' && navigation.isFocused()) {
                setSwipeEnabled(false);
            } else if (route?.name === 'Home' && navigation.isFocused()) {
                setSwipeEnabled(false);
            } else if (route?.name !== 'MapScreen' && navigation.isFocused()) {
                setSwipeEnabled(true);
            }
        }, {
            style: {
                backgroundColor: 'transparent',
                position: 'absolute',
                borderTopWidth: 0,
                elevation: 0,
            },
            showLabel: false
        }, {
            lazy: true
        }]}>

        <Tab.Screen name={'Home'} component={HomeStack} options={{ headerShown: false }} />
        <Tab.Screen name={'NFT'} component={NftScreen} options={{ headerShown: false }} />
        <Tab.Screen name={'Reels'} component={ReelsStack} options={{ headerShown: false }} />
        <Tab.Screen name={'Maps'} component={MapStack} options={{ headerShown: false }} />
        <Tab.Screen name={'ProfileStack'} component={ProfileStack} options={{ headerShown: false }} />

    </Tab.Navigator>);
};


function MyTabBar({ state, descriptors, navigation, profileImage }) {
    const { theme } = useTheme();
    let lastTap = null;

    return (
        <View style={{
            borderTopColor: '#9C9C9C44',
            borderTopWidth: 1,
            backgroundColor: theme.backgroundColor
        }}>
            <View style={{ flexDirection: 'row', backgroundColor: theme.backgroundColor, marginVertical: Platform.OS === "ios" ? 6 : 6 }}>
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    const label =
                        options.tabBarLabel !== undefined
                            ? options.tabBarLabel
                            : options.title !== undefined
                                ? options.title
                                : route.name;

                    const isFocused = state.index === index;

                    const onPress = () => {
                        const now = Date.now();
                        const DOUBLE_PRESS_DELAY = 300;
                        if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
                            DeviceEventEmitter.emit(`set${route.name}`);
                        } else {
                            lastTap = now;
                        }

                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            // The `merge: true` option makes sure that the params inside the tab screen are preserved
                            navigation.navigate({ name: route.name, merge: true });
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <>
                            <TouchableOpacity
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={{ backgroundColor: 'transparent', flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: Platform.OS === "ios" ? 0 : 0, marginBottom: Platform.OS === "ios" ? 0 : 0 }}
                            >
                                {/* {isFocused && <Image source={require('../Images/flashLight.png')} style={{ width: '70%', height: undefined, aspectRatio: 1.022, position: 'absolute', zIndex: 99 }} />} */}
                                {
                                    index === 4 ?
                                        <View style={{ borderWidth: isFocused ? 14 : 7, borderColor: theme.bottomNav.active, borderRadius: 30, height: 25, width: 25, justifyContent: 'center' }}>
                                            <Image source={profileImage} style={{ height: 25, width: 25, borderRadius: 30, alignSelf: 'center' }} />
                                        </View>
                                        : (index === 2 ?
                                            <Image source={!isFocused ? tabIcons[index].icon : activeTabIcons[index].icon} style={{ tintColor: !isFocused ? theme.bottomNav.active : theme.bottomNav.inActive, resizeMode: 'contain', height: 22, aspectRatio: 1.5 }} />
                                            // <Image source={tabIcons[index].icon} style={{ tintColor: !isFocused ? theme.bottomNav.active : 'red', resizeMode: 'contain', height: 30, aspectRatio: 1.5 }} />
                                            :
                                            (index === 0 ?
                                                <Image source={!isFocused ? tabIcons[index].icon : activeTabIcons[index].icon} style={{ tintColor: !isFocused ? theme.bottomNav.active : theme.bottomNav.inActive, resizeMode: 'contain', height: 28, aspectRatio: 1.5 }} />
                                                :
                                                <Image source={!isFocused ? tabIcons[index].icon : activeTabIcons[index].icon} style={{ tintColor: !isFocused ? theme.bottomNav.active : theme.bottomNav.inActive, resizeMode: 'contain', height: 25, aspectRatio: 1.5 }} />
                                            ))}
                            </TouchableOpacity>
                            {/* {index < 3 && <View style={{ height: '100%', width: 1, backgroundColor: '#fff' }} />} */}
                        </>
                    );
                })}
            </View>
        </View>
    );
}


export default AppBottomTab
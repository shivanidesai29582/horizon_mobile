import React, { useEffect } from 'react';
import { View } from 'react-native';
import Splash from '../container/Splash';
import MainScreen from '../container/Home/MainScreen';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import global from './../common/globals';
import { set } from '../storage';

import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { navigationRef } from './NavigationService';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import OnBoardingScreen from "../container/OnboardingScreens/OnBoardingScreen";
import LoginScreen from "../container/Authentication/LoginScreen";
import RegisterScreen from "../container/Authentication/RegisterScreen";
import RegisterSecondScreen from "../container/Authentication/RegisterSecondScreen";
import MobileVerificationScreen from "../container/Authentication/MobileVerificationScreen"
import ForgotPasswordScreen from "../container/Authentication/ForgotPasswordScreen"
import AppBottomTab from "./AppBottomTab";
import CollectionsScreen from "../container/Home/CollectionsScreen";
import CreateOutlookScreen from "../container/Home/CreateOutlookScreen";
import CreateScreen from "../container/Home/CreateScreen";
import CreatePostScreen from '../container/Home/CreatePostScreen';
import AuctionDetailScreen from "../container/Home/AuctionDetailScreen";
import NFTDetailScreen from "../container/Home/NFTDetailScreen";
import PostDetailScreen from "../container/Home/PostDetailScreen";
import HomeScreen from '../container/Home/HomeScreen';
import PlaceBidScreen from "../container/Home/PlaceBidScreen";
import PlayReelScreen from "../container/Reels/PlayReelScreen";
import ProfileReelScreen from "../container/Reels/ProfileReelScreen";
import ReelDetails from "../container/Reels/ReelDetails";
import AddLocation from "../container/AddLocation";
import MessagingScreen from "../container/MessagingScreen/MessagingScreen";
import IndividualMessage from "../container/MessagingScreen/IndividualMessage";
import CreateNFTScreen from "../container/Home/CreateNFTScreen";
import NftScreen from '../container/Home/NftScreen';
import CreateCollectionScreen from "../container/Home/CreateCollectionScreen";
import CreateAuctionScreen from "../container/Home/Auction/CreateAuctionScreen";
import UserNotificationsScreen from "../container/Home/UserNotificationsScreen";
import CreateStoryScreen from '../container/Home/CreateStoryScreen';
import NoficationScreen from '../container/NotificationScreen';
import NoDataScreen from '../container/NoDataScreen';
import UserCollection from '../container/UserCollection';

import AddStoryScreens from "../container/MapScreen/AddStoryScreens";
import CreateStory from "../container/MapScreen/CreateStory";
import AddFutureScreens from "./../container/MapScreen/AddFutureScreens";
import AddIlustrationScreens from "../container/MapScreen/AddIlustrationScreens";
import LocarnoaSettingsScreen from "../container/MapScreen/LocarnoaSettingsScreen";
import UploadReelScreens from "../container/Reels/UploadReelScreens";
import CollectionProfileScreen from "../container/Home/CollectionProfileScreen";
import CommentsScreen from "../container/Reels/CommentsScreen";
import Profile from "../container/Authentication/Profile";
import IFlashStoriesAddScreen from "../container/Authentication/IFlashStoriesAddScreen";
import EditProfile from "../container/EditProfile";
import WebviewScreen from "../container/WebviewScreen";
import UserProfile from "../container/UserProfile";
import SearchScreen from "../container/Search/SearchScreen"
import SettingsScreen from "../container/Settings/SettingsScreen"
import FollowandInviteScreen from "../container/Settings/FollowandInviteScreen"
import NotificationsScreen from "../container/Settings/NotificationsScreen"
import BlockedListScreen from "../container/Settings/BlockedListScreen"
import PrivacyScreen from "../container/Settings/PrivacyScreen"
import MentionsScreen from "../container/Settings/MentionsScreen"
import SecurityScreen from "../container/Settings/SecurityScreen"
import AccountScreen from "../container/Settings/AccountScreen"
import HelpScreen from "../container/Settings/HelpScreen"
import ActivityStatus from "../container/Settings/ActivityStatus"
import StoryScreen from "../container/Settings/StoryScreen"
import AboutScreen from "../container/Settings/AboutScreen"
import ThemeScreen from "../container/Settings/ThemeScreen"
import AwardsScreen from "../container/Settings/AwardsScreen"
import RewardsScreen from "../container/Settings/RewardsScreen"
import CloseFriendsScreen from "../container/Settings/CloseFriendsScreen"
import PasswordScreen from "../container/Settings/PasswordScreen"
import ReportProblemScreen from "../container/Settings/ReportProblemScreen"
import PersonalScreen from "../container/Settings/PersonalScreen"
import UserFriendsList from "../container/UserFriendsList"
import MapScreen from "../container/MapScreen/MapScreen";
import MapSearch from "../container/MapScreen/MapSearch";
import AddPlaceScreen from "../container/MapScreen/AddPlaceScreen";

import ProffessionalScreen from "../container/ProffessionalScreen";
import ProffessionalScreen2 from "../container/ProffessionalScreen2";
import BussinessEditScreen from "../container/BussinessEditScreen";
import BussinessSetupScreen from "../container/BussinessSetupScreen";
import ReferalScreen from "../container/ReferalScreen"
import InviteUserScreen from "../container/InviteUserScreen"
import InspiredScreen from "../container/InspiredScreen"
import WalletScreen from "../container/WalletScreen"

const TopTab = createMaterialTopTabNavigator();
const Stack = createStackNavigator();



function AppNavigation() {

    const handleDynamicLink = link => {
        DeepLinking(link.url);
    };

    useEffect(() => {
        const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
        return () => unsubscribe();
    }, []);

    const DeepLinking = async (urldata) => {
        let data = urldata.split("://");
        data = data[1].split("/");

        const DATAURL = data[0];
        const DATATYPE = data[1];
        const DATATID = data[2];

        if (DATAURL === global.DEEPLINKING_BASE_URL) {
            // console.log("**************  domain", DATAURL);
            // console.log("**************  data Type", DATATYPE);
            // console.log("**************  data ID", DATATID);
            if (DATATYPE === global.DEEPLINKING_POST) {
                navigationRef.current.navigate('PostDetailScreen', { item: { id: DATATID, requestFrom: 'deepLink' } })
            }
            else if (DATATYPE === global.DEEPLINKING_REEL) {
                navigationRef.current.navigate('AppBottomTab', { screen: 'Reels', item: { id: DATATID, requestFrom: 'deepLink' } });
            } else if (DATATYPE === global.DEEPLINKING_NFT) {
                navigationRef.current.navigate('NFTDetailScreen', { item: { id: DATATID, requestFrom: 'deepLink' } })
            } else if (DATATYPE === global.DEEPLINKING_INVITE) {
                await set('horizon_referal_token', DATATID, true);
                navigationRef.current.navigate('Splash')
            }
        }
    }

    return (
        <Stack.Navigator initialRouteName='Splash' options={{ headerShown: false }}  >
            <Stack.Screen name={'Splash'} component={Splash} options={{ headerShown: false }} />
            <Stack.Screen name={'AuthStack'} component={AuthStack} options={{ headerShown: false }} />
            <Stack.Screen name={'LoginScreen'} component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'RegisterScreen'} component={RegisterScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'HomeStack'} component={AppBottomTab} options={{ headerShown: false }} />
            <Stack.Screen name={'ReelDetails'} component={ReelDetails} options={{ headerShown: false }} />
            <Stack.Screen name={'CommentsScreen'} component={CommentsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'AddLocation'} component={AddLocation} options={{ headerShown: false }} />
            <Stack.Screen name={'CollectionsScreen'} component={CollectionsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CreateNFTScreen'} component={CreateNFTScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CreateCollectionScreen'} component={CreateCollectionScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CreateAuctionScreen'} component={CreateAuctionScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'AddStoryScreens'} component={AddStoryScreens} options={{ headerShown: false }} />
            <Stack.Screen name={'CreateStory'} component={CreateStory} options={{ headerShown: false }} />
            <Stack.Screen name={'AddFutureScreens'} component={AddFutureScreens} options={{ headerShown: false }} />
            <Stack.Screen name={'AddIlustrationScreens'} component={AddIlustrationScreens} options={{ headerShown: false }} />
            <Stack.Screen name={'LocarnoaSettingsScreen'} component={LocarnoaSettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'AddPlaceScreen'} component={AddPlaceScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CloseFriendsScreen'} component={CloseFriendsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'UploadReelScreens'} component={UploadReelScreens} options={{ headerShown: false }} />
            <Stack.Screen name={'EditProfile'} component={EditProfile} options={{ headerShown: false }} />
            <Stack.Screen name={'WebviewScreen'} component={WebviewScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'IFlashStoriesAddScreen'} component={IFlashStoriesAddScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CreateOutlookScreen'} component={CreateOutlookScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'NftScreen'} component={NftScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CreatePostScreen'} component={CreatePostScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'PostDetailScreen'} component={PostDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CreateStoryScreen'} component={CreateStoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'NFTDetailScreen'} component={NFTDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'NoficationScreen'} component={NoficationScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'UserCollection'} component={UserCollection} options={{ headerShown: false }} />
            <Stack.Screen name={'NoDataScreen'} component={NoDataScreen} options={{ headerShown: false }} />
            <Stack.Screen name="MessagingStack" component={MessagingStack} options={{ headerShown: false }} />
            <Stack.Screen name={'AuctionDetailScreen'} component={AuctionDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CollectionProfileScreen'} component={CollectionProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'UserProfile'} component={UserProfile} options={{ headerShown: false }} />

        </Stack.Navigator>
    );
}

export function HomeStack() {
    return (
        <Stack.Navigator initialRouteName='FirstScreen' options={{ headerShown: false }}  >
            <Stack.Screen name={'HomeScreenNavigation'} component={HomeScreenNavigation} options={{ headerShown: false }} />
            <Stack.Screen name={'CreateScreen'} component={CreateScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'AuctionDetailScreen'} component={AuctionDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'NFTDetailScreen'} component={NFTDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'PlaceBidScreen'} component={PlaceBidScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CollectionProfileScreen'} component={CollectionProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'SearchScreen'} component={SearchScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'UserFriendsList'} component={UserFriendsList} options={{ headerShown: false }} />
            <Stack.Screen name={'WebviewScreen'} component={WebviewScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'ProffessionalScreen'} component={ProffessionalScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'ProffessionalScreen2'} component={ProffessionalScreen2} options={{ headerShown: false }} />
            <Stack.Screen name={'BussinessEditScreen'} component={BussinessEditScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'BussinessSetupScreen'} component={BussinessSetupScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'ReferalScreen1'} component={ReferalScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'InviteUserScreen'} component={InviteUserScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'InspiredScreen'} component={InspiredScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'WalletScreen'} component={WalletScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'UserNotificationsScreen'} component={UserNotificationsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
}

const HomeScreenNavigation = () => {
    return (
        <Stack.Navigator initialRouteName={'HomeScreen'} tabBar={() => null} >
            <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="NftScreen" component={NftScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PostDetailScreen" component={PostDetailScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export function ReelsStack() {
    return (<Stack.Navigator initialRouteName='PlayReelScreen' options={{ headerShown: false }}  >
        <Stack.Screen name={'PlayReelScreen'} component={PlayReelScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'ReportProblemScreen'} component={ReportProblemScreen} options={{ headerShown: false }} />
    </Stack.Navigator>

    );

}

export function ProfileStack() {
    return (
        <Stack.Navigator initialRouteName='Profile' options={{ headerShown: false }}  >
            <Stack.Screen name={'Profile'} component={Profile} options={{ headerShown: false }} />
            <Stack.Screen name={'AuctionDetailScreen'} component={AuctionDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'PostDetailScreen'} component={PostDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'NFTDetailScreen'} component={NFTDetailScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'PlaceBidScreen'} component={PlaceBidScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CollectionProfileScreen'} component={CollectionProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'SearchScreen'} component={SearchScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'UserFriendsList'} component={UserFriendsList} options={{ headerShown: false }} />
            <Stack.Screen name={'SettingsScreen'} component={SettingsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'FollowandInviteScreen'} component={FollowandInviteScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'NotificationsScreen'} component={NotificationsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'PrivacyScreen'} component={PrivacyScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'MentionsScreen'} component={MentionsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'BlockedListScreen'} component={BlockedListScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'SecurityScreen'} component={SecurityScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'AccountScreen'} component={AccountScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'HelpScreen'} component={HelpScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'StoryScreen'} component={StoryScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'ActivityStatus'} component={ActivityStatus} options={{ headerShown: false }} />
            <Stack.Screen name={'AboutScreen'} component={AboutScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'ThemeScreen'} component={ThemeScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'AwardsScreen'} component={AwardsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'RewardsScreen'} component={RewardsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'CloseFriendsScreen'} component={CloseFriendsScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'PasswordScreen'} component={PasswordScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'ReportProblemScreen'} component={ReportProblemScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'PersonalScreen'} component={PersonalScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'ReferalScreen'} component={ReferalScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'InviteUserScreen'} component={InviteUserScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'ProfileReelScreen'} component={ProfileReelScreen} options={{ headerShown: false }} />
        </Stack.Navigator>);
}

export function MapStack() {
    return (
        <Stack.Navigator initialRouteName='MapScreen' options={{ headerShown: false }}  >
            <Stack.Screen name={'MapScreen'} component={MapScreen} options={{ headerShown: false }} />
            <Stack.Screen name={'MapSearch'} component={MapSearch} options={{ headerShown: false }} />
            <Stack.Screen name={'CloseFriendsScreen'} component={CloseFriendsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>);
}

export function MessagingStack() {
    return (<Stack.Navigator initialRouteName='MessagingScreen' options={{ headerShown: false }}  >
        <Stack.Screen name={'MessagingScreen'} component={MessagingScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'IndividualMessage'} component={IndividualMessage} options={{ headerShown: false }} />
    </Stack.Navigator>);
}

function AuthStack() {
    return (<Stack.Navigator options={{ headerShown: false }}  >
        <Stack.Screen name={'OnBoardingScreen'} component={OnBoardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'MainScreen'} component={MainScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'LoginScreen'} component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'RegisterScreen'} component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'RegisterSecondScreen'} component={RegisterSecondScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'ForgotPasswordScreen'} component={ForgotPasswordScreen} options={{ headerShown: false }} />
        <Stack.Screen name={'MobileVerificationScreen'} component={MobileVerificationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>);
}

const AppNavigator = () => {
    return (
        <View style={{ flex: 1 }}>
            <NavigationContainer ref={navigationRef} theme={DarkTheme}>
                <AppNavigation />
            </NavigationContainer>
        </View>
    );

};

export default AppNavigator;
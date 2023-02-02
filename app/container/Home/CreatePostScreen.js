import React, { useEffect, useState, useRef } from 'react';
import {
	Image,
	KeyboardAvoidingView,
	Platform,
	SafeAreaView,
	ScrollView,
	FlatList,
	TextInput,
	Text,
	TouchableOpacity,
	View,
	DeviceEventEmitter
} from 'react-native';
import Modal from "react-native-modal";
import { Menu, MenuItem, } from 'react-native-material-menu';
import { useDispatch, useSelector } from 'react-redux';
import { useIsFocused } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import axios from 'axios';
import { toast } from '../../Omni';
import { AddPost, EditPost } from './../../redux/post';
import { getMyFollower } from '../../redux/userlogin';
import LoaderScreen from '../../Components/LoaderScreen';
import global from "./../../common/globals";
import { get } from '../../storage';
import Constants from "../../common/Constants";
import { useTheme } from '../../Context';

const options = {
	mediaType: 'photo',
	// maxWidth: 500,
	// maxHeight: 500,
	quality: 1,
	cameraType: 'back',
	includeBase64: false,
	saveToPhotos: false
}

const CreatePostScreen = (props) => {
	const { theme } = useTheme();
	const scrollViewRef = useRef(null);

	const isFocused = useIsFocused();

	const userinfo = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
	const profileImage = { uri: userinfo?.profile_photo == null ? global.USER_PROFILE_URL : userinfo?.profile_photo };
	const username = userinfo?.username;
	// let user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
	const EditData = props?.route?.params?.item;

	const dispatch = useDispatch();

	const [imageURL, setImageURL] = useState(EditData ? { uri: EditData?.file_url } : '');
	const [description, setDescription] = useState(EditData ? EditData?.description : '');

	const [isGIF, setIsGIF] = useState(EditData ? EditData?.file_type === 'image/gif' ? true : false : false);

	let List = useSelector((state) => state?.userlogin?.myFollowers);

	const [searchString, setSearchString] = useState('');
	const [gifsearchString, setGifSearchString] = useState('');
	const [follower, setFollower] = useState('');
	const [TagFollowerList, settagFollowerList] = useState(EditData ? EditData?.tagged_users : []);
	const [myFollowingsList, setMyFollowingsList] = useState(null);
	const [loading, setLoading] = useState(false);
	const [gifNextString, setGifNextString] = useState();
	const [requesting, setrequesting] = useState(true);

	const [gifItem, setGif] = useState(false);
	const [dataItem, setData] = useState([]);
	const [locationName, setLocationName] = useState(EditData ? EditData?.location : '');


	useEffect(() => {
		DeviceEventEmitter.addListener('setpostLocation', (value) => {
			setLocationName(value?.name);
		});
	}, [1]);



	const fetchData = async () => {
		const resp = await fetch("https://tenor.googleapis.com/v2/featured?key=AIzaSyAAeXVtPlLMPNXgfJvxKoN1JtU2vz_hWcU&client_key=my_test_app");
		const data = await resp.json();
		setData(data?.results);
		setGifNextString(data?.next);
		setrequesting(false);
	};

	const [categoryItem, setcategoryItem] = useState([]);

	const fetchCategory = async () => {
		const resp = await fetch("https://tenor.googleapis.com/v2/categories?key=AIzaSyAAeXVtPlLMPNXgfJvxKoN1JtU2vz_hWcU&client_key=my_test_app");
		const category = await resp.json();
		setcategoryItem(category?.tags);
	};

	useEffect(() => {
		dispatch(getMyFollower())
		fetchData();
		// fetchCategory();
	}, []);



	const [visible, setVisible] = useState(false);
	const hideMenu = () => setVisible(false);
	const showMenu = () => setVisible(true);

	const __isAvailable = (boxName) => {
		return TagFollowerList.findIndex((ele) => ele?.id === boxName?.id) > -1;
	}

	const __isAdded = (boxName) => {
		const oldData = [...TagFollowerList];

		if (__isAvailable(boxName) == false) {
			oldData.push(boxName);
		} else {
			oldData.splice(TagFollowerList.findIndex((ele) => ele?.id === boxName?.id), 1)
		}
		settagFollowerList(oldData);
	}

	useEffect(() => {
		setMyFollowingsList(List);
	}, [List]);


	const onImagePic = async (value) => {
		await setImageURL(value);
	}

	const pickImageFromGallery = () => {
		launchImageLibrary(options, (response) => {
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
						value.uri = Platform.OS == 'ioss' ? value.uri.replace('file://', '/private') : value.uri
						value.name = value.fileName
						onImagePic(value)
					} else {
						toast('Something went wrong, please try again')
					}
				} else {
					toast('Something went wrong, please try again')
				}
			}
		})
	}

	const onSendImageHandler = async () => {
		if (imageURL === '') {
			toast('Add images or GIF');
		} else {
			setLoading(true);

			if (EditData) {
				setLoading(false);

				if (isGIF) {
					const data = { file_url: imageURL?.uri, description, file_type: 'image/gif', tagged_users: TagFollowerList, source: 'tenor', location: locationName }
					dispatch(EditPost(data, EditData?.id)).then(() => {
						setLoading(false);
						props.navigation.pop();
					})

				} else {
					if (imageURL?.uri.startsWith('http')) {
						const data = { file_url: imageURL?.uri, description, file_type: EditData?.file_type, tagged_users: TagFollowerList, location: locationName }
						dispatch(EditPost(data, EditData?.id)).then(() => {
							setLoading(false);
							props.navigation.pop();
						})
					} else {

						let storageToken = await get('horizon_token');
						let formData = new FormData();

						formData.append("file", {
							uri: imageURL?.uri,
							type: imageURL?.type,
							name: `dummy${Date.now()}.jpg`
						});

						axios.post(`${global.HORIZON_BASE_URL}/attachments`, formData, {
							headers: {
								'Content-Type': 'multipart/form-data',
								'Authorization': `Bearer ${storageToken}`
							},
						}).then((response) => {
							const data = { file_url: response?.data?.image, description, file_type: imageURL?.type, tagged_users: TagFollowerList, location: locationName }
							dispatch(EditPost(data, EditData?.id)).then((res) => {
								setLoading(false);
								props.navigation.pop();
							})
						}).catch((error) => {
							setLoading(false);
						})

					}
				}


			} else if (isGIF) {
				const data = { file_url: imageURL?.uri, description, file_type: 'image/gif', tagged_users: TagFollowerList, source: 'tenor', location: locationName }
				dispatch(AddPost(data)).then(() => {
					setLoading(false);
					props.navigation.pop();
				})

			} else {
				let storageToken = await get('horizon_token');
				let formData = new FormData();

				formData.append("file", {
					uri: imageURL?.uri,
					type: imageURL?.type,
					name: `dummy${Date.now()}.jpg`
				});

				axios.post(`${global.HORIZON_BASE_URL}/attachments`, formData, {
					headers: {
						'Content-Type': 'multipart/form-data',
						'Authorization': `Bearer ${storageToken}`
					},
				}).then((response) => {
					const data = { file_url: response?.data?.image, description, file_type: imageURL?.type, tagged_users: TagFollowerList, location: locationName }
					dispatch(AddPost(data)).then((res) => {
						setLoading(false);
						props.navigation.pop();
					})
				}).catch((error) => {
					setLoading(false);
				})
			}

		}
	}

	const TagUserComponent = ({ item }) => {
		return (
			<TouchableOpacity onPress={() => { __isAdded(item) }}
				style={{ padding: 8, flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', backgroundColor: theme.backgroundColor, marginHorizontal: 10, marginVertical: 5, borderRadius: 10 }}>
				<View style={{ flexDirection: 'row', alignItems: 'center' }}>
					<Image style={{ height: 60, width: 60, borderRadius: 100, backgroundColor: 'gray' }} source={{ uri: item?.profile_photo == null ? global.USER_PROFILE_URL : item?.profile_photo }} />
					<View style={{ marginLeft: 10, flexDirection: 'row', justifyContent: "space-between", flex: 1 }}>
						<Text style={{ color: theme.textColor, fontSize: 15, fontFamily: Constants.fontFamilyRegular }}>{item?.username == null ? 'unnamed' : item?.username}</Text>
						{__isAvailable(item) ? <Image source={require('./../../Images/ic_selected.png')} resizeMode='contain' style={{ height: 17, width: 17, marginRight: 10 }} /> : null}
					</View>
				</View>
			</TouchableOpacity>
		);
	}

	const OnSearch = (text) => {
		setSearchString(text);
		if (text) {
			const searchData = myFollowingsList?.filter((ele) => ele?.username?.toLowerCase().includes(text.toLowerCase()));
			setMyFollowingsList(searchData);
		} else {
			setMyFollowingsList(List);
		}
	}


	const onEndReached = async () => {
		setrequesting(true);
		if (gifsearchString) {
			const value = encodeURI(gifsearchString);
			const url = `https://tenor.googleapis.com/v2/search?key=AIzaSyAAeXVtPlLMPNXgfJvxKoN1JtU2vz_hWcU&client_key=my_test_app&q=${value}&pos=${gifNextString}`
			const resp = await fetch(url);
			const data = await resp.json();
			setData([...dataItem, ...data?.results]);
			setGifNextString(data?.next);
			setrequesting(false);

		} else {
			const resp = await fetch(`https://tenor.googleapis.com/v2/featured?key=AIzaSyAAeXVtPlLMPNXgfJvxKoN1JtU2vz_hWcU&client_key=my_test_app&pos=${gifNextString}`);
			const data = await resp.json();
			setData([...dataItem, ...data?.results]);
			setGifNextString(data?.next);
			setrequesting(false);

		}

	};

	const OnGifSearch = async (text) => {
		setGifSearchString(text);
		if (text) {
			const value = encodeURI(text);
			const url = `https://tenor.googleapis.com/v2/search?key=AIzaSyAAeXVtPlLMPNXgfJvxKoN1JtU2vz_hWcU&client_key=my_test_app&q=${value}&pos=`
			const resp = await fetch(url);
			const data = await resp.json();
			setGifNextString(data?.next);
			setData(data?.results);
		} else {
			setGifNextString();
			fetchData();
		}
	}



	const [index, setIndex] = useState(0);
	const [routes] = useState([
		{ key: 'nfts', title: 'searchterm' },
		{ key: 'auction', title: 'categoryItem' },
	]);



	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
			<Modal
				transparent={true}
				isVisible={follower}
				swipeDirection='down'
				onSwipeComplete={() => {
					setFollower(false);
				}}
				style={{
					flex: 1,
					margin: 0
				}}
			>
				<SafeAreaView style={{ flex: 1, justifyContent: 'flex-start', backgroundColor: theme.modalBackgroundColor }}>
					<View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between' }}>

						<TouchableOpacity onPress={() => {
							setSearchString('');
							setFollower(false);
						}} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: theme.activeIcon, justifyContent: 'center', alignItems: 'center' }}>
							<Ionicons name={'md-chevron-back'} color={theme.activeIcon} size={20} />
						</TouchableOpacity>

						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ fontFamily: Constants.fontFamilySemiBold, color: theme.textColor, textAlign: 'center' }}>Tag People</Text>
						</View>
						<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => {
							setSearchString('');
							setFollower(false);
						}} >
							<Text style={{ marginRight: 10, fontFamily: Constants.fontFamilySemiBold, color: theme.textColor, textAlign: 'center' }}>Done</Text>
						</TouchableOpacity>
					</View>
					<View style={{ flexDirection: 'row', height: 35, width: "95%", marginHorizontal: 10, paddingHorizontal: 10, borderWidth: 1, borderColor: theme.borderColor, borderRadius: 10 }}>
						<Ionicons name={'search'} color={theme.textColor} size={20} style={{ alignSelf: 'center' }} />
						<View style={{ justifyContent: 'center', width: "100%" }}>
							<TextInput
								value={searchString}
								onSubmitEditing={(text) => { OnSearch(text) }}
								onChangeText={(text) => { OnSearch(text) }}
								style={{ width: "90%", alignSelf: 'flex-start', color: theme.textColor, fontSize: 12, padding: 5, fontFamily: Constants.fontFamilyRegular, paddingLeft: 10 }}
								placeholderTextColor={'#B9B8BC'}
								placeholder={'Search follwers'}
							/>

							{/* <TextInput
								placeholder={'Search'}
								placeholderTextColor={'#B9B8BC'}
								value={searchString}
								onSubmitEditing={(text) => { OnSearch(text) }}
								onChangeText={(text) => OnSearch(text)}
								style={{ width: "100%", alignSelf: 'flex-start', color: theme.textColor, fontSize: 12, padding: 5, fontFamily: Constants.fontFamilyRegular, paddingLeft: 10 }}
							/> */}
						</View>
					</View>
					<FlatList
						data={searchString === '' ? List : myFollowingsList}
						renderItem={({ item, index }) => TagUserComponent({ item })}
					/>
				</SafeAreaView>
				{/* <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
					<View style={{ flexDirection: 'row', height: 35, width: "100%", paddingHorizontal: 10, borderRadius: 10, borderWidth: 1, borderColor: theme.borderColor }}>
						<Ionicons name={'search'} color={theme.textColor} size={20} style={{ alignSelf: 'center' }} />
						<View style={{ justifyContent: 'center', width: "100%" }}>
							<TextInput
								placeholder={'Search'}
								placeholderTextColor={'#B9B8BC'}
								style={{ width: "100%", alignSelf: 'flex-start', color: theme.textColor, fontSize: 12, padding: 5, fontFamily: Constants.fontFamilyRegular, paddingLeft: 10 }}
							/>
						</View>
					</View>
				</SafeAreaView> */}
			</Modal>

			{/* GIF Model */}
			<Modal
				isVisible={gifItem}
				transparent={true}
				style={{
					margin: 0,
					bottom: 0,
					position: 'absolute',
					width: '100%'
				}}
			>
				<View style={{ flex: 1, paddingBottom: 20, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: theme.modalBackgroundColor }}>
					<View style={{ flexDirection: 'row', margin: 8 }}>
						<TouchableOpacity onPress={() => setGif(false)} style={{ height: 30, width: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 15, borderWidth: 1, borderColor: theme.activeIcon }}>
							<Ionicons name={'md-chevron-back'} color={theme.activeIcon} size={20} />
						</TouchableOpacity>
						<View style={{ flex: 1, flexDirection: 'row', height: 35, marginHorizontal: 10, paddingRight: 10, borderWidth: 1, borderRadius: 10, borderColor: theme.borderColor }}>
							<View style={{ width: 32, height: 35, alignItems: 'center', justifyContent: 'center' }}>
								<Ionicons name={'search'} color={theme.textColor} size={20} style={{ alignSelf: 'center' }} />
							</View>
							<TextInput
								style={{ fontSize: 13, color: theme.textColor, fontFamily: Constants.fontFamilyRegular, }}
								placeholderTextColor={'#B9B8BC'}
								placeholder={'Search for GIF'}
								value={gifsearchString}
								onSubmitEditing={(text) => { OnGifSearch(text) }}
								onChangeText={(text) => { OnGifSearch(text) }}
							/>
						</View>
						{/* <FlatList
							data={categoryItem}
							renderItem={({ item }) => (
								<View style={{ paddingRight: 10, paddingVertical: 5 }}>
									<View style={{ paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: theme.textColor }}>
										<Text style={{ fontSize: 14, lineHeight: 16, color: theme.textColor }}>{item?.searchterm}</Text>
									</View>
								</View>
							)}
							bounces={false}
							horizontal={true}
							showsHorizontalScrollIndicator={false}
						/> */}
					</View>
					{/* <TabView
						renderScene={renderScene}
						navigationState={{ index, routes }}
						onIndexChange={setIndex}
						renderTabBar={renderTabBar}
					/> */}
					{/* <TabView
					renderScene={SceneMap({
						item?.searchterm: item?.
						first: FirstRoute,
						second: SecondRoute,
					})}
							navigationState={{ index, routes }}
							onIndexChange={setIndex}
							tabBarPosition='top'
							renderTabBar={props => <TabBar {...props} style={{ backgroundColor: theme.backgroundColor, height: 40 }}
									renderLabel={({ focused, route }) => {
											return (<View style={{}} >
													<Text numberOfLines={1} style={{ fontSize: 18, color: theme.textColor, fontFamily: Constants.fontFamilySemiBold }}>{route.title}</Text>
											</View>);
									}}
									indicatorStyle={{
											backgroundColor: Color.secondary,
											padding: 1.5,
									}} />

							}
					/> */}
					<FlatList
						horizontal={false}
						numColumns={2}
						data={dataItem}
						renderItem={({ item }) => (
							<TouchableOpacity style={{ padding: 5, alignItems: 'center', justifyContent: 'space-between', }} onPress={() => {
								setIsGIF(true);
								setGif(false);
								setImageURL({ uri: item?.media_formats?.gif?.url });

							}}>
								<Image source={{ uri: item?.media_formats?.tinygif?.url }} style={{ height: 170, width: 175, borderRadius: 20 }} />
							</TouchableOpacity>
						)}
						style={{ height: 300, width: '100%', marginHorizontal: 10 }}
						onEndReachedThreshold={5}
						onEndReached={!requesting ? onEndReached : null}
					/>
				</View>
			</Modal>

			<LoaderScreen visible={loading} />

			<KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={{ flex: 1, justifyContent: "space-between" }}>
				<View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between', borderBottomWidth: 0.3, borderBottomColor: 'gray' }}>
					<TouchableOpacity onPress={() => { props.navigation.goBack('HomeScreen') }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: theme.activeIcon, justifyContent: 'center', alignItems: 'center' }}>
						<Ionicons name={'md-chevron-back'} color={theme.activeIcon} size={20} />
					</TouchableOpacity>
					<View style={{ flexDirection: 'row' }}>
						{/* <Dropdown
        		label='everyone'
						fontSize={12}
						data={data}
						labelFontSize={14}
      		/> */}
						<Menu
							visible={visible}
							anchor={
								<TouchableOpacity activeOpacity={0.8} onPress={showMenu} style={{ flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderWidth: 1, borderColor: theme.textColor }}>
									<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 14, lineHeight: 16, color: theme.textColor, textAlign: 'center', textTransform: 'capitalize' }}>everyone</Text>
									<View style={{ width: 22, alignItems: 'center' }}>
										<FontAwesome name={'angle-up'} color={theme.activeIcon} size={20} />
									</View>
								</TouchableOpacity>
							}
							style={{ borderRadius: 10 }}
						>
							<MenuItem onPress={hideMenu} textStyle={{ textTransform: 'capitalize' }} style={{ borderBottomWidth: 0.4, borderBottomColor: 'black' }}>everyone</MenuItem>
							<MenuItem onPress={hideMenu} textStyle={{ textTransform: 'capitalize' }}>followers</MenuItem>
						</Menu>
						{/* <View style={{ paddingVertical: 5, paddingHorizontal: 8, marginRight: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 30, borderWidth: 1, borderColor: theme.textColor }}>
							<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 14, lineHeight: 16, color: theme.textColor, textAlign: 'center', textTransform: 'capitalize' }}>drafts</Text>
						</View> */}
					</View>
				</View>
				<View style={{ flex: 1, padding: 10, paddingTop: 10, backgroundColor: theme.backgroundColor }}>
					<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<View style={{ height: 50, width: 50, borderRadius: 35, backgroundColor: 'gray' }}>
								<Image source={profileImage} style={{ height: 50, width: 50, borderRadius: 35, alignSelf: 'center' }} />
							</View>
							<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 18, lineHeight: 20, color: theme.textColor, marginLeft: 8, textAlign: 'center', textTransform: 'capitalize' }}>{username}</Text>
						</View>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<TouchableOpacity onPress={() => { onSendImageHandler() }} style={{ paddingVertical: 10, paddingHorizontal: 10, alignItems: 'center', backgroundColor: '#b3e5fc', justifyContent: 'center', borderRadius: 30 }}>
								<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 16, lineHeight: 20, color: theme.textColor, textAlign: 'center', textTransform: 'capitalize' }}>speire</Text>
							</TouchableOpacity>
						</View>
					</View>
					<ScrollView
						style={{ flex: 1, marginLeft: 45 }}
						ref={scrollViewRef}
						bounces={false}
						showsVerticalScrollIndicator={false}
						scrollToOverflowEnabled={true}
						onContentSizeChange={() => {
							scrollViewRef.current.scrollToEnd({ animated: true });
						}}
					>
						<TextInput
							style={{ fontSize: 20, color: theme.textColor, width: 'auto', padding: 10 }}
							placeholder="what's the moment?"
							placeholderTextColor={'#A9A9A9'}
							multiline={true}
							keyboardType="default"
							value={description}
							onSubmitEditing={(text) => { setDescription(text) }}
							onChangeText={(text) => setDescription(text)}
						/>
						{imageURL !== '' ? <View style={{ height: 220, marginVertical: 30, overflow: 'hidden', borderRadius: 15 }}>
							<Image
								source={imageURL}
								style={{ resizeMode: 'cover', height: 220, width: 'auto', borderRadius: 15 }} />
							<FontAwesome onPress={() => { setImageURL('') }} name={'remove'} color={theme.activeIcon} size={20} style={{ position: 'absolute', right: 10, top: 8 }} />
						</View> : <></>}

						<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 16, lineHeight: 20, color: '#A9A9A9', marginTop: 10 }}>{locationName}</Text>

						<View style={{ justifyContent: 'center', marginTop: 10 }} >
							<Text>{TagFollowerList.map((item) => { return <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 16, color: '#A9A9A9', borderRadius: 40, borderWidth: 1, borderColor: theme.textColor }}>{`${item?.username} `}</Text> })}</Text>
						</View>

					</ScrollView>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity onPress={() => { props.navigation.navigate('AddLocation', { TYPE: 'post' }) }} activeOpacity={0.8} style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
							<FontAwesome name={'map-marker'} color={theme.activeIcon} size={28} />
						</TouchableOpacity>
						{/* <TouchableOpacity activeOpacity={0.8} style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => { props.navigation.navigate('GifScreen') }}> */}
						{imageURL === '' ? <View style={{ flexDirection: 'row' }}>
							<TouchableOpacity activeOpacity={0.8} style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => { setGif(true) }}>
								<Image source={require('../../Images/gif.png')} style={{ height: 30, width: 30, alignSelf: 'center', tintColor: theme.textColor, resizeMode: 'contain' }} />
							</TouchableOpacity>
							<TouchableOpacity activeOpacity={0.8} style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }} onPress={() => pickImageFromGallery()}>
								<EvilIcons name={'image'} color={theme.activeIcon} size={40} />
							</TouchableOpacity>
						</View> : <></>}
						<TouchableOpacity
							activeOpacity={0.8}
							style={{ height: 40, paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center', marginLeft: 10, borderRadius: 40, borderWidth: 1, borderColor: theme.textColor }}
							onPress={() => {
								setFollower(true)
							}}
						// onPress={() => { props.navigation.navigate('SearchScreen') }}
						>
							<Text style={{ fontSize: 18, lineHeight: 20, color: theme.textColor, textTransform: 'capitalize' }}>tag people</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</SafeAreaView>
	)
};

export default CreatePostScreen

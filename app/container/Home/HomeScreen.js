import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, SafeAreaView, ScrollView, TouchableOpacity, Image, StyleSheet, Dimensions, TextInput, Animated } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Modal from "react-native-modal";
import LottieView from 'lottie-react-native';
import LinearGradient from "react-native-linear-gradient";
// import Reel_Fill from '../../Components/Reel_Fill';
import { getTrendingtPost } from './../../redux/post'
import { addFollow, removeFollow, getMyFollowing, userAuth } from './../../redux/userlogin';
import Constants from "../../common/Constants";
import Color from "../../common/Color";
import { useTheme } from './../../Context';
import { setLikes } from './../../redux/likes';
import NoDataScreen from '../NoDataScreen';
import PostMenu from '../../Components/PostMenu';
import ShareModal from '../../Components/ShareModal';
import global from "./../../common/globals";
import horizonApiAxios from '../../services/restclient/horizonApiAxios';
import FastImage from 'react-native-fast-image'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const HomeScreen = (props) => {
	const { theme, updateTheme } = useTheme();
	const dispatch = useDispatch();

	const [modalVisible, setmodalVisible] = useState();
	const [isMoreModalVisible, setIsMoreModalVisible] = useState(false);
	const [isSendModalVisible, setIsSendModalVisible] = useState(false);
	const [latestNfts, setLatestNfts] = useState([]);
	const [isFollow, setIsFollow] = useState(false);
	const [selectedItem, setSelectedItem] = useState([]);
	const [showLoader, setShowLoader] = useState(true);
	const [Comments, setComments] = useState('');

	let myFollowingsList = useSelector((state) => state?.userlogin?.myFollowings);


	const activeArrayLength = user?.stories?.filter((ele) => ele?.status === 'Active')?.length;
	const trendingtPost = useSelector((state) => state?.post?.posts);
	const trendingnnftsList = useSelector((state) => state?.nft?.trending_nfts);
	const user = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);
	const profileImage = { uri: user?.profile_photo == null ? global.USER_PROFILE_URL : user?.profile_photo };
	const currentLogedUserID = user?.id;
	const [startFrom, setstartFrom] = useState(1);
	const [requesting, setrequesting] = useState(true);
	const lottieRef = useRef(null);
	const [viewLikeAnim] = useState(new Animated.Value(0));

	useEffect(() => {
		// dispatch(getTrendingtPost(1));
		getLatestNfts();
		dispatch(userAuth());
	}, []);

	useEffect(() => {
		const GetPosts = async () => {
			dispatch(getTrendingtPost(startFrom));
			await setrequesting(false);
			setShowLoader(false);
		};
		GetPosts();
	}, [startFrom]);

	useEffect(() => {
		setIsFollow(selectedItem?.is_follow ? selectedItem?.is_follow : false);
	}, [selectedItem]);



	const OnFollow = () => {
		dispatch(addFollow({ id: `${selectedItem?.authorId}` }))
		setIsFollowing(true);
	}

	const OnUnFollow = () => {
		dispatch(removeFollow({ id: selectedItem?.authorId }))
		setIsFollowing(false);
	}


	const OnSend = () => {
		dispatch(getMyFollowing()).then(() => {
			setIsSendModalVisible(true);
		});
	}

	const OnUserSend = async (user) => {
		setIsSendModalVisible(false);
		console.log('************ user', user);
		console.log("************ currentLogedUserID", currentLogedUserID);
		console.log("************ to", user?.id);

		// file_url: { url: response?.data?.data[0]?.url },
		// type: response?.data?.data[0]?.type

		// await horizonApiAxios.post(`/addmsg`, {
		// from: currentLogedUserID,
		// to: user?.id,
		// message: '',
		// }).then(() => {
		// setIsSendModalVisible(false);
		// }).catch((error) => {
		//   setIsSendModalVisible(false);

		// })

	}

	const onEndReached = () => {
		setrequesting(true);
		setstartFrom(startFrom + 1);
	};

	const getLatestNfts = () => {
		return horizonApiAxios.get(`/nfts/latest`)
			.then((response) => {
				const Latest_NFTs = response.data;
				setLatestNfts(Latest_NFTs);
			})
			.catch(error => console.log(error));
	};

	const HeaderComponet = () => {
		return (
			<View style={{ flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 10, borderBottomWidth: 0.2, borderBottomColor: '#bbb' }}>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: "center" }}>
					<TouchableOpacity onPress={() => { props.navigation.openDrawer() }} style={{ height: 30, width: 30, borderRadius: 35, justifyContent: 'center', borderColor: theme.textColor, borderWidth: activeArrayLength === 0 ? 12 : 4 }}>
						<Image style={{ height: 30, width: 30, borderRadius: 35, alignSelf: 'center' }} source={profileImage} />
					</TouchableOpacity>
					<Ionicons name={'search'} color={theme.textColor} size={29} style={{ alignSelf: 'center', marginHorizontal: 13 }} onPress={() => { props.navigation.navigate('SearchScreen') }} />
				</View>
				<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', transform: ([{ rotateX: '0deg' }, { rotateZ: '13deg' }]) }}>
					<Image source={require('../../Images/ic_splash_logo.png')} style={{ alignSelf: 'center', resizeMode: 'contain', height: 40, width: 40 }} />
				</View>
				<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }} onPress={() => { props.navigation.navigate("MessagingStack", { screen: "MessagingScreen", merge: true }) }}>
					<TouchableOpacity onPress={() => { props.navigation.navigate("MessagingStack", { screen: "MessagingScreen", merge: true }) }} style={{ width: 40, justifyContent: 'center', alignItems: 'center' }}>
						<Image source={require('../../Images/message.png')} style={{ resizeMode: 'contain', height: 32, width: 32, tintColor: theme.activeIcon }} />
					</TouchableOpacity>
				</View>
			</View >
		)
	}

	// const NFTComponent = (image) => {
	// 	return (
	// 		<ScrollView style={{ height: 40, width: 40, borderRadius: 20, marginRight: 5, marginTop: 5, marginBottom: 5, backgroundColor: 'white' }}>
	// 			<Image source={image} style={{ resizeMode: 'cover', height: 40, width: 40, borderRadius: 20 }} />
	// 		</ScrollView>
	// 	)
	// }

	const Item = ({ item, author_username, description, file_url, total_comment, author_profile_photo, location }) => {
		const [isLiked, setIsLiked] = useState(item?.isLiked ? item?.isLiked : item?.is_liked);
		const [likeCount, setLikeCount] = useState(item?.likeCount ? item?.likeCount : item?.total_like);
		const [commentCount, setCommentCount] = useState(total_comment);
		const authorObj = { item: { id: item?.authorId, profile_photo: author_profile_photo, username: author_username } };
		const imageWidh = windowWidth - 85;
		var imgHeight = 280;
		item.isLiked = isLiked;
		item.setIsLiked = setIsLiked;
		item.likeCount = likeCount;
		item.setLikeCount = setLikeCount;
		item.OnSend = OnSend;
		item.setCommentCount = setCommentCount;
		item.setSelectedItem = setSelectedItem;
		item.setIsTmpMoreModalVisible = setIsMoreModalVisible;
		const manageCommentCount = (count) => {
			setCommentCount(count);
		}
		// Image.getSize(file_url, (width, height) => {
		// 		console.log('width', width);
		// 		// return height * (imageWidh / width)
		// 	}, 
		// 	(err) => {
		// 		console.log('error', err);
		// 	}
		// );
		return (
			<View style={{ paddingBottom: 10 }}>
				<View style={{ flexDirection: 'row', height: 50, alignItems: 'center', justifyContent: 'space-between' }}>
					<TouchableOpacity onPress={() => { props.navigation.navigate('UserProfile', authorObj) }} style={{ position: 'absolute', top: 0, left: 7, height: 50, width: 50, borderRadius: 40, alignItems: 'center', justifyContent: 'center', resizeMode: 'contain', }} >
						<Image style={{ height: 50, width: 50, borderRadius: 35, alignItems: 'center', justifyContent: 'center' }} source={{ uri: author_profile_photo ? author_profile_photo : global.USER_PROFILE_URL }} />
					</TouchableOpacity>
					<View style={{ paddingLeft: 70, width: (windowWidth - 120) }}>
						<TouchableOpacity onPress={() => { props.navigation.navigate('UserProfile', authorObj) }} >
							<Text style={{ fontFamily: Constants.fontFamilyBold, fontSize: 16, lineHeight: 18, color: theme.textColor, textTransform: 'capitalize' }}>{author_username ? author_username : "unnamed"}</Text>
						</TouchableOpacity>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<View style={{ width: (location) ? 10 : 0 }}>
								<FontAwesome name={'map-marker'} color={Color.secondary} size={12} />
							</View>
							<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: (location) ? 12 : 0, lineHeight: 15, color: Color.secondary, textTransform: 'capitalize' }}>{location}</Text>
						</View>
					</View>
					<TouchableOpacity
						activeOpacity={0.8}
						style={{ height: 50, width: 50, alignItems: 'center', justifyContent: 'center' }}
						onPress={() => {
							setSelectedItem(item);
							setIsMoreModalVisible(true)
						}}
					>
						<Entypo name={'dots-three-horizontal'} color={theme.activeIcon} size={20} />
					</TouchableOpacity>
				</View>
				<View style={{ marginLeft: 70, marginRight: 15, marginTop: (description) ? 0 : 0 }}>
					<View style={{ flexDirection: 'row', marginBottom: (description) ? 15 : 0 }}>
						<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: (description) ? 15 : 0, lineHeight: (description) ? 17 : 0, color: theme.descriptiontextColor }}>{description}</Text>
					</View>
					<View style={{ flexDirection: 'row' }}>
						<TouchableOpacity onPress={() => { props.navigation.navigate('PostDetailScreen', { item: item }) }} >
							<FastImage
								source={{
									uri: file_url,
									priority: FastImage.priority.high,
								}}
								style={{ width: imageWidh, height: imgHeight, borderRadius: 15 }}
								resizeMode={FastImage.resizeMode.cover}
							/>
						</TouchableOpacity>
					</View>
					<View style={{ flexDirection: 'row', paddingTop: 5 }}>
						<View style={{ flexDirection: 'row', width: 70, alignItems: 'center' }}>
							<TouchableOpacity
								style={{
									height: 40,
									width: 40,
								}}
								onPress={() => {
									setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
									setIsLiked(() => !isLiked)
									dispatch(setLikes(item?.id, 'posts'))
								}}
							>
								{isLiked ?
									<Animated.View style={{
										height: 100,
										width: 100,
										position: 'absolute',
										top: -6,
										left: -6,
									}}>
										<LottieView
											ref={lottieRef}
											style={{

												height: 52,
												width: 52,
											}}
											source={require('./../../assets/heart.json')}
											autoPlay={true}
											loop={false}
										/>
									</Animated.View>
									:
									<View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
										<Image style={{ height: 25, width: 25, tintColor: theme.textColor, resizeMode: 'contain' }} source={require('../../Images/like.png')} />
									</View>
								}
							</TouchableOpacity>
							<Text style={{ color: theme.textColor, position: 'absolute', left: 40 }}>{likeCount}</Text>
						</View>
						<View style={{ flexDirection: 'row', width: 70, alignItems: 'center' }}>
							<TouchableOpacity style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center', resizeMode: 'contain' }} onPress={() => { props.navigation.navigate('CommentsScreen', { postid: item?.id, manageCommentCount, currentCnt: commentCount }) }}>
								{/* <Icons /> */}
								<Image style={{ height: 30, width: 30, tintColor: theme.textColor }} source={require('../../Images/Comments.png')} />
								{/* <CustomIcon name={'Solution'} color={Color.secondary} size={12} /> */}
							</TouchableOpacity>
							<Text style={{ color: theme.textColor }}>{commentCount}</Text>
						</View>
						<TouchableOpacity style={{ flexDirection: 'row', width: 70, alignItems: 'center' }} onPress={() => { OnSend() }}>
							<Image style={{ height: 22, width: 22, tintColor: theme.textColor, resizeMode: 'contain' }} source={require('../../Images/send.png')} />
						</TouchableOpacity>
					</View>
					<View style={{ flexDirection: "row", alignItems: 'center' }}>
						<View style={{ height: 30, width: 30, borderRadius: 20 }}>
							<Image
								source={profileImage}
								style={{ width: 30, height: 30, resizeMode: 'cover', backgroundColor: theme.textColor, borderRadius: 20 }}
							/>
						</View>
						<TouchableOpacity style={{ flex: 1, marginLeft: 10, paddingHorizontal: 10, paddingVertical: 5, flexDirection: "row", backgroundColor: '#666666', borderRadius: 50, alignItems: 'center' }} onPress={() => { props.navigation.navigate('CommentsScreen', { postid: item?.id, manageCommentCount, currentCnt: commentCount }) }} >
							<View
								activeOpacity={0.5}
								style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
							>
								<Image
									source={require('./../../Images/Comments.png')}
									style={{
										width: 30,
										height: 30,
										alignItems: 'center',
										justifyContent: 'center',
										resizeMode: 'contain',
										tintColor: 'white'
									}}
								/>
							</View>

							<View style={{ flex: 1, flexDirection: 'row' }}>
								<View style={{ width: windowWidth - 200, justifyContent: 'center' }}>
									<TextInput
										placeholder="Reply to Spaire..."
										placeholderTextColor='white'
										maxLength={2200}
										maxHeight={108}
										style={{ fontSize: 15, color: 'white', marginBottom: 0, padding: 5 }}
										multiline={true}
										onChange
									/>
								</View>
								<TouchableOpacity
									style={{
										width: 30,
										height: 30,
										alignItems: 'center',
										justifyContent: 'center'
									}}>
									<Image
										source={require('./../../Images/ic_create_reel_camera.png')}
										style={{
											width: 22,
											height: 22,
											resizeMode: 'contain',
											tintColor: 'white'
										}}
									/>
								</TouchableOpacity>
								{/* <TouchableOpacity
										style={{
											width: 40,
											height: 40,
											alignItems: 'center',
											justifyContent: 'center'
										}}>
										<AntDesign name={"picture"} size={28} color={'black'} style={{ marginHorizontal: 5, alignSelf: 'center' }} />
									</TouchableOpacity> */}
							</View>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		)
	}

	const renderItem = ({ item }) => {
		return (
			<Item item={item} key={item.id} author_username={item.author_username} description={item.description} location={item.location} file_url={item.file_url} total_like={item.total_like} total_comment={item.total_comment} author_profile_photo={item.author_profile_photo} />
		)
	};

	const menuItems = (bottom, title, url, onPress) => {
		return (
			<TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 30, bottom: bottom }} onPress={onPress}>
				<Text style={{ fontSize: 18, fontWeight: '500', color: 'black', fontFamily: Constants.fontFamilyMedium, textAlign: 'center', marginHorizontal: 25 }}>{title}</Text>
				<View style={{ height: 35, width: 35, borderRadius: 17, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.7, shadowRadius: 2 }, android: { elevation: 15, }, }), alignSelf: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
					<Image style={{ height: 25, width: 25, alignSelf: 'center', resizeMode: 'contain', tintColor: Color.secondary }} source={url} />
				</View>
			</TouchableOpacity>
		)
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
			{HeaderComponet()}
			<Modal
				transparent={true}
				isVisible={modalVisible}
				onRequestClose={() => {
					setmodalVisible(false);
				}}
				swipeDirection='down'
				onSwipeComplete={() => {
					setmodalVisible(false);
				}}
				style={{ margin: 0, backgroundColor: 'pink' }}
			>
				<View style={{ flex: 1, opacity: 0.9, paddingHorizontal: 20, paddingBottom: 70, alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: 'white' }}>
					<TouchableOpacity style={{ position: 'absolute', left: 20, top: 50 }} onPress={() => { setmodalVisible(false) }} >
						<Ionicons name={'close'} color={theme.textColor} size={25} />
					</TouchableOpacity>

					{menuItems(230, 'auction', require('../../Images/auction.png'), () => {
						setmodalVisible(false)
						props.navigation.navigate('CreateScreen')
					})}
					{menuItems(180, 'collection', require('../../Images/file.png'), () => {
						setmodalVisible(false)
						props.navigation.navigate('CreateScreen')
						// props.navigation.navigate('AddFutureScreens')
					})}
					{menuItems(135, 'NFT', require('../../Images/nft.png'), () => {
						setmodalVisible(false)
						props.navigation.navigate('CreateScreen')
						// props.navigation.navigate('AddIlustrationScreens')
					})}
					<TouchableOpacity
						style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 20, bottom: 75 }}
						onPress={() => {
							setmodalVisible(false)
							props.navigation.navigate('CreatePostScreen')
						}}
					>
						<Text style={{ fontSize: 18, fontWeight: '500', color: 'black', fontFamily: Constants.fontFamilyMedium, textAlign: 'center', textTransform: 'capitalize', marginHorizontal: 25 }}>speire</Text>
						<View style={{ height: 50, width: 50, borderRadius: 25, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.7, shadowRadius: 2 }, android: { elevation: 15 } }), alignSelf: 'center', justifyContent: 'center', backgroundColor: Color.secondary }}>
							<Image source={require('../../Images/speire.png')} style={{ resizeMode: 'contain', height: 50, width: 50, borderRadius: 25, tintColor: 'white', marginTop: 15, marginLeft: 5 }} />
						</View>
					</TouchableOpacity>
				</View>
			</Modal>

			<PostMenu navigation={props.navigation} selectedItem={selectedItem} isMoreModalVisible={isMoreModalVisible} setIsMoreModalVisible={setIsMoreModalVisible} currentLogedUserID={currentLogedUserID} />

			<ShareModal isSendModalVisible={isSendModalVisible} setModalVisibility={setIsSendModalVisible} userData={myFollowingsList} OnUserSend={OnUserSend} />

			<View style={{ flexDirection: 'row', marginVertical: 10, alignSelf: 'center', justifyContent: 'center', backgroundColor: 'transparent' }}>
				{/* <Lottie
					source={require('./../../assets/BarSlider111.json')}
					autoPlay={true}
					loop
					style={{ height: 500, justifyContent: 'center' }}> */}
				{/* <Image source={theme.themeMode == 'dark' ? require('../../Images/animated_black.gif') : require('../../Images/animated_white.gif')} style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center', height: 60, width: 310 }}></Image> */}
				<LinearGradient style={{ flexDirection: "row", maxHeight: 60, minWidth: 280, paddingHorizontal: 5, alignItems: 'center', justifyContent: 'center', borderRadius: 40 }} start={{ x: 0.0, y: 1.0 }} end={{ x: 1.0, y: 1.0 }} colors={['#6A4ECE', '#637EFE', '#1DA1F2']}>
					<ScrollView
						horizontal={true}
						bounces={false}
					>
						{
							latestNfts.map((item) => {
								return (
									<TouchableOpacity onPress={() => { props.navigation.navigate('NFTDetailScreen', { item }) }} style={{ height: 50, width: 50, borderRadius: 25, marginRight: 2, marginLeft: 3, marginTop: 5, marginBottom: 5, backgroundColor: 'white' }} key={item.id}>
										<Image source={{ uri: item.image_url }} style={{ resizeMode: 'cover', height: 50, width: 50, borderRadius: 25 }} />
									</TouchableOpacity>
								)
							})
						}
					</ScrollView>
				</LinearGradient>

				{/* </Lottie> */}
				{/* </Image> */}
				{/* <View style={{ position: 'absolute', top: 0, right: 0 }}>
					<TouchableOpacity
						activeOpacity={0.8}
						style={{ flexDirection: 'row', height: 50, paddingLeft: 8, borderTopLeftRadius: 30, borderBottomLeftRadius: 30, alignItems: 'center', justifyContent: 'flex-end', backgroundColor: '#eee' }}
						onPress={() => {
							setmodalVisible(false)
							props.navigation.navigate('NftScreen')
						}}
					>
						<View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: "#eee", marginRight: 5, borderRadius: 25 }} onPress={() => { props.navigation.navigate('CreateScreen') }}>
							<Image source={(require('../../Images/nft.gif'))} style={{ resizeMode: 'contain', height: 40, width: 40, borderRadius: 20, }} />
						</View>
						<View style={{ height: 50, width: 25, alignSelf: 'center', justifyContent: 'center' }}>
							<AntDesign name={'doubleright'} color={'black'} size={20} />
						</View>
					</TouchableOpacity>
				</View> */}
			</View>
			{
				showLoader &&
				<View style={{ height: windowHeight }}>
					<SkeletonPlaceholder backgroundColor='#777' highlightColor='#999' speed={1000}>
						<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
							<SkeletonPlaceholder.Item marginLeft={5} width={50} height={50} borderRadius={50} />
							<SkeletonPlaceholder.Item marginLeft={15}>
								<SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
						<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={5}>
							<SkeletonPlaceholder.Item marginLeft={70} width={140} height={20} borderRadius={4}></SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
						<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={20}>
							<SkeletonPlaceholder.Item marginLeft={70} width={270} height={200} borderRadius={4}></SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
						{/* Second replica */}
						<SkeletonPlaceholder.Item flexDirection="row" alignItems="center">
							<SkeletonPlaceholder.Item marginLeft={5} width={50} height={50} borderRadius={50} />
							<SkeletonPlaceholder.Item marginLeft={15}>
								<SkeletonPlaceholder.Item width={120} height={20} borderRadius={4} />
							</SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
						<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={5}>
							<SkeletonPlaceholder.Item marginLeft={70} width={140} height={20} borderRadius={4}></SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
						<SkeletonPlaceholder.Item flexDirection="row" alignItems="center" marginTop={20}>
							<SkeletonPlaceholder.Item marginLeft={70} width={270} height={200} borderRadius={4}></SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder>
				</View>
			}
			{
				(!trendingtPost || trendingtPost.length === 0) ?
					<NoDataScreen isVisible={(!trendingtPost || trendingtPost.length === 0)} message="Looks like you dont't search anything yet." />
					:
					<FlatList
						data={trendingtPost}
						renderItem={renderItem}
						bounces={false}
						keyExtractor={item => item.id}
						showsVerticalScrollIndicator={false}
						onEndReachedThreshold={5}
						onEndReached={!requesting ? onEndReached : null}
					/>
			}
			{
				modalVisible ?
					<TouchableOpacity style={{ position: 'absolute', right: 20, bottom: 10, height: 50, width: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 30, backgroundColor: Color.secondary }}>
					</TouchableOpacity>
					:
					<TouchableOpacity
						activeOpacity={0.8}
						style={{
							position: 'absolute',
							right: 20,
							bottom: 20
						}}
						onPress={() => { setmodalVisible(true) }}
					>
						<Image
							source={require('../../Images/Plus_icon.png')}
							style={{
								height: 50,
								width: 50,
								justifyContent: 'center',
								alignSelf: 'center',
								borderRadius: 35,
								resizeMode: 'contain'
							}}
						/>
					</TouchableOpacity>
			}
		</SafeAreaView>
	);
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

export default HomeScreen;
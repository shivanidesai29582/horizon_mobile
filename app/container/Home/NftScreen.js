import React, { useState, useEffect, useCallback } from 'react';
import { Animated, SafeAreaView, TouchableOpacity, View, DeviceEventEmitter, Dimensions } from 'react-native';
import { useWalletConnect } from "@walletconnect/react-native-dapp";
import MasonryList from '@react-native-seoul/masonry-list';
import { TabView, SceneMap } from 'react-native-tab-view';
import { useDispatch, useSelector } from 'react-redux';
import { getTrendingAuction } from "./../../redux/auction";
import { getTrendingNfts } from "./../../redux/nft";
import { getTrendingCollection } from "./../../redux/collection"
import global from '../../common/globals';
import Constants from "../../common/Constants";
import AuctionItem from "./Components/AuctionItem";
import CollectionItem from "./Components/CollectionItem";
import NftItem from "./Components/NftItem";
import { useTheme } from './../../Context';
import Color from "../../common/Color";
import NoDataScreen from '../NoDataScreen';
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const NftScreen = (props) => {
	const { theme, updateTheme } = useTheme();
	const [refreshing, setRefreshing] = useState(false);
	const [showNFTScalitonLoader, setShowNFTScalitonLoader] = useState(false);// NFT Loader
	const [showCollectionScalitonLoader, setShowCollectionScalitonLoader] = useState(false); //Collection Loader
	const [showAuctionScalitonLoader, setShowAuctionScalitonLoader] = useState(false); // Auction Loader

	const connector = useWalletConnect();

	const connectWallet = useCallback(() => {
		return connector.connect();
	}, [connector]);

	const killSession = useCallback(() => {
		return connector.killSession();
	}, [connector]);

	const shortenAddress = (address) => {
		return `${address.slice(0, 6)}...${address.slice(
			address.length - 4,
			address.length
		)}`;
	};

	const dispatch = useDispatch();
	const [startFrom, setstartFrom] = useState(0);
	const recordSize = 10;

	const trendingnnftsList = useSelector((state) => state?.nft?.trending_nfts);
	const trendingcollectionList = useSelector((state) => state?.collection?.trending_collections);
	const trendingauctionList = useSelector((state) => state?.auction?.trending_auctions);

	const userinfo = useSelector((state) => state?.userlogin?.userInfo)?.length === 0 ? useSelector((state) => state?.registration?.userInfo) : useSelector((state) => state?.userlogin?.userInfo);

	const profileImage = { uri: userinfo?.profile_photo == null ? global.USER_PROFILE_URL : userinfo?.profile_photo };

	const [modalVisible, setModalVisible] = useState(false);
	const [selectedCategory, setSelectedCategory] = useState(0);

	const activeArrayLength = userinfo?.stories?.filter((ele) => ele?.status === 'Active')?.length;

	useEffect(() => {
		Reload();
	}, []);
	useEffect(() => {
		DeviceEventEmitter.addListener('setHome', () => {
			onRefresh();
		});
	}, [1])


	const Reload = () => {
		dispatch(getTrendingCollection(startFrom, recordSize));
		dispatch(getTrendingNfts(startFrom, recordSize));
		dispatch(getTrendingAuction(startFrom, recordSize));
	}

	const wait = (timeout) => {
		return new Promise(resolve => setTimeout(resolve, timeout));
	}

	const onRefresh = useCallback(() => {
		Reload();
	}, []);

	const [isDark, setIsDark] = useState(theme.themeMode === 'default' ? false : true);


	//Scaliton Loader Design
	const addLoader = () => {
		const loaderMarginTop = 10;
		const loaderMarginLeft = 5;
		const loaderBorderRadius = 15;
		const loaderSmallBoxHeight = 150;
		const loaderLargeBoxHeight = 280;
		return (
			<View style={{ height: windowHeight }}>
				<SkeletonPlaceholder backgroundColor='#777' highlightColor='#999' speed={1000}>
					<SkeletonPlaceholder.Item flexDirection="row" flexWrap='wrap' alignItems="flex-start">
						<SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} width={(windowWidth / 2) - 10} >
							<SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} height={loaderSmallBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} marginTop={loaderMarginTop} height={loaderLargeBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} marginTop={loaderMarginTop} height={loaderSmallBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
						<SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} width={(windowWidth / 2) - 10} >
							<SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} height={loaderLargeBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} marginTop={loaderMarginTop} height={loaderSmallBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
							<SkeletonPlaceholder.Item marginLeft={loaderMarginLeft} marginTop={loaderMarginTop} height={loaderLargeBoxHeight} borderRadius={loaderBorderRadius}></SkeletonPlaceholder.Item>
						</SkeletonPlaceholder.Item>
					</SkeletonPlaceholder.Item>
				</SkeletonPlaceholder>
			</View>
		)
	}

	const CollectionRoute = () => {
		return (
			<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
				{showCollectionScalitonLoader && addLoader()}
				{(!trendingcollectionList || trendingcollectionList.length === 0) ?
					<NoDataScreen isVisible={(!trendingcollectionList || trendingcollectionList.length === 0)} message="Looks like you dont't search anything yet." />
					:
					<MasonryList
						data={trendingcollectionList}
						horizontal={false}
						showsHorizontalScrollIndicator={false}
						numColumns={2}
						renderItem={({ item, index }) => {
							return (
								<CollectionItem onPress={() => { props.navigation.navigate('CollectionProfileScreen', { item }) }} item={item} key={item.id} />
							)
						}}
					/>
				}
			</View>
		);
	}

	const NFTRoute = () => {
		return (
			<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
				{showNFTScalitonLoader && addLoader()}
				{(!trendingnnftsList || trendingnnftsList.length === 0) ?
					<NoDataScreen isVisible={(!trendingnnftsList || trendingnnftsList.length === 0)} message="Looks like you dont't search anything yet." />
					:
					<MasonryList
						data={trendingnnftsList}
						horizontal={false}
						showsHorizontalScrollIndicator={false}
						numColumns={2}
						renderItem={({ item, index }) => {
							return (
								<NftItem onPress={() => { props.navigation.navigate('NFTDetailScreen', { item }) }} item={item} key={item.id} />
							)
						}}
					/>
				}
			</View>
		);
	}

	const AuctionRoute = () => {
		return (
			<View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
				{showAuctionScalitonLoader && addLoader()}
				{(!trendingauctionList || trendingauctionList.length === 0) ?
					<NoDataScreen isVisible={(!trendingauctionList || trendingauctionList.length === 0)} message="Looks like you dont't search anything yet." />
					:
					<MasonryList
						data={trendingauctionList}
						horizontal={false}
						showsHorizontalScrollIndicator={false}
						numColumns={2}
						renderItem={({ item, index }) => {
							return (
								<AuctionItem onPress={() => { props.navigation.navigate('AuctionDetailScreen', { item }) }} item={item} key={item.id} />
							)
						}}
					/>
				}
			</View>
		);
	}

	const renderScene = SceneMap({
		NFT: NFTRoute,
		Collection: CollectionRoute,
		Auction: AuctionRoute
	});

	const [index, setIndex] = React.useState(0);
	function changeTabIndex(ind) {
		if (ind == 0) {
			setShowNFTScalitonLoader(true);
			wait(2000).then(() => {
				setShowNFTScalitonLoader(false)
			});
		}
		else if (ind == 1) {
			setShowCollectionScalitonLoader(true);
			wait(2000).then(() => {
				setShowCollectionScalitonLoader(false)
			});

		}
		else if (ind == 2) {
			setShowAuctionScalitonLoader(true);
			wait(2000).then(() => {
				setShowAuctionScalitonLoader(false)
			});
		}
		setIndex(ind);
	}

	const [routes] = React.useState([
		{ key: 'NFT', title: 'NFT' },
		{ key: 'Collection', title: 'Collection' },
		{ key: 'Auction', title: 'Auction' },
	]);

	const renderTabBar = (props) => {
		const inputRange = props.navigationState.routes.map((x, i) => i);
		return (
			<View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
				{props.navigationState.routes.map((route, i) => {
					const opacity = props.position.interpolate({
						inputRange,
						outputRange: inputRange.map((inputIndex) => (
							inputIndex === i ? 1 : 0.6
						)),
					});

					return (
						<TouchableOpacity
							style={{ alignItems: 'center', width: 80, marginBottom: 20 }}
							activeOpacity={0.8}
							onPress={() => changeTabIndex(i)}
							key={i}
						>
							<View style={{ paddingBottom: 2, borderBottomWidth: 3, borderBottomColor: props.navigationState.index == i ? Color.secondary : 'transparent' }}>
								<Animated.Text style={{ opacity, fontSize: 14, fontFamily: Constants.fontFamilyBold, color: theme.textColor, borderBottomColor: 'transparent', borderBottomWidth: 0 }}>{route.title}</Animated.Text>
							</View>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
			<View style={{ flex: 1, flexDirection: "row", marginTop: 15 }}>
				<TabView
					tabBarPosition='top'
					navigationState={{ index, routes }}
					renderScene={renderScene}
					onIndexChange={changeTabIndex}
					renderTabBar={renderTabBar}
				/>
				{/* <TouchableOpacity onPress={() => { props.navigation.navigate({ name: "HomeScreen", merge: true }); }} style={{ position: 'absolute', paddingHorizontal: 10, paddingTop: 0, paddingBottom: 15, top: 0, left: 15 }} activeOpacity={0.8}>
					<Ionicons name={'chevron-back-circle-outline'} style={{ left: 0 }} color={theme.textColor} size={30} />
				</TouchableOpacity> */}
			</View>
		</SafeAreaView>
	);

}

export default NftScreen;

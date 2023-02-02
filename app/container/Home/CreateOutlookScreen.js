import React from 'react';
import {
	Image,
	SafeAreaView,
	ScrollView,
	Dimensions,
	FlatList,
	Text,
	TouchableOpacity,
	View,
} from 'react-native';
import Constants from "../../common/Constants";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from '../../Context';
import { Color } from '../../common';

var width = Dimensions.get('window').width;

const Detail = [
	{
		title: 1,
		value: 69,
		discount: ''
	},
	{
		title: 3,
		value: 186,
		discount: 10,
	},
	{
		title: 9,
		value: 527,
		discount: 15,
	},
	{
		title: 12,
		value: 662,
		discount: 20,
	}
];

const Item = ({ title, value, discount, style }) => {
	const { theme } = useTheme();

	return (
		<TouchableOpacity style={[{ width: (width * 0.43), margin: 10, marginTop: 0, marginRight: 0, paddingVertical: 20, alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderWidth: 1, borderColor: Color.secondary }, style]} >
			<View style={{ alignItems: 'center', justifyContent: 'center', paddingBottom: 10 }}>
				<Text style={{ fontFamily: Constants.fontFamilyBold, fontSize: 30, lineHeight: 33, color: theme.textColor, textTransform: 'capitalize' }}>{title}</Text>
				<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 16, lineHeight: 18, color: theme.textColor, textTransform: 'capitalize' }}>month</Text>
			</View>
			<Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 18, lineHeight: 20, color: theme.textColor, textTransform: 'uppercase' }}>{'\u20B9'}{value}/-</Text>
			<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 14, lineHeight: 16, color: theme.textColor, textTransform: 'capitalize' }}>{discount}{discount === '' ? '' : '% off'}</Text>
		</TouchableOpacity>
	)
}

const renderItem = ({ item, index }) => {
	return (
		<Item title={item.title} value={item.value} discount={item.discount} style={index == 0 && { borderWidth: 5, borderColor: Color.yellow }} onPress={index == item ? item.onPress : ''} />
	)
};

const Terms = (detail) => {
	const { theme } = useTheme();
	return (
		<View>
			<Text style={{ fontSize: 14, lineHeight: 16, color: theme.textColor }}>{detail}</Text>
		</View>
	)
}

const CreateOutlookScreen = (props) => {
	const { theme } = useTheme();

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
			<ScrollView
				bounces={false}
				showsVerticalScrollIndicator={false}
				style={{ margin: 10 }}
			>
				<TouchableOpacity onPress={() => { props.navigation.goBack('HomeScreen') }} style={{ height: 30, width: 30, borderRadius: 15, borderWidth: 1, borderColor: theme.activeIcon, justifyContent: 'center', alignItems: 'center' }}>
					<Ionicons name={'md-chevron-back'} color={theme.activeIcon} size={20} />
				</TouchableOpacity>
				<View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 15 }}>
					<Text style={{ fontFamily: Constants.fontFamilyBold, fontSize: 24, lineHeight: 26, color: theme.textColor, textAlign: 'center', textTransform: 'capitalize' }}>outLook</Text>
				</View>
				<View style={{ alignItems: 'center', justifyContent: 'center' }}>
					<Image source={require('../../Images/outlook.png')} resizeMode={"contain"} style={{ width: '100%', height: 150 }} />
				</View>
				<View style={{ alignItems: 'center', justifyContent: 'center', paddingHorizontal: 30, paddingVertical: 20 }}>
					<Text style={{ fontFamily: Constants.fontFamilyMedium, fontSize: 22, lineHeight: 26, color: theme.textColor, textAlign: 'center', textTransform: 'capitalize' }}>get your profile graphs and go </Text>
				</View>
				<View>
					<FlatList
						data={Detail}
						renderItem={renderItem}
						bounces={false}
						numColumns={2}
						horizontal={false}
						keyExtractor={item => item.type}
						showsVerticalScrollIndicator={false}
					/>
				</View>
				<TouchableOpacity activeOpacity={0.8} style={{ alignItems: 'center', marginVertical: 20 }}>
					<View style={{ height: 50, width: 230, borderRadius: 25, alignItems: 'center', justifyContent: 'center', backgroundColor: Color.yellow }}>
						<Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 18, lineHeight: 20, color: 'black', textTransform: 'capitalize' }}>continue</Text>
					</View>
				</TouchableOpacity>
				{Terms('By tapping continue, you agree to our Terms, if purchasing by credit card, your payment will be charged and your subscription will automatically renew for the same package length at the same price until you canceled,')}
			</ScrollView>
		</SafeAreaView>
	)
};

export default CreateOutlookScreen

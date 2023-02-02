import React, { useEffect, useState } from 'react';
import { Image, SafeAreaView, Text, TouchableOpacity, View, Dropdown, Platform, DeviceEventEmitter } from 'react-native';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import { toast } from '../../../Omni';
import LoginHeader from "../../Components/LoginHeader";
import Button1Component from "../../../Components/Button1Component";
import { AddFutureVisit } from "../../../redux/futurevisit"
import { useTheme } from '../../../Context';
import styles from './styles';

const AddFutureScreens = (props) => {
	const dispatch = useDispatch();
	const { theme } = useTheme();

	const [priority, setPriority] = useState('High');
	const [expectedDate, setExpectedDate] = useState(new Date());
	const [cardExpDateopen, setcardExpDateOpen] = useState(false);
	const [locationName, setLocationName] = useState('Select Location');
	const [location, setLocation] = useState([]);

	const data = [
		{ label: 'High', value: 'High' },
		{ label: 'Medium', value: 'Medium' },
		{ label: 'Low', value: 'Low' }
	]

	useEffect(() => {
		DeviceEventEmitter.addListener('setfutureLocation', (value) => {
			setLocationName(value?.name);
			setLocation(value?.location);
		});
	}, [1])

	const checkValidation = () => {
		if (location.length !== 0) {
			AddFuture();
		} else {
			toast('Please add your future visit location')
		}
	}

	const AddFuture = () => {
		const latitude = `${location?.latitude}`;
		const longitude = `${location?.longitude}`;
		dispatch(AddFutureVisit({ latitude, longitude, priority, expected_date: moment(expectedDate).format("YYYY-MM-DDTHH:mm:ss.000Z") }))
			.then(() => props.navigation.pop())
	}

	return (
		<SafeAreaView style={styles(theme).container}>
			<LoginHeader onBackPress={() => { props.navigation.pop() }} />
			<View style={styles.mainSection}>
				<Image
					source={require('../../../Images/addFutureVisit.png')}
					style={styles.imageWrapper}
				/>
				<Text style={styles(theme).textWrapper}>Add Future Visit</Text>
				<TouchableOpacity onPress={() => { props.navigation.navigate('AddLocation', { location, TYPE: 'future' }) }} style={{ paddingVertical: 5, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: '#9F9696', borderRadius: 15, marginTop: 30 }}>
					<Image
						source={require('../../../Images/email_icon.png')}
						resizeMode={"contain"}
						style={styles(theme).iconWrapper}
					/>
					{/* <TextInput editable={false} selectTextOnFocus={false} value={locationName} style={{ marginHorizontal: 15, fontSize: 13, paddingVertical: 10, flex: 1, fontFamily: Constants.fontFamilyRegular, color: theme.textColor }} placeholderTextColor={'#B9B8BC'} placeholder={'Select Location'}></TextInput > */}
					<Text numberOfLines={2} style={styles(theme).locationText}>{locationName}</Text >
				</TouchableOpacity>
				<Dropdown
					style={[Platform.OS == 'ios' ? styles.iosDropUpDownStyle : styles.androidDropUpDownStyle, styles.dropDownSection]}
					placeholderStyle={[styles.droupdownText, { color: theme.textColor }]}
					selectedTextStyle={[styles.droupdownText, { color: theme.textColor }]}
					data={data}
					maxHeight={155}
					labelField="label"
					valueField="value"
					placeholder={priority}
					value={priority}
					containerStyle={{ backgroundColor: theme.backgroundColor }}
					activeColor={theme.backgroundColor}
					onChange={item => { setPriority(item.value); }}
				/>
				<TouchableOpacity style={styles.timerWrapper} onPress={() => setcardExpDateOpen(true)} >
					<Text style={styles(theme).locationText}>{moment(expectedDate).format("YYYY-MM-DD")}</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.buttonWrapper}>
				<Button1Component onPress={() => { checkValidation() }} extraviewstyle={{ width: '90%' }} title={'Add Future Visit'} />
			</View>
			<DatePicker
				modal
				open={cardExpDateopen}
				date={expectedDate}
				onConfirm={(date) => {
					setcardExpDateOpen(false)
					setExpectedDate(date)
				}}
				onCancel={() => {
					setcardExpDateOpen(false)
				}}
				mode="date"
				minimumDate={expectedDate}
			/>
		</SafeAreaView>
	);
}

export default AddFutureScreens;

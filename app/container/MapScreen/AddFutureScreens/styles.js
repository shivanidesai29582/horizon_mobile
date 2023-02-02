import React from 'react';
import { StyleSheet } from 'react-native';
import Constants from "../../../common/Constants";

const styles = (theme) => StyleSheet.create({  
	container: {
		flex: 1,
		backgroundColor: theme.backgroundColor
	},
	mainSection: {
		flex: 1,
		padding: 20
	},
	imageWrapper: {
		height: '50%',
		width: undefined,
		aspectRatio: 0.97,
		alignSelf: 'center'
	},
	textWrapper: {
		fontSize: 25,
		fontFamily: Constants.fontFamilyBold,
		color: theme.textColor,
		padding: 0,
		marginTop: 15,
		includeFontPadding: false
	},
	iconWrapper: {
		height: undefined,
		width: 20,
		aspectRatio: 1,
		tintColor: theme.textColor
	},
	locationText: {
		flex: 1,
		fontSize: 13,
		fontFamily: Constants.fontFamilyRegular,
		color: theme.textColor,
		marginHorizontal: 15,
		paddingVertical: 10   
	},
	iosDropUpDownStyle: {
		height: 48,
		width: '100%',
		padding: 15,
		borderRadius: 10,
	},
	dropDownSection: {
		marginTop: 10,
		borderWidth: 1,
		borderColor: '#9F9696',
		borderRadius: 15
	},
	droupdownText: {
		fontFamily: Constants.fontFamilyRegular,
		color: '#FFFFFF',
		fontSize: 13
	},
	buttonWrapper: {
		alignItems: 'center',
		marginVertical: 20
	},
  timerWrapper: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 10,
		paddingVertical: 5,
		paddingHorizontal: 20,
		borderWidth: 1,
		borderColor: '#9F9696',
		borderRadius: 15 
	},
  androidDropUpDownStyle: {
		height: 48,
		width: '100%',
		paddingLeft: 15,
		paddingRight: 15,
		borderRadius: 10,
	},
});

export default styles;

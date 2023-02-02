import { StyleSheet } from "react-native";
import Constants from "../../common/Constants";
export const IconSize = 25;

export const SettingsStyle = (theme) => StyleSheet.create({
    Maincontainer: {
        flex: 1,
        backgroundColor: theme.backgroundColor
    },
    ViewStyle: {
        marginVertical: 15,
        flexDirection: 'row'
    },
    TitleStyle: {
        marginVertical: 15,
        color: theme.textColor,
        fontFamily: Constants.fontFamilySemiBold,
        fontSize: 18,
        textAlign: 'left'
    },
    SubTitleStyle: {
        color: theme.textColor,
        fontFamily: Constants.fontFamilyMedium,
        fontSize: 16,
        textTransform: 'capitalize',
        textAlign: 'left'
    }
});

import React from 'react';
import {
    Image,
    SafeAreaView,
    TextInput,
    Text,
    View,
} from 'react-native';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Constants from "../../common/Constants";
import { useTheme } from '../../Context';

const CreateStoryScreen = (props) => {
    const { theme } = useTheme();

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor}}>
            <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'space-between'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ height: 50, width: 50, borderRadius: 35, backgroundColor: 'gray' }}>
                            <Image source={require('../../Images/reel7.png')} style={{  height: 50, width: 50, borderRadius: 35, alignSelf: 'center' }} />
                        </View>
                        <Text style={{ fontFamily: Constants.fontFamilyRegular, fontSize: 18, lineHeight: 20, color: theme.textColor, marginLeft: 8, textAlign: 'center', textTransform: 'capitalize' }}>Name</Text>
                   </View>
                </View>
                <View style={{ alignItems: 'center', justifyContent: 'center'}}>
                    <MaterialIcons name={'more-vert'} color={theme.activeIcon} size={25} />
                </View>
            </View>
            <View style={{ flex: 1, padding: 10, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <TextInput
                    style={{
                        width: 250,
                        padding: 10,
                        borderWidth: 1,
                        borderRadius: 20,
                        borderColor: theme.textColor
                    }}
                    placeholder="send a moment"
                    placeholderTextColor={theme.textColor}
                    keyboardType="default"
                />
                <View style={{ flexDirection: 'row'}}>
                    <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name={'heart-o'} color={theme.activeIcon} size={25} />
                    </View>
                    <View style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center' }}>
                        <Image source={require('../../Images/send.png')} style={{ height: 25, width: 25, transform: ([{ rotateX: '0deg' },{ rotateZ: '40deg' }]) }} />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
};

export default CreateStoryScreen

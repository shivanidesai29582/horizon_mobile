import React, { useState } from 'react';
import { FlatList, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { Header } from "../Components/LoginHeader";
import global from "../../common/globals"
import { useTheme } from './../../Context';
import Ionicons from "react-native-vector-icons/Ionicons";
import horizonApiAxios from '../../services/restclient/horizonApiAxios';


const IFlashStoriesAddScreen = (props) => {
    const { theme } = useTheme();

    const [allstoriesArray, setAllstoriesArray] = useState(props?.route?.params?.iArchivedstoriesArray);

    const AddStoryStatus = async (index, id, status) => {

        horizonApiAxios.put(`stories/update/${id}`, { status: `${status}` })
            .then((response) => {
                const newData = [...allstoriesArray];
                newData[index].status = status;
                setAllstoriesArray(newData);
            })
            .catch((data) => {
            });
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <Header isShownSearch={false} title={"New iFlash"} onBackPress={() => {
                props.navigation.pop()
            }} />

            <FlatList
                horizontal={false}
                numColumns={3}
                data={allstoriesArray}
                style={{}}
                columnWrapperStyle={{ margin: 5 }}
                renderItem={({ item, index }) => {
                    return (<TouchableOpacity onPress={() => { AddStoryStatus(index, item?.id, item?.status === 'Saved' ? 'Archived' : 'Saved') }} style={{ flex: 1, margin: 5 }}>
                        <Image style={{ resizeMode: 'cover', height: 200, borderRadius: 5 }} source={{ uri: item?.image_url == null ? global.COLLECTION_IMAGE_URL2 : item?.image_url }} />
                        <Ionicons name={item?.status === 'Saved' ? 'checkmark-circle-sharp' : 'ellipse-outline'} color={theme.activeIcon} size={20} style={{ position: 'absolute', right: 0 }} />

                    </TouchableOpacity>)
                }} />

        </SafeAreaView>
    );

}

export default IFlashStoriesAddScreen;

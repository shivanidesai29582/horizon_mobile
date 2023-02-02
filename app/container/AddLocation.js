import React, { useState } from 'react'
import {
    SafeAreaView,
    StyleSheet,
    View,
    DeviceEventEmitter,
    Image
} from 'react-native'
import SearchBarWithAutocomplete from './../Components/SearchBarWithAutocomplete';
import axios from 'axios';
import { useDebounce } from './../utils/useDebounce'
import global from '../common/globals';
import MapView, { Marker } from 'react-native-maps';

const AddLocation = (props) => {

    const [search, setSearch] = useState({ term: '', fetchPredictions: false })
    const [placeDetails, setPlaceDetails] = useState('');
    const [showPredictions, setShowPredictions] = useState(false)
    const [predictions, setPredictions] = useState([]);
    const [location, setLoaction] = useState({
        latitude: props?.route?.params?.location?.latitude ? props?.route?.params?.location?.latitude : 37.78825,
        longitude: props?.route?.params?.location?.longitude ? props?.route?.params?.location?.longitude : -122.4324,
        latitudeDelta: 0.0105,
        longitudeDelta: 0.0102,
    });
    const [markerlocation, setMarkerLoaction] = useState({
        latitude: props?.route?.params?.location?.latitude ? props?.route?.params?.location?.latitude : 37.78825,
        longitude: props?.route?.params?.location?.longitude ? props?.route?.params?.location?.longitude : -122.4324,
    });
    const Type = props?.route?.params?.TYPE;
    const GOOGLE_PACES_API_BASE_URL = 'https://maps.googleapis.com/maps/api/place'

    const onChangeText = async () => {
        if (search.term.trim() === '') return
        if (!search.fetchPredictions) return
        const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/autocomplete/json?key=${global.GOOGLE_KEY}&input=${search.term}`
        try {
            const result = await axios.request({
                method: 'post',
                url: apiUrl
            })
            if (result) {
                const { data: { predictions } } = result
                setPredictions(predictions)
                setShowPredictions(true)
            }
        } catch (e) {
            // console.log(e)
        }
    }

    useDebounce(onChangeText, 1000, [search.term])

    const onPredictionTapped = async (placeId, description) => {

        const apiUrl = `${GOOGLE_PACES_API_BASE_URL}/details/json?key=${global.GOOGLE_KEY}&place_id=${placeId}`
        try {
            const result = await axios.request({
                method: 'post',
                url: apiUrl
            })
            if (result) {
                const { data: { result: { geometry: { location } } } } = result

                const { lat, lng } = location;

                setLoaction({
                    latitude: lat,
                    longitude: lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                });
                setMarkerLoaction({ latitude: lat, longitude: lng })
                setShowPredictions(false)
                setSearch({ term: description })
                setPlaceDetails(result?.data?.result?.address_components);

            }
        } catch (e) {
            // console.log(e)
        }
    }

    const onMapPress = (e) => {
        let oldLocation = { ...location };
        oldLocation.latitude = e.nativeEvent.coordinate.latitude;
        oldLocation.longitude = e.nativeEvent.coordinate.longitude;
        setLoaction(oldLocation);
        setMarkerLoaction(e.nativeEvent.coordinate)
        getLocationName(e.nativeEvent.coordinate)
    }

    const getLocationName = async (tapLocation) => {
        const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${tapLocation?.latitude},${tapLocation?.longitude}&key=${global.GOOGLE_KEY}`
        try {
            const result = await axios.request({
                method: 'post',
                url: apiUrl
            })
            if (result) {
                setPlaceDetails(result?.data?.results[0]?.address_components);
                setSearch({ term: result?.data?.results[0]?.formatted_address, fetchPredictions: false })
            }
        } catch (e) {
            // console.log(e)
        }
    }

    return (
        <>
            <SafeAreaView style={styles.container}>

                <MapView
                    style={{ flex: 1 }}
                    region={location}
                    showsUserLocation={false}
                    onPress={(e) => { onMapPress(e) }}>

                    <Marker
                        draggable
                        coordinate={markerlocation} >
                        <Image source={require('../Images/ic_marker.png')} style={{ height: 35, width: 35 }} />

                    </Marker>

                </MapView>

                <View style={styles.body}>
                    <SearchBarWithAutocomplete
                        value={search.term}
                        onChangeText={(text) => {
                            setSearch({ term: text, fetchPredictions: true })
                        }}
                        showPredictions={showPredictions}
                        predictions={predictions}
                        onPredictionTapped={onPredictionTapped}
                        OnAdd={() => {
                            DeviceEventEmitter.emit(`set${Type}Location`, { location: markerlocation, name: search.term, place: placeDetails });
                            props.navigation.pop();
                        }}
                    />
                </View>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    body: {
        paddingHorizontal: 20,
        position: 'absolute',
        top: 5,
        width: '100%'
    }
})


export default AddLocation
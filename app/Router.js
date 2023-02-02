import React from 'react';
import { SafeAreaView } from 'react-native';
import Navigation from '../app/navigation';
import FlashMessage from "react-native-flash-message";


export default Router = () => {
    return (
        <SafeAreaView style={{
            flex: 1,
            overflow: "hidden",
            backgroundColor: 'black'
        }}>
            <Navigation />
            <FlashMessage position="top" />
        </SafeAreaView>
    );
}






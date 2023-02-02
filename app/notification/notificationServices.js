import messaging from "@react-native-firebase/messaging";
import { set, get } from './../storage';
import { showMessage } from "react-native-flash-message";
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
        getFcmToken()
    }
}

const getFcmToken = async () => {
    let fcmToken = await get('fcm_token');

    if (!fcmToken) {
        try {
            const fcmToken = await messaging().getToken();
            if (fcmToken) {
                await set('fcm_token', fcmToken);
                // console.log("******** Token", fcmToken);
            }
        } catch (error) {
            // console.log("********* fcm error", error);
        }


    }
}

export const notificationListener = async () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        // console.log("********* Notication caused app to open background state:", remoteMessage.notification);
    });

    // messaging().onMessage(async remoteMessage => {
    //     console.log("********* Notification in foreground", remoteMessage.notification);

    // })

    messaging().onMessage(async remoteMessage => {
        //     console.log("********* Notification in foreground", remoteMessage.notification);

        if (remoteMessage && remoteMessage.data) {
            if (remoteMessage.data) {
                showMessage({
                    icon: 'success',
                    duration: 8000,
                    floating: true,
                    message: remoteMessage.notification.title,
                    description: remoteMessage.notification.body,
                    type: "success",
                    onPress: () => {
                        if (remoteMessage.data) {
                            // this.props.navigation.navigate("IndividualChatScreen", {chatItem: JSON.parse(remoteMessage.data.chatItem)})
                        }

                    }
                });
            }
        }
    });

    messaging().getInitialNotification().then(remoteMessage => {
        if (remoteMessage) {
            // console.log("********* Notification caused app to from quit state:", remoteMessage.notification);
        }
    })

}
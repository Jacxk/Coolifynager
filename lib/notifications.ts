import { APP_COLOR, APP_ID } from "@/constants/AppDetails";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

type NotificationResult =
  | { success: true; token: string }
  | { success: false; error: string };

export function getNotificationsPermission() {
  return Notifications.getPermissionsAsync();
}

export async function registerForPushNotificationsAsync(): Promise<NotificationResult> {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 0, 250],
      lightColor: APP_COLOR,
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await getNotificationsPermission();

    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return {
        success: false,
        error: "Failed to get push token for push notification!",
      };
    }

    try {
      const projectId = APP_ID;

      if (!projectId) {
        throw new Error("Project ID not found");
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
    } catch (e) {
      token = `${e}`;
    }
  } else {
    return {
      success: false,
      error: "Must use physical device for Push Notifications",
    };
  }

  return {
    success: true,
    token,
  };
}

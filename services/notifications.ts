import { collection, addDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function registerForPushNotifications() {
  let token;

  if (!Device.isDevice) {
    console.log('Running on web or emulator');
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  token = await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
    experienceId: '@1trpro/test-1'
  });

  if (token) {
    await saveToken(token.data);
  }

  return token;
}

async function saveToken(token: string) {
  try {
    // Check if token already exists
    const tokenQuery = query(
      collection(db, 'deviceTokens'),
      where('token', '==', token)
    );
    const existingTokens = await getDocs(tokenQuery);

    if (existingTokens.empty) {
      // Token doesn't exist, save it
      await addDoc(collection(db, 'deviceTokens'), {
        token,
        createdAt: new Date().toISOString(),
      });
      console.log('Token saved successfully');
    }
  } catch (error) {
    console.error('Error saving token:', error);
  }
}

export function setupNotificationHandler() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

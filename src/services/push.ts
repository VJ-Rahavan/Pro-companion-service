import Expo, { ExpoPushMessage } from 'expo-server-sdk';

// Expo SDK instance — handles batching and error handling for push notifications
const expo = new Expo();

interface PushReminderOptions {
  token: string;
  name: string;
  currentStreak: number;
}

/**
 * Sends a push notification via Expo to a user's mobile device.
 * The token is saved to the users table when the mobile app registers.
 */
export async function sendPushReminder({ token, name, currentStreak }: PushReminderOptions) {
  // Validate the token format before sending — avoids a useless API call
  if (!Expo.isExpoPushToken(token)) {
    console.warn(`[push] Invalid Expo token for ${name}: ${token}`);
    return;
  }

  const message: ExpoPushMessage = {
    to: token,
    sound: 'default',
    title: "Don't break your streak!",
    body: `${currentStreak > 0 ? `${currentStreak}-day streak` : 'Start your streak'} — solve one problem today.`,
    data: { screen: 'problems' }, // deep-link the app to the problems screen
  };

  // Expo recommends chunking large batches; we only send one here
  const [chunk] = expo.chunkPushNotifications([message]);
  const tickets = await expo.sendPushNotificationsAsync(chunk);

  // Log any delivery errors for debugging
  for (const ticket of tickets) {
    if (ticket.status === 'error') {
      console.error('[push] Delivery error:', ticket.message);
    }
  }
}

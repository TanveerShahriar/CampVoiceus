import { initializeMessaging } from "./firebaseConfig";
import { getToken, onMessage } from "firebase/messaging";

export const requestNotificationPermission = async (): Promise<string | null> => {
  const messaging = await initializeMessaging();
  if (!messaging) {
    console.warn("Skipping messaging initialization.");
    return null;
  }

  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications.");
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted.");
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || "",
      });
      if (token) {
        console.log("FCM Token:", token);
        return token;
      } else {
        console.warn("No FCM token retrieved.");
      }
    } else {
      console.warn("Notification permission denied.");
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
  }
  return null;
};

export const listenForNotifications = async () => {
  const messaging = await initializeMessaging();
  if (!messaging) {
    console.warn("Skipping notifications listener setup.");
    return;
  }

  onMessage(messaging, (payload) => {
    console.log("Message received: ", payload);

    const notification = new Notification(payload.notification?.title || "New Notification", {
      body: payload.notification?.body,
      data: payload.data,
    });

    notification.onclick = (event) => {
      event.preventDefault();
      const threadId = payload.data?.threadId;
      if (threadId) {
        window.location.href = `/threadDetails/${threadId}`;
      }
    };
  });
};

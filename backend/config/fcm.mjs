import admin from "firebase-admin";
import serviceAccount from "../google-services.json" assert { type: "json" };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

export const sendNotification = async (token, title, body, threadId) => {
    const message = {
        notification: {
            title: title,
            body: body,
        },
        token: token,
        data: {
            threadId: threadId,
        },
    };

    try {
        const response = await admin.messaging().send(message);
        console.log("Notification sent successfully:", response);
        return response;
    } catch (error) {
        console.error("Error sending notification:", error);
        throw error;
    }
};

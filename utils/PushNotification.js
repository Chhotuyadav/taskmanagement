//import admin from "firebase-admin";
//import serviceAccount from "./btoataxi-1aadb-firebase-adminsdk-63ctq-d2bc0f768d.json" assert { type: 'json' };
const serviceAccount = require("./btoataxi-1aadb-firebase-adminsdk-63ctq-d2bc0f768d.json");
const admin = require("firebase-admin");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const sendNotification = async (userTokens, title, message, payload) => {
    const sendMessage = {
        notification: {
            title: title,
            body: message
        },
        data: {
            "data": `${payload}`,
        },
    };

    try {
        // Using the sendEachForMulticast to send notification to multiple tokens
        const response = await admin.messaging().sendEachForMulticast({
            tokens: userTokens,
            ...sendMessage
        });

        console.log("Messages sent successfully:", response.successCount, "out of", userTokens.length);

        // If there are failures, you can track which tokens failed
        if (response.failureCount > 0) {
            const failedTokens = [];
            response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                    failedTokens.push(userTokens[idx]);
                }
            });
            console.log("List of tokens that caused failures:", failedTokens);
        }
        return true;
    } catch (error) {
        console.error("Error sending messages:", error);
    }
    return false;
};

module.exports = {sendNotification};

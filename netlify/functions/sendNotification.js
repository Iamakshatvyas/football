const { messaging, db } = require("./firebaseAdmin");

exports.handler = async (event) => {
  try {
    console.log("Method:", event.httpMethod);
    console.log("Headers:", event.headers);
    console.log("Raw body:", event.body);

    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Request body is empty",
        }),
      };
    }

    const {
      userId,
      title,
      body: message,
      data = {},
    } = JSON.parse(event.body);

    const userDoc = await db.collection("users").doc(userId).get();

    if (!userDoc.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          error: "User not found",
        }),
      };
    }

    const token = userDoc.data().fcmToken;

    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "User has no FCM token",
        }),
      };
    }

    const response = await messaging.send({
      token,
      notification: {
        title,
        body: message,
      },
      data,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        messageId: response,
      }),
    };
  } catch (err) {
    console.error("SEND ERROR:", err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: err.message,
        stack: err.stack,
      }),
    };
  }
};
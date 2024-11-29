const pushNotificationModel = require("../model/firebase.model.js");
const {sendNotification} = require('../utils/PushNotification.js');

//Add token in database
const push_notification_token_add = async (req, res) => {
  try {
    const { id, android_token, web_token, ios_token } = req.body;

    const result = await pushNotificationModel.addPushToken(req);
    if (result) {
      return res.status(200).send({
        message: "token added successfully",
        status: 200,
        success: true,
      });
    }
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .send({
        message: error.message || "Internal server error",
        data: "",
        status: error.statusCode || "500",
        success: false,
      })
      .end();
  }
};

//Send notification
const push_notification_send = async (req, res) => {

  try {
    const { message, title, user_ids, booking_id } = req.body;


    const result = await pushNotificationModel.getTokens(user_ids);
    if (result) {
      const tokens = result;
      const condition = await sendNotification(tokens, title, message, booking_id);
      console.log(condition);

      // const tokens = user_ids;
      // const condition = await sendNotification(user_ids, "Title", "message");

      if (condition) {
        return res.status(200).send({
          message: "message sent successfully",
          status: 200,
          success: true,
        });
      }
    }
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .send({
        message: error.message || "Internal server error",
        data: "",
        status: error.statusCode || "500",
        success: false,
      })
      .end();
  }
};

module.exports = { push_notification_token_add, push_notification_send };

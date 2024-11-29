const subscriptionModel = require("../model/subscription_booking.model.js");

const get_subscription_plans = async (req, res) => {
  try {
    const result = await subscriptionModel.subscriptionPlansList(req);

    if (!result) {
      return res
        .status(400)
        .send({
          message: "No Plans Found",
          error: ["No plans Found"],
          data: [],
          status: "400",
        })
        .end();
    }

    res.status(200).send({
      message: "Plans Found successfully",
      data: result,
      status: "200",
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting Plans",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

//get_subscription_plans_byid
const get_subscription_plans_byid = async (req, res) => {
  try {
    const id = req.body.planId;
    if (!id) {
      return res
        .status(400)
        .send({
          message: "Invalid Plan ID",
          error: ["Invalid Plan ID"],
          data: [],
          status: "400",
        })
        .end();
    }
    const result = await subscriptionModel.getSubscriptionPlansById(id);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Plan not found",
          error: ["Plan not found"],
          data: [],
          status: "400",
        })
        .end();
    }
    res.status(200).send({
      message: "Plan Found successfully",
      data: result,
      status: "200",
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting Plans",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

//save_payment_details
const save_payment_details = async (req, res) => {
  try {
    const result = await subscriptionModel.savePaymentDetails(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Failed to save payment details",
          error: ["Failed to save payment details"],
          data: [],
          status: "400",
        })
        .end();
    }
    res.status(200).send({
      message: "Payment details saved successfully",
      data: result,
      status: "200",
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in saving payment details",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};
//subscribe

const subscribe = async (req, res) => {
  try {
    const result = await subscriptionModel.Subscribe(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Failed to subscribe",
          error: ["Failed to subscribe"],
          data: [],
          status: "400",
        })
        .end();
    }
    res.status(200).send({
      message: "Subscription successful",
      data: result,
      status: "200",
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in subscribing",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

module.exports = {
  get_subscription_plans,
  get_subscription_plans_byid,
  save_payment_details,
  subscribe,
};

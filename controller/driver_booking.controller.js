const driverBookingModel = require("../model/driver_booking.model");
const { validateInput } = require("../utils/vailidator");
const { getTokens } = require("../model/firebase.model.js");
const { sendNotification } = require("../utils/PushNotification.js");
const eventEmitter = require("../utils/Events.js");

// get booking notification list
const booking_notification_list = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;
    const result = await driverBookingModel.bookingNotificationList(
      req,
      offset,
      limit
    );

    if (!result) {
      return res
        .status(400)
        .send({
          message: "No Notification",
          error: ["No Notification"],
          data: [],
          status: "400",
        })
        .end();
    }
    const totalRecords = await driverBookingModel.dbGetTotalCount(req);

    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).send({
      currentPage: page,
      totalPages: totalPages,
      totalRecords: totalRecords,
      message: "Booking notifications get successfully",
      data: result,
      status: "200",
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting booking notifications",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

//booking_notification_count
const booking_notification_count = async (req, res) => {
  try {
    const result = await driverBookingModel.bookingNotificationCount(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No Notification",
          error: ["No Notification"],
          data: [],
          status: "400",
        })
        .end();
    }
    return res
      .status(200)

      .send({
        message: "Bookings count get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (e) {
    res
      .status(500)
      .send({
        message: "Error in getting booking notification count",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

//Accept booking
const accept_booking = async (req, res, io) => {
  try {
    const rules = {
      ride_booking_id: {
        required: true,
        trim: true,
        display: "Ride booking id",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }
    const condition = await driverBookingModel.checkBookingStatus(req);
    // console.log(condition[0].status)
    if (condition[0].status == "cancelled") {
      return res
        .status(400)
        .send({
          message: "This request has cancelled",
          error: ["This request has cancelled"],
          data: [],
          status: "400",
        })
        .end();
    }
    if (condition[0].status != "pending") {
      return res
        .status(400)
        .send({
          message: "Sorry you are late, it's booked by another one",
          error: ["Sorry you are late, it's booked by another one"],
          data: [],
          status: "400",
        })
        .end();
    }

    const result = await driverBookingModel.acceptBooking(req);
    //console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Boking accept failed",
          error: ["Boking accept failed"],
          data: [],
          status: "400",
        })
        .end();
    }

    //re-render admin side by socket
    io.emit("bookingListAdminSocket", { data: "accept_booking" });

    io.emit("bookingListVenderSocket", { data: req.body.creater_id });

    //send notification
    const title = "Booking Accepted";
    const message = `Your booking is accepted!!!`;
    const payload = req.id;
    const user_ids = [req.body.creater_id];

    const driver_tokens = await getTokens(user_ids);
    console.log(driver_tokens);
    if (driver_tokens) {
      const condition = await sendNotification(
        driver_tokens,
        title,
        message,
        payload
      );
    }

    const creater_id = req.body.creater_id;
    const booking_id = req.body.ride_booking_id;
    const booking_status = "accepted";
    const notification_title = "Ride Accepted";
    const notification_description = `Your Ride is accepted!!!`;

    const data = {
      creater_id,
      booking_id,
      booking_status,
      notification_title,
      notification_description,
    };

    await driverBookingModel.addNotification(data);
    io.emit("bookingNotificationAdminSocket", {
      data: "accept_booking",
    });

    io.emit("bookingNotificationAdminSocket", { data: req.body.creater_id });
    //end send notification

    res
      .status(200)
      .send({
        message: "Booking accepted successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in booking accept",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

//Driver all bnookings
const driver_all_bookings = async (req, res) => {
  try {
    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.body.status || "";
    const result = await driverBookingModel.driverAllBookings(
      req,
      offset,
      limit,
      status
    );
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No Bookings",
          error: ["No Bookings"],
          data: [],
          status: "400",
        })
        .end();
    }

    const totalRecords = await driverBookingModel.dbGetDriverTotalCount(
      req,
      "ride_booking",
      status
    );
    const totalPages = Math.ceil(totalRecords / limit);

    res
      .status(200)
      .send({
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
        message: "Booking list get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting booking notifications",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

//View booked user details
const get_booked_user_details = async (req, res) => {
  try {
    const result = await driverBookingModel.getBookedUserDetails(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No Bookings",
          error: ["No Bookings"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "Bookings get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting booking notifications",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

//Driver all bnookings
const booking_status_count = async (req, res) => {
  try {
    const result = await driverBookingModel.bookingStatusCount(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No Bookings",
          error: ["No Bookings"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "Bookings get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting booking notifications",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

//change booking status
const change_booking_status_by_driver = async (req, res, io) => {
  try {
    const booking_status_change = await driverBookingModel.changeBookingStatus(
      req
    );
    if (booking_status_change.length === 0) {
      res
        .status(400)
        .send({
          message: "Error in change booking status",
          error: error || "Internal server error",
          data: [],
          status: "500",
        })
        .end();
    }

    //re-render admin side by socket
    const data = io.emit("bookingListAdminSocket", { data: "accept_booking" });
    console.log("accept_booking", data);

    responce = await driverBookingModel.getcreaterid(req);

    const creater_id = responce;
    const booking_id = req.body.ride_booking_id;
    const booking_status = req.body.status;
    const notification_title = ` Ride ${req.body.status}`;
    const notification_description = `Your Ride is ${req.body.status}!!!`;

    const notificationdata = {
      creater_id,
      booking_id,
      booking_status,
      notification_title,
      notification_description,
    };

    await driverBookingModel.addNotification(notificationdata);
    io.emit("bookingNotificationAdminSocket", {
      data: "accept_booking",
    });
    io.emit("bookingNotificationAdminSocket", { data: req.body.creater_id });

    //end send notification

    res.status(200).send({
      message: "Booking status changed successfully",
      data: [],
      status: "200",
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in changed booking status",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

module.exports = {
  booking_notification_list,
  accept_booking,
  driver_all_bookings,
  get_booked_user_details,
  booking_status_count,
  booking_notification_count,
  change_booking_status_by_driver,
};

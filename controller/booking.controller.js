const { validateInput } = require("../utils/vailidator.js");
const bookingModel = require("../model/booking.model.js");
const { getTokens } = require("../model/firebase.model.js");
const { sendNotification } = require("../utils/PushNotification.js");
// add booking
const add_booking = async (req, res, io) => {
  try {
    const rules = {
      no_of_persons: {
        required: true,
        trim: true,
        display: "No of person",
      },
      booking_time: {
        required: true,
        trim: true,
        type: "time",
        display: "Booking time",
      },
      booking_date: {
        required: true,
        trim: true,
        type: "date",
        display: "Booking date",
      },
      pickup_address: { required: true, trim: true, display: "Pickup address" },
      drop_address: { required: true, trim: true, display: "Drop address" },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }

    const result = await bookingModel.addBooking(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Booking failed",
          error: ["Booking failed"],
          data: [],
          status: "400",
        })
        .end();
    }

     //re-render admin side by socket
     const data = io.emit("bookingListAdminSocket", { data: "accept_booking"});
     console.log("accept_booking",data)

    //Check Capasity
    const capasity = await bookingModel.checkCapacity(req.body.no_of_persons);

    if (capasity.length === 0) {
      return res
        .status(200)
        .send({
          message:
            "Booking added successfully, but no driver available right now!",
          data: [],
          status: "200",
        })
        .end();
    }
    console.log(capasity, "capasity");

    //Send notification to driver
    let user_ids = [];
    capasity.map((id) => {
      return user_ids.push(id.user_id);
    });

    const title = "Booking Request";
    const message = `Pickup : ${req.body.pickup_address}, Drop : ${req.body.drop_address}`;
    const payload = result;

    const driver_tokens = await getTokens(user_ids);

    if (driver_tokens.length > 0) {
      const condition = await sendNotification(
        driver_tokens,
        title,
        message,
        payload
      );
    }
    //end send notification
    const driver_noti_payload = {
      driver_ids: user_ids,
      booking_id: payload,
      notification_title: "Booking Request",
      notification_description: `Pickup : ${req.body.pickup_address}, Drop : ${req.body.drop_address}, Person : ${req.body.no_of_persons}`,
    };
    console.log(driver_noti_payload);
    //Add notification data
    const addNotificationData = await bookingModel.addDriverNotification(
      driver_noti_payload
    );
    if (addNotificationData.length === 0) {
      const values_status = {
        status: "rejected",
        booking_id: payload,
      };
      const booking_status_change = await bookingModel.changeBookingStatus(
        values_status
      );
      return res
        .status(400)
        .send({
          message: "Booking failed",
          error: ["Booking failed"],
          data: [],
          status: "400",
        })
        .end();
    }
    //end to add notification data
    return res
      .status(200)
      .send({
        message: "Booking request successfully",
        data: [],
        status: "200",
      })
      .end();
  } catch (error) {
    return res
      .status(500)
      .send({
        message: "Error in booking vehicle",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//default address check
const get_default_address = async (req, res) => {
  try {
    const result = await bookingModel.getDefaultAddress(req);

    // Check if address not exist
    if (!result || result.length === 0) {
      return res.status(404).send({
        message: "No default address found",
        error: ["No default address found"],
        data: [],
        status: "404",
      });
    }

    res.status(200).send({
      message: "Default address get successfully",
      data: result,
      status: "200",
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting default address",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};
//default address check
const add_default_address = async (req, res) => {
  try {
    const rules = {
      default_address: {
        required: true,
        trim: true,
        display: "Default address",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }

    const result = await bookingModel.addDefaultAddress(req);

    if (!result || result.length === 0) {
      return res.status(400).send({
        message: "Default address not added",
        error: ["Default address not added"],
        data: [],
        status: "400",
      });
    }

    res.status(200).send({
      message: "Default address add successfully",
      data: [],
      status: "200",
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting default address",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//Get my bookings
const get_my_bookings = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.body.status || "";

    const result = await bookingModel.getMyBookings(req, offset, limit, status);

    // Check if bookings exist
    if (!result || result.length === 0) {
      return res.status(404).send({
        message: "No Booking found",
        error: ["No booking found"],
        data: [],
        status: "404",
      });
    }

    const totalRecords = await bookingModel.dbGetTotalCount(
      req,
      "ride_booking",
      status
    );
    const totalPages = Math.ceil(totalRecords / limit);

    res.status(200).send({
      currentPage: page,
      totalPages: totalPages,
      totalRecords: totalRecords,
      message: "Booking list fetched successfully",
      data: result,
      status: "200",
    });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting bookings",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//Get my driver detailsß
const get_my_driver_details = async (req, res) => {
  try {
    const result = await bookingModel.getMyDriverDetails(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No Details found",
          error: ["No Details found"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "Driver details get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting driver details",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//change booking status
const change_booking_status = async (req, res, io) => {
  try {
    const booking_status_change = await bookingModel.changeBookingStatus(req);
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
     const data = io.emit("bookingListAdminSocket", { data: "accept_booking"});
     console.log("accept_booking",data)

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
  add_booking,
  get_my_bookings,
  get_my_driver_details,
  change_booking_status,
  get_default_address,
  add_default_address,
};

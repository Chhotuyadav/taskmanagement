const adminModel = require("../model/admin.model.js");
const { validateInput } = require("../utils/vailidator.js");
const crypto = require("crypto-js");
const { getTokens } = require("../model/firebase.model.js");
const { sendNotification } = require("../utils/PushNotification.js");
//Get all users by group type
const get_user_by_group = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await adminModel.getUsersByGroup(req, offset, limit);

    if (!result) {
      return res
        .status(400)
        .send({
          message: "No user found",
          error: ["No user found"],
          data: [],
          status: "400",
        })
        .end();
    }


    const totalRecords = await adminModel.dbGetTotalCount(req, "users");
    const totalPages = Math.ceil(totalRecords / limit);

    res
      .status(200)
      .send({
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
        message: "User list get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting user list",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//suspend user
const suspend_user = async (req, res) => {
  try {
    const result = await adminModel.suspendUser(req);

    if (!result) {
      return res
        .status(400)
        .send({
          message: "User not suspended",
          error: ["User not suspended"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "Status update successfully",
        data: [],
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in suspending user",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//Get vendor booking by id
const get_vendor_booking_by_id = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const result = await adminModel.getVendorBookingById(req, limit, offset);

    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No Booking found",
          error: ["No booking found"],
          data: [],
          status: "400",
        })
        .end();
    }

    const totalRecords = await adminModel.dbGetVendorTotalCount(
      req,
      "ride_booking"
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
        message: "Error in getting vehicle",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//Driver all bnookings
const get_driver_booking_by_id = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const result = await adminModel.getDriverBookingById(req, offset, limit);

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

    const totalRecords = await adminModel.dbGetDriverTotalCount(
      req,
      "ride_booking"
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
        message: "Error in getting booking list",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};
//Driver vehicle details
const get_driver_vehicle_by_id = async (req, res) => {
  try {
    const result = await adminModel.getDriverVehicleById(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No Vehicle details available",
          error: ["No Vehicle details available"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "Vehicle details get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting booking list",
        error: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

//get_counts of user groups
const get_counts = async (req, res) => {
  try {
    const result = await adminModel.getCounts(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No count available",
          error: ["No count available"],
          data: [],
          status: "400",
        })
        .end();
    }
    res
      .status(200)
      .send({
        message: "User list get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting count",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//Add vendor by admin
const add_user_by_admin = async (req, res) => {
  try {
    console.log("in admin");
    const rules = {
      first_name: {
        required: true,
        trim: true,
        minLength: 3,
        display: "First name",
      },
      last_name: {
        required: true,
        trim: true,
        minLength: 3,
        display: "Last name",
      },
      email: { required: true, trim: true, isEmail: true, display: "Email" },
      password: {
        required: true,
        trim: true,
        minLength: 6,
        display: "Password",
      },
      mobile_no: {
        required: true,
        trim: true,
        isMobilePhone: true,
        display: "Mobile no",
      },
      //alternate_no: { trim: true, isMobilePhone: true },
      address: { required: true, trim: true, display: "Address" },
      city: { required: true, trim: true, display: "City" },
      state: { required: true, trim: true, display: "State" },
      postcode: { required: true, trim: true, display: "Post code" },
      //country: { required: true, trim: true },
      user_group: { required: true, trim: true, display: "User group" },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }
    console.log("innnnn");
    //const hashPassword = crypto.MD5(password).toString();
    //onsole.log(hashPassword)
    //req.body.password = hashPassword;

    const emailExist = await adminModel.checkEmail(req);

    const mobileExist = await adminModel.checkMobile(req);

    // const validGroups = ["admin", "vendor", "driver", "customer"];
    // if (!validGroups.includes(user_group)) {
    //   return res.status(400).json({ error: "Invalid user group" });
    // }
    // console.log(emailExist)
    //console.log(mobileExist)
    if (emailExist.length > 0) {
      return res
        .status(400)
        .send({
          message: "Email already exits please use another Email",
          error: ["Email already exits please use another Email"],
          data: [],
          status: "400",
        })
        .end();
    }
    if (mobileExist.length > 0) {
      return res
        .status(400)
        .send({
          message: "Mobile already exits please use another mobile No",
          error: ["Mobile already exits please use another mobile No"],
          data: [],
          status: "400",
        })
        .end();
    }
    const result = await adminModel.addUserByAdmin(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Error in adding user",
          error: ["Error in adding user"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "User added successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in adding user",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//update vendor by admin
const update_user_by_admin = async (req, res) => {
  try {
    console.log("in admin");
    const rules = {
      first_name: {
        required: true,
        trim: true,
        minLength: 2,
        display: "First name",
      },
      last_name: {
        required: true,
        trim: true,
        minLength: 2,
        display: "Last name",
      },
      email: { required: true, trim: true, isEmail: true, display: "Email" },
      //password: { required: true, trim: true, minLength: 6, display:"Password"},
      mobile_no: {
        required: true,
        trim: true,
        isMobilePhone: true,
        display: "Mobile no",
      },
      //alternate_no: { trim: true, isMobilePhone: true },
      // address: { required: true, trim: true ,display:"Address"},
      //city: { required: true, trim: true ,display:"City"},
      // state: { required: true, trim: true ,display:"State"},
      // postcode: { required: true, trim: true ,display:"Post code"},
      // country: { required: true, trim: true ,display:"Country"},
      id: { required: true, trim: true, display: "id" },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }
    console.log("innnnn");

    const dataExist = await adminModel.checkEmailAndMobileForOther(req);

    if (dataExist.email == false) {
      return res
        .status(400)
        .send({
          message: "Email already exits please use another Email",
          error: ["Email already exits please use another Email"],
          data: [],
          status: "400",
        })
        .end();
    }

    if (dataExist.mobile_no == false) {
      return res
        .status(400)
        .send({
          message: "Mobile no already exits please use another mobile No",
          error: ["Mobile no already exits please use another Mobile no"],
          data: [],
          status: "400",
        })
        .end();
    }
    const result = await adminModel.updateUserByAdmin(req);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Error in adding user",
          error: ["Error in adding user"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "User updated successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in updating user",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//get all booking list
const get_all_booking_by_admin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.body.status;
    const offset = (page - 1) * limit;

    const result = await adminModel.getAllBookingByAdmin(
      req,
      offset,
      limit,
      status
    );

    if (!result) {
      return res
        .status(400)
        .send({
          message: "No booking found",
          error: ["No booking found"],
          data: [],
          status: "400",
        })
        .end();
    }

    const totalRecords = await adminModel.allBookingCount(
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
        message: "Error in getting booking list",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

// add booking
const add_booking_by_admin = async (req, res) => {
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

    const result = await adminModel.addBooking(req);
    console.log(result);
    if (!result) {
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

    //Check Capasity
    const capasity = await adminModel.checkCapacity(req.body.no_of_persons);

    if (!capasity) {
      res
        .status(200)
        .send({
          message:
            "Booking added successfully, but no driver available right now!",
          data: [],
          status: "200",
        })
        .end();
    }

    //Send notification to driver
    let user_ids = [];
    capasity.map((id) => {
      return user_ids.push(id.user_id);
    });

    const title = "Booking Request";
    const message = `Pickup : ${req.body.pickup_address}, Drop : ${req.body.drop_address}`;
    const payload = result;

    const driver_tokens = await getTokens(user_ids);

    if (driver_tokens) {
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
    const addNotificationData = await adminModel.addDriverNotification(
      driver_noti_payload
    );
    if (!addNotificationData) {
      const values_status = {
        status: "rejected",
        booking_id: payload,
      };
      const booking_status_change = await adminModel.changeBookingStatus(
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
    res
      .status(200)
      .send({
        message: "Booking request successfully",
        data: [],
        status: "200",
      })
      .end();
  } catch (error) {
    res
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

//get_all_notificatoin

const get_all_notificatoin = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 4;
    const offset = (page - 1) * limit;
    const result = await adminModel.getAllNotification(req, offset, limit);
    console.log(result);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "No notification found",
          error: ["No notification found"],
          data: [],
          status: "400",
        })
        .end();
    }

    const totalRecords = await adminModel.allNotificationCount(
      req.body.role,
      req.body.user_id
    );
    const totalPages = Math.ceil(totalRecords / limit);

    return res
      .status(200)
      .send({
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
        message: "Notification list get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Error in getting notification",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};
//update_notification_status

const update_notification_status = async (req, res) => {
  try {
    const result = await adminModel.updateNotification(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "User not suspended",
          error: ["User not suspended"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: "Status update successfully",
        data: [],
        status: "200",
      })
      .end();
  } catch (e) {
    res
      .status(500)
      .send({
        message: "Status Not Update",
        data: [],
        status: "500",
      })
      .end();
  }
};

module.exports = {
  get_user_by_group,
  suspend_user,
  get_counts,
  get_vendor_booking_by_id,
  get_driver_booking_by_id,
  get_driver_vehicle_by_id,
  add_user_by_admin,
  update_user_by_admin,
  get_all_booking_by_admin,
  add_booking_by_admin,
  get_all_notificatoin,
  update_notification_status,
};

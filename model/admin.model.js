//Get my bookings
const { queryResult } = require("../utils/queryResult.js");
const crypto = require("crypto-js");
const getUsersByGroup = async (data, offset = 0, limit = 10) => {
  try {
    const sql = `SELECT * from users WHERE user_group = ? LIMIT ? OFFSET ?`;
    const values = [data.body.user_group, limit, offset];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in user");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const dbGetTotalCount = async (data, table) => {
  try {
    const sql = `SELECT COUNT(*) as total FROM ${table} WHERE user_group = ?`;
    const values = [data.body.user_group];
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in booking");
    }
    return result[0].total;
  } catch (error) {
    throw error;
  }
};

//Suspend user
const suspendUser = async (data) => {
  try {
    const sql = `UPDATE users SET status = ? WHERE id = ?`;
    const values = [data.body.status, data.body.user_id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in user");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//getCounts
const getCounts = async () => {
  try {
    const sql = `
      SELECT user_group, COUNT(*) AS count 
      FROM users 
      WHERE user_group IN ('vendor', 'customer', 'driver') 
      GROUP BY user_group;
    `;

    const result = await queryResult(sql);

    if (!result || result.length === 0) {
      throw new Error("No user groups found");
    }

    return result.reduce((acc, row) => {
      acc[row.user_group] = row.count;
      return acc;
    }, {});
  } catch (error) {
    // Handle errors
    console.error("Error fetching user counts:", error);
    throw error; // Rethrow the error for handling elsewhere
  }
};

//Get vendor details
const getVendorBookingById = async (data, offset = 0, limit = 10) => {
  try {
    const sql = `SELECT ride_booking_id, no_of_persons, DATE_FORMAT(booking_time, "${process.env.TIME_FORMAT}") AS booking_time, DATE_FORMAT(rb.booking_date, "${process.env.DATE_FORMAT}") AS booking_date, status, driver_id, pickup_address, drop_address, luggage  FROM ride_booking WHERE creater_id = ? ORDER BY (rb.status = 'pending') DESC,(rb.status = 'accepted') DESC, (rb.status = 'completed') DESC, rb.booking_date DESC, rb.booking_time DESC LIMIT ? OFFSET ?`;
    const values = [data.body.id, offset, limit];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//dbGetVendorTotalCount

const dbGetVendorTotalCount = async (data, table) => {
  try {
    const sql = `SELECT COUNT(*) as total FROM ${table} WHERE creater_id = ? `;
    const values = [data.body.id];

    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in booking");
    }
    return result[0].total;
  } catch (error) {
    throw error;
  }
};

//Get driver details
const getDriverBookingById = async (data, offset = 0, limit = 10) => {
  try {
    const sql = `SELECT  ride_booking_id, no_of_persons, DATE_FORMAT(booking_time, "${process.env.TIME_FORMAT}") AS booking_time, DATE_FORMAT(booking_date, "${process.env.DATE_FORMAT}") AS booking_date, status, driver_id,creater_id, pickup_address, drop_address, luggage FROM ride_booking WHERE driver_id = ? ORDER BY (status = 'pending') DESC,(status = 'accepted') DESC, (status = 'completed') DESC, booking_date DESC, booking_time DESC LIMIT ? OFFSET ?`;
    const values = [data.body.id, limit, offset];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const dbGetDriverTotalCount = async (data, table) => {
  try {
    console.log(data.body.id, "dddasjkfhsdjfhjksdhfjksdhfjksdhd");
    const sql = `SELECT  COUNT(*) as total FROM ${table} WHERE driver_id = ? `;
    const values = [data.body.id];

    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in booking");
    }
    return result[0].total;
  } catch (error) {
    throw error;
  }
};

//Get driver vehicle details
const getDriverVehicleById = async (data) => {
  try {
    const sql = `SELECT * FROM vehicle WHERE user_id = ?`;
    const values = [data.body.id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

//check email exits or not
const checkEmail = async (data) => {
  try {
    console.log("check Email :", data.body.email);
    const sql = "SELECT * FROM users WHERE email = ?";
    const value = [data.body.email];
    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result");
    }
    console.log("resul check email :", result);
    return result;
  } catch (error) {
    throw error;
  }
};

// checkMobile exits
const checkMobile = async (data) => {
  try {
    console.log("check Email :", data.body.mobile_no);
    const sql = "SELECT * FROM users WHERE mobile_no = ?";
    const value = [data.body.mobile_no];
    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result");
    }
    console.log("result check mobile :", result);
    return result;
  } catch (error) {
    throw error;
  }
};

//addUserByAdmin
const addUserByAdmin = async (user) => {
  console.log("in add user");
  try {
    const hashNewPassword = crypto.MD5(user.body.password).toString();
    console.log("new hash password :", hashNewPassword);

    const sql =
      "INSERT INTO users (first_name, last_name, email, password, mobile_no, address, city, state, postcode, user_group) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
    const values = [
      user.body.first_name,
      user.body.last_name,
      user.body.email,
      hashNewPassword,
      user.body.mobile_no,
      user.body.address,
      user.body.city,
      user.body.state,
      user.body.postcode,
      user.body.user_group,
    ];
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in adding user");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//checkEmailAndMobileForOther
const checkEmailAndMobileForOther = async (data) => {
  try {
    const result_data = { email: true, mobile_no: true };
    const sql =
      "SELECT * FROM users WHERE (email = ? OR mobile_no = ?) AND id != ?";
    const value = [data.body.email, data.body.mobile_no, data.body.id];
    const result = await queryResult(sql, value);
    if (result == "") {
      result_data.email = true;
      result_data.mobile_no = true;
      return result_data;
    } else {
      //console.log(result);
      //console.log(result[0].email);
      //return false;
      if (result[0].email == data.body.email) {
        result_data.email = false;
        return result_data;
      } else {
        result_data.mobile_no = false;
        return result_data;
      }
    }
  } catch (error) {
    throw error;
  }
};

//updateUserByAdmin
const updateUserByAdmin = async (data) => {
  try {
    const {
      first_name,
      last_name,
      email,
      mobile_no,
      alternate_no,
      address,
      id,
    } = data.body;
    const sql =
      "UPDATE users SET first_name = ?, last_name=? ,email=? , mobile_no=?,alternate_no = ?, address=? WHERE id = ?";
    const value = [
      first_name,
      last_name,
      email,
      mobile_no,
      alternate_no,
      address,
      id,
    ];

    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result");
    }

    console.log("user profile update successfully");

    return result;
  } catch (error) {
    throw error;
  }
};

//get all booking list by admin
const getAllBookingByAdmin = async (
  data,
  offset = 0,
  limit = 10,
  status = ""
) => {
  try {
    var sql = "";
    if (status == "") {
      sql = `SELECT rb.ride_booking_id, rb.no_of_persons, DATE_FORMAT(rb.booking_time, "${process.env.TIME_FORMAT}") AS booking_time, DATE_FORMAT(rb.booking_date, "${process.env.DATE_FORMAT}") as booking_date , rb.status, rb.pickup_address, rb.drop_address, rb.driver_id, rb.creater_id, vendor.first_name as vendor_fname, vendor.last_name as vendor_lname from ride_booking as rb JOIN users as vendor ON vendor.id = rb.creater_id ORDER BY (rb.status = 'pending') DESC,(rb.status = 'accepted') DESC, (rb.status = 'completed') DESC, rb.booking_date DESC, rb.booking_time DESC LIMIT ? OFFSET ? `;
    } else {
      sql = `SELECT rb.ride_booking_id, rb.no_of_persons, DATE_FORMAT(rb.booking_time, "${process.env.TIME_FORMAT}") AS booking_time, DATE_FORMAT(rb.booking_date, "${process.env.DATE_FORMAT}") as booking_date , rb.status, rb.pickup_address, rb.drop_address, rb.driver_id, rb.creater_id, vendor.first_name as vendor_fname, vendor.last_name as vendor_lname from ride_booking as rb JOIN users as vendor ON vendor.id = rb.creater_id WHERE rb.status = '${status}' ORDER BY rb.created_at DESC, rb.booking_date DESC,  rb.booking_time DESC LIMIT ? OFFSET ? `;
    }
    const values = [limit, offset];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in bookinglist");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const allBookingCount = async (table, status = "") => {
  try {
    var sql = "";
    if (status == "") {
      sql = `SELECT COUNT(*) as total FROM ${table}`;
    } else {
      sql = `SELECT COUNT(*) as total FROM ${table} WHERE status = '${status}'`;
    }
    const result = await queryResult(sql);
    if (!result) {
      throw new Error("error in booking");
    }
    return result[0].total;
  } catch (error) {
    throw error;
  }
};

//Add vehicle
const addBooking = async (data) => {
  try {
    const sql =
      "INSERT INTO ride_booking (no_of_persons, booking_time, booking_date, pickup_address, drop_address,creater_id, luggage) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const values = [
      data.body.no_of_persons,
      data.body.booking_time,
      data.body.booking_date,
      data.body.pickup_address,
      data.body.drop_address,
      data.id,
      data.body.luggage,
    ];
    const result = await queryResult(sql, values);
    console.log(result);
    if (!result) {
      throw new Error("error in booking");
    }
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

//check driver seating capacity
const checkCapacity = async (pearson) => {
  //console.log("capa, ", pearson)
  try {
    const sql =
      "SELECT  user_id FROM vehicle WHERE seating_capacity = ? OR seating_capacity > ?";
    const values = [pearson, pearson];
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in booking");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

//add driver notification
const addDriverNotification = async (data) => {
  try {
    const driver_ids = data.driver_ids;
    let values = [];

    const tmp = driver_ids.map((ids) => {
      return values.push([
        data.booking_id,
        ids,
        data.notification_title,
        data.notification_description,
      ]);
    });

    const placeholders = values.map(() => "(?, ?, ?, ?)").join(", ");
    const sql = `INSERT INTO driver_notification (booking_id, driver_id, notification_title, notification_description) VALUES ${placeholders}`;
    const flattenedValues = values.flat(Infinity);
    const result = await queryResult(sql, flattenedValues);

    if (!result) {
      throw new Error("error in booking");
    }
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

const changeBookingStatus = async (data) => {
  try {
    const sql = `UPDATE ride_booking SET status = ? WHERE ride_booking_id = ?`;
    const values = [data.body.status, data.body.ride_booking_id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

//getAllNotification

const getAllNotification = async (data, offset = 0, limit = 4) => {
  const { user_id, role } = data.body;

  try {
    let sql = `
      SELECT *, 
        CASE
          WHEN TIMESTAMPDIFF(MINUTE, create_at, NOW()) < 60 THEN 
            CONCAT(TIMESTAMPDIFF(MINUTE, create_at, NOW()), ' min ago')
          WHEN TIMESTAMPDIFF(HOUR, create_at, NOW()) < 24 THEN 
            CONCAT(TIMESTAMPDIFF(HOUR, create_at, NOW()), ' hours ago')
          ELSE 
            CONCAT(TIMESTAMPDIFF(DAY, create_at, NOW()), ' days ago')
        END AS formatted_time 
      FROM admin_vendor_notification 
    `;

    // Add WHERE clause for vendors
    if (role === "admin") {
      sql += `WHERE admin_status = 'active' `;
    } else {
      sql += `WHERE creater_id = ? AND vendor_status = 'active' `;
    }

    // Append ordering and pagination
    sql += `
      ORDER BY create_at DESC 
      LIMIT ? OFFSET ?
    `;

    const values =
      role === "admin" ? [limit, offset] : [user_id, limit, offset];

    const result = await queryResult(sql, values);

    if (!result || result.length === 0) {
      return [];
    }

    return result;
  } catch (error) {
    console.error("Error in getAllNotification:", error);
    throw error;
  }
};

//allNotificationCount

const allNotificationCount = async (role, user_id) => {
  try {
    const sql =
      role === "admin"
        ? `SELECT COUNT(*) AS total FROM admin_vendor_notification WHERE admin_status = 'active'`
        : `SELECT COUNT(*) AS total FROM admin_vendor_notification WHERE creater_id = ? AND vendor_status = 'active'`;

    const values = role === "admin" ? [] : [user_id];

    const result = await queryResult(sql, values);

    if (!result || result.length === 0) {
      return 0;
    }

    return result[0].total;
  } catch (error) {
    console.error("Error in allNotificationCount:", error);
    throw error;
  }
};

//updateNotification status

const updateNotification = async (data) => {
  try {
    const sql =
      data.body.role === "admin"
        ? `UPDATE admin_vendor_notification SET admin_status = 'inactive' WHERE booking_id = ?`
        : `UPDATE admin_vendor_notification SET vendor_status = 'inactive' WHERE booking_id = ?`;

    const values = [data.body.booking_id];
    const result = await queryResult(sql, values);
    console.log("inactive", result);
    if (!result) {
      throw new Error("error in user");
    }
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = {
  getUsersByGroup,
  suspendUser,
  getCounts,
  getVendorBookingById,
  getDriverBookingById,
  getDriverVehicleById,
  dbGetTotalCount,
  dbGetDriverTotalCount,
  dbGetVendorTotalCount,
  checkMobile,
  checkEmail,
  addUserByAdmin,
  checkEmailAndMobileForOther,
  updateUserByAdmin,
  getAllBookingByAdmin,
  allBookingCount,
  addBooking,
  checkCapacity,
  addDriverNotification,
  changeBookingStatus,
  getAllNotification,
  allNotificationCount,
  updateNotification,
};

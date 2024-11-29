const { queryResult } = require("../utils/queryResult.js");

//Get my bookings
const bookingNotificationList = async (data, offset = 0, limit = 10) => {
  try {
    const sql = `SELECT  rb.ride_booking_id, rb.no_of_persons, DATE_FORMAT(rb.booking_date, "${process.env.DATE_FORMAT}") as booking_date, DATE_FORMAT(rb.booking_time, "${process.env.TIME_FORMAT}") AS booking_time, rb.creater_id, rb.pickup_address, rb.drop_address, rb.status, rb.luggage FROM ride_booking AS rb
    JOIN vehicle ON vehicle.user_id = ? AND (vehicle.seating_capacity >= rb.no_of_persons) WHERE rb.status = 'pending' ORDER BY rb.booking_date DESC, rb.booking_time DESC LIMIT ? 
    OFFSET ?`;
    const values = [data.id, limit, offset];
    const result = await queryResult(sql, values);
    console.log(result);
    if (!result) {
      throw new Error("error in booking");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// dbGetTotalCount
const dbGetTotalCount = async (data, res) => {
  try {
    const sql = `SELECT  COUNT(rb.ride_booking_id) as total   FROM ride_booking AS rb
    JOIN vehicle ON vehicle.user_id =? AND (vehicle.seating_capacity >= rb.no_of_persons) WHERE rb.status = 'pending'`;
    const values = [data.id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }
    return result[0].total;
  } catch (error) {
    throw error;
  }
};

//bookingNotificationCount

const bookingNotificationCount = async (data) => {
  try {
    // const sql = `SELECT COUNT(*) as total from ride_booking WHERE driver_id =? AND status = 'pending'`;
    const sql = `SELECT  COUNT(rb.ride_booking_id) as total   FROM ride_booking AS rb
    JOIN vehicle ON vehicle.user_id = ? AND (vehicle.seating_capacity >= rb.no_of_persons) WHERE rb.status = 'pending'`;
    const values = [data.id];
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in booking");
    }
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

//check booking status
const checkBookingStatus = async (data) => {
  console.log("booking statuas");
  try {
    const sql = `SELECT status from ride_booking WHERE ride_booking_id = ?`;
    const values = [data.body.ride_booking_id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

//Accept booking
const acceptBooking = async (data) => {
  try {
    const sql = `UPDATE ride_booking SET status = 'accepted', driver_id = ? WHERE ride_booking_id = ?`;
    const values = [data.id, data.body.ride_booking_id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }
    console.log(result);
    return result;
  } catch (error) {
    throw error;
  }
};

//Driver all bookings
const driverAllBookings = async (data, offset = 0, limit = 10, status = "") => {
  try {
    var sql = "";
    if (status == "") {
      sql = `SELECT  rb.ride_booking_id, rb.no_of_persons, DATE_FORMAT(rb.booking_date, "${process.env.DATE_FORMAT}") AS booking_date, DATE_FORMAT(rb.booking_time, "${process.env.TIME_FORMAT}") as booking_time , rb.status, rb.pickup_address, rb.drop_address, rb.driver_id, rb.creater_id, rb.luggage FROM ride_booking AS rb WHERE rb.driver_id = ? ORDER BY (rb.status = 'pending') DESC,(rb.status = 'accepted') DESC, (rb.status = 'completed') DESC, rb.booking_date DESC, rb.booking_time DESC LIMIT ? OFFSET ?`;
    } else {
      sql = `SELECT  rb.ride_booking_id, rb.no_of_persons, DATE_FORMAT(rb.booking_date, "${process.env.DATE_FORMAT}") AS booking_date, DATE_FORMAT(rb.booking_time, "${process.env.TIME_FORMAT}") as booking_time , rb.status, rb.pickup_address, rb.drop_address, rb.driver_id, rb.creater_id, rb.luggage FROM ride_booking AS rb WHERE rb.driver_id = ? AND rb.status = '${status}' ORDER BY (rb.status = 'pending') DESC,(rb.status = 'accepted') DESC, (rb.status = 'completed') DESC, rb.booking_date DESC, rb.booking_time DESC LIMIT ? OFFSET ?`;
    }

    const values = [data.id, limit, offset];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const dbGetDriverTotalCount = async (data, table, status = "") => {
  try {
    var sql = "";
    if (status == "") {
      sql = `SELECT  COUNT(*) as total FROM ${table} AS rb WHERE rb.driver_id = ? `;
    } else {
      sql = `SELECT  COUNT(*) as total FROM ${table} AS rb WHERE rb.driver_id = ? AND rb.status = '${status}' `;
    }

    const values = [data.id];

    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in booking");
    }
    return result[0].total;
  } catch (error) {
    throw error;
  }
};

//Driver all bookings
const getBookedUserDetails = async (data) => {
  try {
    const sql = `SELECT rb.no_of_persons, rb.ride_booking_id,
    DATE_FORMAT(rb.booking_date, "${process.env.DATE_FORMAT}") as booking_date, DATE_FORMAT(rb.booking_time, "${process.env.TIME_FORMAT}") AS booking_time, rb.creater_id, rb.pickup_address, rb.drop_address, rb.status, rb.luggage, users.first_name, users.last_name, users.mobile_no, users.email FROM ride_booking AS rb
    JOIN users ON users.id = rb.creater_id WHERE rb.ride_booking_id = ?`;
    const values = [data.body.ride_booking_id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

//bookingStatusCount
const bookingStatusCount = async (data) => {
  try {
    const sql = `SELECT COUNT(ride_booking_id) AS upcomming FROM ride_booking WHERE status = 'accepted' AND driver_id =?`;
    const values = [data.id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }

    //completed
    const sql1 = `SELECT COUNT(ride_booking_id) AS completed FROM ride_booking WHERE status = 'completed' AND driver_id =?`;
    const values1 = [data.id];
    const result1 = await queryResult(sql1, values1);

    //All bookings
    const sql2 = `SELECT COUNT(ride_booking_id) AS total_bookings FROM ride_booking WHERE driver_id =?`;
    const values2 = [data.id];
    const result2 = await queryResult(sql2, values2);

    if (!result2) {
      throw new Error("error in booking");
    }
    const res = [result[0], result1[0], result2[0]];
    console.log(result);
    return res;
  } catch (error) {
    throw error;
  }
};

//Change booking status
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

//Add notification

const addNotification = async (data) => {
  try {
    const sql = `INSERT INTO admin_vendor_notification(creater_id, booking_id, booking_status, notification_title,notification_description) VALUES(?,?,?,?,?)`;
    const values = [
      data.creater_id,
      data.booking_id,
      data.booking_status,
      data.notification_title,
      data.notification_description,
    ];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }
    return result.insertId;
  } catch (error) {
    throw error;
  }
};

//getcreaterid

const getcreaterid = async (data) => {
  try {
    const sql = `SELECT creater_id FROM ride_booking WHERE ride_booking_id =?`;
    const values = [data.body.ride_booking_id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }
    return result[0].creater_id;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  bookingNotificationList,
  checkBookingStatus,
  acceptBooking,
  driverAllBookings,
  getBookedUserDetails,
  bookingStatusCount,
  bookingNotificationCount,
  dbGetTotalCount,
  dbGetDriverTotalCount,
  changeBookingStatus,
  addNotification,
  getcreaterid,
};

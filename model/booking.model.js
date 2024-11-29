const { queryResult } = require("../utils/queryResult.js");

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

const getMyBookings = async (data, offset = 0, limit = 10, status = "") => {
  try {
    var sql = "";
    if(status == ""){
       sql = `
      SELECT 
        ride_booking_id, 
        no_of_persons, 
        DATE_FORMAT(booking_time, "${process.env.TIME_FORMAT}") AS booking_time,
        DATE_FORMAT(booking_date, "${process.env.DATE_FORMAT}") as booking_date,      
        status, 
        driver_id, 
        pickup_address, 
        drop_address, 
        luggage 
      FROM 
        ride_booking 
      WHERE 
        creater_id = ? 
      ORDER BY (status = 'pending') DESC,(status = 'accepted') DESC, (status = 'completed') DESC, booking_date DESC, booking_time DESC
      LIMIT ? 
      OFFSET ?`;
    }
    else{
       sql = `
      SELECT 
        ride_booking_id, 
        no_of_persons, 
        DATE_FORMAT(booking_time, "${process.env.TIME_FORMAT}") AS booking_time,
        DATE_FORMAT(booking_date, "${process.env.DATE_FORMAT}") as booking_date,      
        status, 
        driver_id, 
        pickup_address, 
        drop_address, 
        luggage 
      FROM 
        ride_booking 
      WHERE 
        creater_id = ? AND status = '${status}'
      ORDER BY (status = 'pending') DESC,(status = 'accepted') DESC, (status = 'completed') DESC, booking_date DESC, booking_time DESC
      LIMIT ? 
      OFFSET ?`;
    }

    const values = [data.id, limit, offset];

    const result = await queryResult(sql, values);

    if (!result || result.length === 0) {
      throw new Error("No bookings found for the user.");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

const dbGetTotalCount = async (data, table, status = "") => {
  try {
    var sql = "";
    if(status == ""){
     sql = `SELECT COUNT(*) as total FROM ${table} WHERE creater_id = ?`;
    }
    else{
     sql = `SELECT COUNT(*) as total FROM ${table} WHERE creater_id = ? AND status = '${status}'`;
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

//Get my bookings
const getMyDriverDetails = async (data) => {
  try {
    const sql = `SELECT rb.ride_booking_id, rb.no_of_persons, DATE_FORMAT(rb.booking_time, "${process.env.TIME_FORMAT}") AS booking_time, DATE_FORMAT(rb.booking_date, "${process.env.DATE_FORMAT}") as booking_date , rb.status, rb.driver_id, rb.pickup_address, rb.drop_address, rb.luggage, vehicle.title, vehicle.brand, vehicle.model, vehicle.year, vehicle.type, vehicle.seating_capacity, users.first_name, users.last_name, users.mobile_no, users.alternate_no FROM ride_booking AS rb JOIN vehicle ON rb.driver_id = vehicle.user_id JOIN users ON rb.driver_id = users.id WHERE rb.ride_booking_id = ?`;
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

//Check default address
const getDefaultAddress = async (data) => {
  try {
    const sql = `SELECT default_address FROM users WHERE id = ?`;
    const values = [data.id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("error in booking");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//add default address
const addDefaultAddress = async (data) => {
  try {
    const sql = "UPDATE users SET default_address = ? WHERE id= ?";
    const values = [data.body.default_address, data.id];
    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in adding default address");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addBooking,
  checkCapacity,
  addDriverNotification,
  changeBookingStatus,
  getMyBookings,
  getMyDriverDetails,
  dbGetTotalCount,
  getDefaultAddress,
  addDefaultAddress,
};

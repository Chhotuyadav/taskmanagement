const { queryResult } = require("../utils/queryResult.js");

//add bussiness profile
const addBussinessProfile = async (data) => {
  // console.log(data.body, "data");
  // return;
  try {
    var sql = "";
    var values = [];
    if (data.body.bussiness_id) {
      sql =
        "UPDATE bussiness_profile SET bussiness_name = ?,bussiness_type = ?,bussiness_email=?,bussiness_phone = ?,bussiness_address= ?,bussiness_hours= ?,image=?  WHERE bussiness_id= ?";
      values = [
        data.body.bussiness_name,
        data.body.bussiness_type,
        data.body.bussiness_email,
        data.body.bussiness_phone,
        data.body.bussiness_address,
        data.body.bussiness_hours,
        data.body.image,
        data.body.bussiness_id,
      ];
    } else {
      sql =
        "INSERT INTO bussiness_profile (bussiness_name, bussiness_type, bussiness_email,bussiness_phone, bussiness_address ,bussiness_hours= ?, image=?, user_id) VALUES (?,?,?,?,?,?)";
      values = [
        data.body.bussiness_name,
        data.body.bussiness_type,
        data.body.bussiness_email,
        data.body.bussiness_phone,
        data.body.bussiness_address,
        data.body.bussiness_hours,
        data.body.image,
        data.id,
      ];
    }

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in adding bussiness profile");
    }
    return result;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

//get bussiness profile
const getBussinessProfile = async (data) => {
  try {
    const sql = "SELECT * FROM bussiness_profile WHERE user_id = ?";
    const values = [data.id];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting bussiness profile");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//add bussiness profile
const getBussinessProfileById = async (data) => {
  try {
    const sql = "SELECT * FROM bussiness_profile WHERE user_id = ?";
    const values = [data.body.user_id];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting bussiness profile");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
module.exports = {
  addBussinessProfile,
  getBussinessProfile,
  getBussinessProfileById,
};

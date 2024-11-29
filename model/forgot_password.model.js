
const { queryResult } = require("../utils/queryResult.js");
const crypto = require("crypto-js");

const checkEmailExist = async (data) => {
  try {
    const sql =
      "SELECT id, email FROM users WHERE email = ?";
    const values = [
     data.body.email,
    ];
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in user result");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//addOTP
const addOTP = async (random_number, id) => {
  try {

    const sql = `
    INSERT INTO otp (user_id, otp, type, otp_expire) 
    VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE))`;

    const values = [
      id, random_number, "forgot",
    ];
      
    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("error in user result");
    }
    console.log(result)
    return result;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

//Verify token
const verifyOTP = async (data) => {
  try {
    
    const sql = `
    SELECT user_id, otp FROM otp WHERE otp = ? AND otp_expire >= NOW() AND status = 0`;

    const values = [
      data.body.otp
    ];
      
    const result = await queryResult(sql, values);
    console.log("sfthhukijmdfgb",result);
    if (!result) {
      console.log("error");
      throw new Error("error in user result");
    }
    return result;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

//Change password
const changePassword = async (data) => {
  try {
    const hashNewPassword = crypto.MD5(data.body.new_password).toString();
    //const hashPassword = crypto.MD5(password).toString();
    console.log("new hash password :", hashNewPassword);
    const sql = `
    UPDATE users SET password = ? WHERE id = ?`;

    const values = [
      hashNewPassword, data.body.user_id
    ];
      
    const result = await queryResult(sql, values);
    console.log("sfthhukijmdfgb",result);
    if (!result) {
      console.log("error");
      throw new Error("error in user result");
    }
    return result;
  } catch (error) {
    console.log(error)
    throw error;
  }
};
module.exports = {
    checkEmailExist,
    addOTP,
    verifyOTP,
    changePassword,
};

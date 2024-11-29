const { queryResult } = require("../utils/queryResult.js");
const crypto = require("crypto-js");

const insertUserAndGetId = async (user) => {
  try {
    const sql =
      "INSERT INTO users (name, username, email, password, role) VALUES (?, ?, ?, ?, ?)";
    values = [
      user.name,
      user.username,
      user.email,
      user.password,
      user.role
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

//valid login user
const validUser = async (data) => {
  try {
    let sql = "SELECT * FROM users WHERE username = ? OR email = ?";
    let value = [data.body.username, data.body.username];
    const result = await queryResult(sql, value);
    return result;
  } catch (error) {
    throw error;
  }
};

//check password exits or not
const checkPassword = async (data) => {
  try {
    console.log("checkPassword", data);
    const hashPassword = crypto.MD5(data.body.password).toString();
    const sql = "SELECT * FROM users WHERE password = ? AND id= ?";
    const value = [hashPassword, data.id];
    const result = await queryResult(sql, value);
    console.log(result);
    if (result == "") {
      return false;
    }

    if (!result) {
      throw new Error("Error in result");
      return false;
    }
    return true;
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

// all users
const allUsers = async (data) => {
  console.log(data.id);
  try {
    const sql = "SELECT * FROM users WHERE role = ?";
    const result = await queryResult(sql, ["user"]);

    if (!result) {
      throw new Error("Error in result: not found user profile");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
//checkUserName
const checkUserName = async (data) => {
  try {
    const sql = "SELECT * FROM users WHERE username = ?";
    const value = [data.body.username];
    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result");
    }
    console.log("resul check username :", result);
    return result;
  } catch (error) {
    throw error;
  }
};


//get user profile
const getProfile = async (data) => {
  console.log(data.id);
  try {
    const sql = "SELECT * FROM users WHERE id=? ";
    const value = [data.id];
    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result: not found user profile");
    }
    return result;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  insertUserAndGetId,
  checkPassword,
  checkEmail,
  getProfile,
  validUser,
  checkUserName,
  allUsers
};

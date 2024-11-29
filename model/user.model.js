const { queryResult } = require("../utils/queryResult.js");
const crypto = require("crypto-js");

const insertUserAndGetId = async (user) => {
  try {
    const sql =
        "INSERT INTO users (first_name, last_name, email, password, mobile_no, alternate_no, address, city, state, postcode, country,  status) VALUES (?, ?, ?, ?, ?,  ?, ?, ?, ?, ?, ?,?)";
      values = [
        user.first_name,
        user.last_name,
        user.email,
        user.password,
        user.mobile_no,
        user.alternate_no,
        user.address,
        user.city,
        user.state,
        user.postcode,
        user.country,
        user.status,
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
    let sql = "SELECT * FROM users WHERE email = ? OR mobile_no = ?";
    let value = [data.body.email, data.body.email];
    const result = await queryResult(sql, value);
    const return_data = { status: true, result: [], error: "" };
    if (result.length === 0) {
      return_data.status = false;
      return_data.error = "User not found";
      return return_data;
    }
    if (result[0].status == "suspended") {
      return_data.status = false;
      return_data.error = "You are suspended right now, Please contact admin!";
      return return_data;
    }

    if (result[0].status == "inactive") {
      return_data.status = false;
      return_data.error = "Please verify your email to login!";
      return return_data;
    }

    if (result[0].ip) {
      result[0].ip = true;
    } else {
      result[0].ip = false;
      sql = "UPDATE users SET ip = ? WHERE  email = ? OR mobile_no = ?";
      value = [data.ip, data.body.email, data.body.email];
      const add_ip = await queryResult(sql, value);
      if (!add_ip) {
        console.log("error in adding ip");
      }
    }
    return_data.result = result;
    return result;
  } catch (error) {
    throw error;
  }
};

// update user details
const updatedPassword = async (data) => {
  try {
    const hashNewPassword = crypto.MD5(data.body.newPassword).toString();
    console.log("new hash password :", hashNewPassword);

    const sql1 = "UPDATE users SET password = ? WHERE id = ?";
    const value1 = [hashNewPassword, data.id];

    const result = await queryResult(sql1, value1);

    if (!result) {
      throw new Error("Error in result");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Delete user in by user id
const deletedUser = async (data) => {
  try {
    const userId = data.body.user_id;
    console.log("user id :", userId);

    //delete the user rocode from database

    const sql = "DELETE FROM users WHERE id = ?";
    const value = [userId];
    const result = await queryResult(sql, value);
    console.log(result);

    if (result.affectedRows === 0) {
      throw new Error("delete result : not found user ");
    }
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
    console.log("resul check mobile :", result);
    return result;
  } catch (error) {
    throw error;
  }
};

const allUsers = async (data) => {
  try {
    const sql =
      "SELECT id, first_name, last_name,email, mobile_no FROM users ORDER BY created_date DESC ";
    const value = "";
    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// count total users
const totalUsers = async (data) => {
  try {
    const sql = "SELECT COUNT(*) AS total FROM users";
    const value = "";
    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//get user profile
const getProfile = async (data) => {
  try {
    const id = data.id;
    const sql =
      "SELECT id, first_name, last_name,email, mobile_no, alternate_no, address, city, postcode, state, image FROM users WHERE id=? ";
    const value = [id];
    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result: not found user profile");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const updateProfile = async (data) => {
  try {
    const {
      first_name,
      last_name,
      email,
      mobile_no,
      alternate_no,
      address,
      city,
      state,
      postcode,
      image,
    } = data.body;
    const sql =
      "UPDATE users SET first_name = ?, last_name=? ,email=? , mobile_no=?,alternate_no = ?, address=?,city=?,state=?,postcode=?,image=? WHERE id = ?";
    const value = [
      first_name,
      last_name,
      email,
      mobile_no,
      alternate_no,
      address,
      city,
      state,
      postcode,
      image,
      data.id,
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

//Update profile image
const updateProfileImage = async (data, image) => {
  try {
    const sql = "UPDATE users SET image=? WHERE id = ?";
    const value = [image, data.id];

    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result");
    }

    return result;
  } catch (error) {
    throw error;
  }
};

//Get user by id
const getUserById = async (data) => {
  try {
    console.log("given Id", data.body.id);
    const sql = "SELECT * FROM users WHERE id= ?";
    const value = [data.body.id];
    const result = await queryResult(sql, value);

    if (!result) {
      throw new Error("Error in result");
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
    const value = [data.body.email, data.body.mobile_no, data.id];
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

//verify t5oken
const verify_email_using_link = async (token) => {
  try {
    const sql1 = "SELECT * FROM users WHERE verification_token = ?";
    const value1 = [token];
    const result1 = await queryResult(sql1, value1);
    console.log(result1);
    if (result1.length === 0) {
      return result1;
    } else {
      const sql =
        "UPDATE users SET verification_token = '', status = 'active' WHERE verification_token = ?";
      const value = [token];
      const result = await queryResult(sql, value);
      console.log(result);
      if (!result) {
        throw new Error("Error in result");
      }
      return result;
    }
  } catch (error) {
    throw error;
  }
};

module.exports = {
  insertUserAndGetId,
  checkPassword,
  allUsers,
  getUserById,
  totalUsers,
  checkEmail,
  getProfile,
  updateProfile,
  validUser,
  deletedUser,
  updatedPassword,
  checkMobile,
  checkEmailAndMobileForOther,
  verify_email_using_link,
  updateProfileImage,
};

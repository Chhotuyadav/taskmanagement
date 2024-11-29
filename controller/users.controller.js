const userModel = require("../model/user.model.js");
const { validateInput } = require("../utils/vailidator.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");

// SIGN-IN USER
const register_user = async (req, res) => {
  try {
    const { name, username, email, password, role } =
      req.body;

    const rules = {
      name: {
        required: true,
        trim: true,
        minLength: 2,
        display: "Name",
      },
      username: {
        required: true,
        trim: true,
        minLength: 2,
        unique: true,
        display: "UserName",
      },
      email: {
        required: true,
        trim: true,
        isEmail: true,
        unique: true,
        display: "Email",
      },
      password: {
        required: true,
        trim: true,
        minLength: 6,
        display: "Password",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }

    req.body.status = "active";
    const hashPassword = crypto.MD5(password).toString();

    req.body.password = hashPassword;

    const usernameExist = await userModel.checkUserName(req);
    const emailExist = await userModel.checkEmail(req);

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

    if (usernameExist.length > 0) {
      return res
        .status(400)
        .send({
          message: "Username already exits please use another Username",
          error: ["Username already exits please use another Username"],
          data: [],
          status: "400",
        })
        .end();
    }


    const result = await userModel.insertUserAndGetId(req.body);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Registration failed",
          error: ["Registration failed"],
          data: [],
          status: "400",
        })
        .end();
    }

    res
      .status(200)
      .send({
        message: `Registered successfully.`,
        data: result.insertId,
        status: "200",
      })
      .end();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: error || "Internal server error",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//LOGIN USER
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username) {
      return res
        .status(400)
        .send({
          message: "Username field Required",
          error: ["Username field Required"],
          data: [],
          status: "400",
        })
        .end();
    }
    if (!password) {
      return res
        .status(400)
        .send({
          message: "Password field Required",
          error: ["Password field Required"],
          data: [],
          status: "400",
        })
        .end();
    }

    const result = await userModel.validUser(req);


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

    const hashPassword = crypto.MD5(password).toString();

    console.log("login query result", result);
    //cheak password validation

    if (hashPassword !== result[0].password) {
      return res
        .status(400)
        .send({
          message: "Password does not match",
          error: ["Password does not match"],
          data: [],
          status: "400",
        })
        .end();
    }

    const userid = result[0].id;
    const name = result[0].name;
    const role = result[0].role;
    const token = jwt.sign(
      {
        userid,
        name,
        role,
      },
      process.env.SECRETKEY,
      {
        expiresIn: "1d",
      }
    );
    console.log("token data  :", token);
    res
      .status(200)
      .send({
        message: "login successfully",
        data: result,
        token: token,
        role: role,
        status: "200",
      })
      .end();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: ` ${error}` || "Internal server error",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

//get all users
const get_all_user = async (req, res) => {
  try {
    const result = await userModel.allUsers(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "result not found",
          data: "",
          status: "400",
        })
        .end();
    }


    return res
      .status(200)
      .send({
        message: "get all user successfully  ",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: `${error}` || " Internal server error ",
        data: "",
        status: "500",
      })
      .end();
  }
};

// get user by id
const getUserById = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      return res
        .status(400)
        .send({
          message: "id field Required",
          data: "",
          status: "400",
        })
        .end();
    }
    const result = await userModel.UserById(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "result not found",
          data: "",
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "get user by id successfully  ",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: `${error}` || " Internal server error ",
        data: "",
        status: "500",
      })
      .end();
  }
};

//get user profile
const get_user_profile = async (req, res) => {
  try {
    const result = await userModel.getProfile(req);
    console.log(result)
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Result not found",
          error: ["Result not found"],
          data: [],
          status: "400",
        })
        .end();
    }
    return res
      .status(200)
      .send({
        message: "Get user profile successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({
        message: `${error}` || " Internal server error ",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};


module.exports = {
  register_user,
  loginUser,
  get_user_profile,
  get_all_user,
  getUserById,
};

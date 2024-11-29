const userModel = require("../model/user.model.js");
const { validateInput } = require("../utils/vailidator.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const { sendEmail } = require("../utils/sendEmail.js");
const {
  VerificationEmailTemplate,
} = require("../utils/VerificationEmailTemplet.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

//get and upload file from request.
const uploadPath = path.join(__dirname, "../images");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath);
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${file.fieldname}${ext}`;
    cb(null, fileName);
    console.log("fileName path", fileName);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const ext = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimeType = allowedTypes.test(file.mimetype);

    if (ext && mimeType) {
      cb(null, true);
    } else {
      cb(new Error("Only .png, .jpg, and .jpeg formats are allowed"));
    }
  },
}).single("image");

// SIGN-IN USER
const register_user = async (req, res) => {
  try {
    const { first_name, last_name, email, password, mobile_no } =
      req.body;

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
      mobile_no: {
        required: true,
        trim: true,
        isMobilePhone: true,
        display: "Mobile no",
      },
      //alternate_no: { trim: true, isMobilePhone: true },
      //address: { required: true, trim: true },
      //city: { required: true, trim: true },
      //state: { required: true, trim: true },
      //postcode: { required: true, trim: true },
      //country: { required: true, trim: true },
      // user_group: { required: true, display: "User group" },
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

    const emailExist = await userModel.checkEmail(req);

    const mobileExist = await userModel.checkMobile(req);

    // const validGroups = ["admin", "vendor", "driver", "customer"];
    // if (!validGroups.includes(user_group)) {
    //   return res.status(400).json({ error: "Invalid user group" });
    // }

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
    req.body.status = "active";
    // if (req.body.user_group == "driver") {
    //   req.body.status = "inactive";
    //   const verification_token = crypto.MD5(Math.random()).toString();
    //   req.body.verification_token = verification_token;
    // }

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

    // if (req.body.user_group == "driver") {
    //   //Send email to user
    //   const verificationLink = `${process.env.FRONTEND_URL}verify/${req.body.verification_token}`;
    //   const to = req.body.email;
    //   const emailHtml = VerificationEmailTemplate(
    //     req.body.first_name,
    //     verificationLink
    //   );
    //   const subject = "Email Verification";
    //   const text = "Please verify your email address.";
    //   const messageId = await sendEmail(to, subject, text, emailHtml);
    //   console.log("Verification email sent with message ID:", messageId);
    // }

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
    const { email, password } = req.body;
    const ip =
      req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    req.ip = ip;

    if (!email) {
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
    console.log("result", result);
    if (result.status == false) {
      return res
        .status(400)
        .send({
          message: result.error,
          error: result.error,
          data: [],
          status: "400",
        })
        .end();
    }

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
    const name = result[0].first_name;
    const UserGroups = result[0].user_group;
    const token = jwt.sign(
      {
        userid,
        name,
        UserGroups,
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
        UserGroups: UserGroups,

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

//UPDATE USER  ACCOUNT PASSWORD
const update_password = async (req, res) => {
  try {
    const rules = {
      newPassword: {
        required: true,
        trim: true,
        minLength: 6,
        display: "New password",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }
    const { password, newPassword } = req.body;

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
    if (!newPassword) {
      return res
        .status(400)
        .send({
          message: "New Password field Required",
          error: ["New Password field Required"],
          data: [],
          status: "400",
        })
        .end();
    }

    const password_check = await userModel.checkPassword(req);
    if (password_check == false) {
      return res
        .status(400)
        .send({
          message: "Old Password doesn't match!",
          error: ["Old Password doesn't match!"],
          data: [],
          status: "400",
        })
        .end();
    }

    const response = await userModel.updatedPassword(req);

    if (!response) {
      return res
        .status(400)
        .send({
          message: "Failed to update password",
          error: ["Failed to update password"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Password updated successfully",
        data: [],
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

//DELETE USER ACCOUNT
const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res
        .status(400)
        .send({
          message: "user_id field Required",
          data: "",
          status: "400",
        })
        .end();
    }
    const result = await deletedUser(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "user not delete",
          data: "",
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "user is deleted successfully  ",
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

//get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await allUsers(req);
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

    const totalUser = await totalUsers(req);
    if (!totalUser) {
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
        Total: totalUser,
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
    result[0].image_name = result[0].image;
    result[0].image = `${process.env.MY_DOMAIN}images/${result[0].image}`;
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

// update user profile
const update_profile = async (req, res) => {
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
    } = req.body;

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
      email: {
        required: true,
        trim: true,
        isEmail: true,
        unique: true,
        display: "Email name",
      },
      mobile_no: {
        required: true,
        trim: true,
        isMobilePhone: true,
        display: "Mobile no",
      },
      alternate_no: {
        trim: true,
        isMobilePhone: true,
        display: "Alternative no",
      },
      address: { required: true, trim: true, display: "Address" },
      city: { required: true, trim: true, display: "City" },
      state: { required: true, trim: true, display: "State" },
      postcode: { required: true, trim: true, display: "Post code" },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }

    const dataExist = await userModel.checkEmailAndMobileForOther(req);

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

    const image = req.file ? req.file.filename : null;
    if (image) {
      req.body.image = image;
    }

    const result = await userModel.updateProfile(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "User profile update failed",
          error: ["User profile update failed"],
          data: [],
          status: "400",
        })
        .end();
    } else {
      res
        .status(200)
        .send({
          message: "User profile update successfully",
          data: result,
          status: "200",
        })
        .end();
    }
  } catch (error) {
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

//Update user image
const update_profile_image = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res
        .status(400)
        .json({ message: err.message, status: "400", error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No image uploaded",
        status: "400",
        error: ["No image uploaded"],
      });
    }
    try {
      // Prepare image path
      const image_name = `user-${req.file.filename}`;
      const imagePath = path.join(uploadPath, image_name);
      console.log("image path", imagePath);

      // const imagePath = req.file ? `${req.file.filename}` : null;
      await sharp(req.file.path)
        .resize(300, 300) // Set the desired dimensions
        .toFormat("jpeg") // Convert to jpeg for uniformity
        .jpeg({ quality: 80 }) // Adjust quality to reduce size
        .toFile(imagePath);

      const result = await userModel.updateProfileImage(req, image_name);
      if (!result) {
        return res
          .status(400)
          .send({
            message: "User profile update failed",
            error: ["User profile update failed"],
            data: [],
            status: "400",
          })
          .end();
      } else {
        res
          .status(200)
          .send({
            message: "User profile update successfully",
            data: result,
            status: "200",
          })
          .end();
      }
    } catch (error) {
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
  });
};

//Get user by id
const get_user_by_id = async (req, res) => {
  try {
    const result = await userModel.getUserById(req);
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
    console.log("Get user profile", result);
    return res
      .status(200)
      .send({
        message: "Get user profile successfully  ",
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

//verify_email_using_link in email
const verify_email_using_link = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res
        .status(400)
        .send({
          message: "Token not found",
          error: ["Token not found"],
          data: [],
          status: "400",
        })
        .end();
    }

    // Find user by token
    const user = await userModel.verify_email_using_link(token);

    if (user.length == 0) {
      return res
        .status(400)
        .send({
          message: "User not found",
          error: ["User not found"],
          data: user,
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message:
          "Your email has been verified successfully. You can login now!",
        data: [],
        status: "200",
      })
      .end();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({
        message: "Verification failed.",
        error: ["Verification failed"],
        status: "500",
      })
      .end();
  }
};

module.exports = {
  register_user,
  loginUser,
  deleteUser,
  get_user_profile,
  update_profile,
  get_user_by_id,
  getAllUsers,
  getUserById,
  update_password,
  verify_email_using_link,
  update_profile_image,
};

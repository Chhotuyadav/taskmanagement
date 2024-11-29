
const forgotModule = require("../model/forgot_password.model.js");
const {validateInput} = require("../utils/vailidator.js");
const jwt = require("jsonwebtoken");
const crypto = require("crypto-js");
const {sendEmail} = require("../utils/sendEmail.js")

// check email exist
const check_email_exist = async (req, res) => {
  try {

    const rules = {
      email: { required: true, trim: true ,display:"Email"},
    };

    const error = await validateInput(req.body, rules, '');
    if (error.length > 0) {
      return res.status(400).json({ message: 'Validation failed', error ,"status":"400"});
    }

    const dataExist = await forgotModule.checkEmailExist(req);
    //console.log(dataExist[0].id);
    if (dataExist.length == '0') {
      return res
        .status(400)
        .send({
          message: "Email dosen't exists!, Please enter right email",
          data: [],
          status: "400",
        })
        .end();
    } 

    //Generate random number for otp
   const random_number = Math.floor(100000 +  Math.random() * 900000);
   

    //store OTP in db
    const store_otp = await forgotModule.addOTP(random_number, dataExist[0].id);
    if(!store_otp){
        return res
        .status(400)
        .send({
          message: "Something went wrong, Please try again",
          error:"Something went wrong, Please try again",
          data: [],
          status: "400",
        })
        .end();
    }

    //Send email to user
    const to = req.body.email;
    const subject = 'Forgot Password';
    const text = `Your One-Time Password (OTP) to proceed with your request is:
    ${random_number} \n This OTP is valid for the next 10 minutes. Please do not share this code with anyone.`;
    const send =  await sendEmail(to, subject, text);

    res
      .status(200)
      .send({
        message: "OTP send successfuly, check your email",
        data: [],
        status: "200",
      })
      .end();

  } catch (error) {
    console.log("Error",error)
    res
      .status(500)
      .send({
        message: error || "Internal server error",
        data: "",
        status: "500",
      })
      .end();
  }
};

const verify_forgot_otp = async (req, res) => {
    const rules = {
        otp: { required: true, trim: true, type: "number", minLength: 6,display:"OTP" },
      };
  
      const error = await validateInput(req.body, rules, '');
      if (error.length > 0) {
        return res.status(400).json({ message: 'Validation failed', error ,"status":"400"});
      }

      //match otp with db
    const verify_otp = await forgotModule.verifyOTP(req);

    if (verify_otp.length == '0') {
      return res
        .status(400)
        .send({
          message: "Your otp is not valid or expired.",
          data: [],
          status: "400",
        })
        .end();
    } 

    res
      .status(200)
      .send({
        message: "OTP verified successfully",
        data: verify_otp,
        status: "200",
      })
      .end();
}

const change_password_forgot = async (req, res) => {
    const rules = {
        new_password: { required: true, trim: true,display:"New password"},
        otp: { required: true, trim: true,display:"OTP"},
        user_id:{ required: true, trim: true,display:"User id"},
      };
  
      const error = await validateInput(req.body, rules, '');
      if (error.length > 0) {
        return res.status(400).json({ message: 'Validation failed', error ,"status":"400"});
      }

      //match otp with db
    const verify_otp = await forgotModule.verifyOTP(req);
    //console.log(verify_otp[0].otp);
    if (verify_otp.length == '0') {
      return res
        .status(400)
        .send({
          message: "Your otp is expired, Please try again",
          error:["Your otp is expired, Please try again"],
          data: [],
          status: "400",
        })
        .end();
    } 
    console.log(req,'5445454564564645646dsasf')
    const change_pass = await forgotModule.changePassword(req);
    if (!change_pass) {
        return res
          .status(400)
          .send({
            message: "Password not changed",
            error:[ "Password not changed"],
            data: [],
            status: "400",
          })
          .end();
      } 
    res
      .status(200)
      .send({
        message: "Password changed successfully",
        data: [],
        status: "200",
      })
      .end();
}


module.exports = {
    check_email_exist,
    verify_forgot_otp,
    change_password_forgot,
};

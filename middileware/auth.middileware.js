const jwt = require("jsonwebtoken");
const { queryResult } = require("../utils/queryResult.js");

const verifyJWT = async (req, res, next) => {

  try {
    if (!req.header("Authorization")) {
      return res
        .status(401)
        .send({
          message: "Authorization token is missing",
          data: "",
          status: "401",
        })
        .end();;
    }

    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .send({
          message: "Authorization token is missing",
          data: "",
          status: "401",
        })
        .end();;
    }

    const decoded = jwt.verify(token, process.env.SECRETKEY);
    const sql = "SELECT * FROM users WHERE id = ?";
    const value = [decoded.userid];
    //console.log("decoded userId :",decoded.userid)

    const response = await queryResult(sql, value);
    console.log(response[0].status);
    if (!response || response.length === 0) {
      return res
        .status(401)
        .send({
          message: "User not found",
          data: "",
          status: "401",
        })
        .end();;

    }

    else if (response[0].status == 'suspended') {
      return res
        .status(400)
        .send({
          message: "You are suspended right now. Please contact admin!",
          error: ["You are suspended right now. Please contact admin!"],
          data: "",
          status: "400",
        })
        .end();;
    }

    req.id = response[0].id;
    console.log("Authorization successfully");
    next();
  } catch (error) {
    console.error("Error in JWT verification middleware:", error);
    res.status(401)
      .send({
        message: `Error in JWT verification please enter correct JWT Token`,
        data: "",
        status: "401",
      })
      .end();;
  }
};

module.exports = verifyJWT;

const bussinessProfile = require("../model/bussiness_profile.model.js");
const { validateInput } = require("../utils/vailidator.js");

//ADD or Update Bussiness profile
const add_bussiness_profile = async (req, res) => {
  try {
    const rules = {
      bussiness_name: {
        required: true,
        trim: true,
        display: "Bussiness name",
      },
      bussiness_type: {
        required: true,
        trim: true,
        display: "Bussiness type",
      },
      bussiness_email: {
        required: true,
        trim: true,
        display: "Bussiness email",
      },
      bussiness_phone: {
        required: true,
        trim: true,
        isMobilePhone: true,
        display: "Bussiness phone no.",
      },
      bussiness_address: {
        required: true,
        trim: true,
        display: "Bussiness address",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }
    const image = req.file ? req.file.filename : null;
    if (image) {
      req.body.image = image;
    }
    const result = await bussinessProfile.addBussinessProfile(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Bussiness profile is not updated",
          error: ["Bussiness profile is not updated"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Bussiness profile updated successfully",
        data: [],
        status: "200",
      })
      .end();
  } catch (error) {
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

//get Bussiness profile
const get_bussiness_profile = async (req, res) => {
  try {
    const result = await bussinessProfile.getBussinessProfile(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Bussiness profile not found",
          error: ["Bussiness profile not found"],
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
        message: "Bussiness profile get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
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

//get Bussiness profile by id
const get_bussiness_profile_by_id = async (req, res) => {
  try {
    const rules = {
      user_id: {
        required: true,
        trim: true,
        display: "User id",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }

    const result = await bussinessProfile.getBussinessProfileById(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Bussiness profile not found",
          error: ["Bussiness profile not found"],
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
        message: "Bussiness profile get successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
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
  add_bussiness_profile,
  get_bussiness_profile,
  get_bussiness_profile_by_id,
};

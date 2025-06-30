const contactModel = require("../model/contact.model.js");
const { validateInput } = require("../utils/vailidator.js");

//ADD Contact Profile
const add_contact = async (req, res) => {
  try {

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


      mobile_no: {
        required: true,
        trim: true,
        isMobilePhone: true,
        display: "Mobile no",
      },

    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }

    const emailExist = await contactModel.checkEmail(req);

    const mobileExist = await contactModel.checkMobile(req);

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
    const image = req.file ? req.file.filename : null;
    if (image) {
      req.body.image = image;
    }

    const result = await contactModel.addContact(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Contact is not add",
          error: ["Contact is not add"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Contact Add successfully",
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

// update contact
const update_contact = async (req, res) => {
  try {
    console.log("req.body", req.body);
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

      mobile_no: {
        required: true,
        trim: true,
        isMobilePhone: true,
        display: "Mobile no",
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

    const result = await contactModel.updateContact(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Contact is not update",
          error: ["Contact is not update"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Contact update successfully",
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

//get contact by user_id
const get_contact_by_creater_id = async (req, res) => {
  try {
    const result = await contactModel.getContactByUserid(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Contact not found",
          error: ["Contact not found"],
          data: [],
          status: "400",
        })
        .end();
    }

    if (result[0].image) {
      result[0].image = `${process.env.MY_DOMAIN}images/${result[0].image}`;
    }

    return res
      .status(200)
      .send({
        message: "Contact get successfully",
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

//get contact by id
const get_contact_by_id = async (req, res) => {
  try {
    const rules = {
      id: {
        required: true,
        trim: true,
        display: "id",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }


    const result = await contactModel.getContactById(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Contact not found",
          error: ["Contact not found"],
          data: [],
          status: "400",
        })
        .end();
    }
    if (result[0].image) {
      result[0].image = `${process.env.MY_DOMAIN}images/${result[0].image}`;
    }

    return res
      .status(200)
      .send({
        message: "Contact get successfully",
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

//get_total_borrow_lend_by_contact_id
const get_total_borrow_lend_by_contact_id = async (req, res) => {
  try {
    const result = await contactModel.getTotalBorrowOrLendByContact(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Record not found",
          error: ["Record not found"],
          data: [],
          status: "400",
        })
        .end();
    }


    return res
      .status(200)
      .send({
        message: "Record get successfully",
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
}

// serch contact
const search_contact = async (req, res) => {
  try {
    const result = await contactModel.searchContact(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "contact not found",
          error: ["Record not found"],
          data: [],
          status: "400",
        })
        .end();
    }


    return res
      .status(200)
      .send({
        message: "Contact get successfully",
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
}



module.exports = {
  add_contact,
  get_contact_by_creater_id,
  get_contact_by_id,
  get_total_borrow_lend_by_contact_id,
  update_contact,
  search_contact
};

const borrowLendModel = require("../model/berrow_lend.model.js");
const { validateInput } = require("../utils/vailidator.js");

//ADD Record Profile
const add_record = async (req, res) => {
  try {
    const rules = {
      type: {
        required: true,
        trim: true,
        display: "Borrow Type name",
      },
      date: {
        required: true,
        trim: true,
        display: "Date is required",
      },
      amount: {
        required: true,
        trim: true,
        validate: {
          validator: function (value) {
            return /^[0-9]+(\.[0-9]{1,2})?$/.test(value);
          },
          message: "Amount must be a valid decimal number with up to 2 decimal places.",
        },
        display: "Amount is required and must be a valid decimal number",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }


    const result = await borrowLendModel.addRecord(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Record is not add",
          error: ["Record is not add"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Record Add successfully",
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

//update reacord update_record
const update_record = async (req, res) => {
  try {
    const rules = {
      type: {
        required: true,
        trim: true,
        display: "Borrow Type name",
      },
      date: {
        required: true,
        trim: true,
        display: "Date is required",
      },
      amount: {
        required: true,
        trim: true,
        validate: {
          validator: function (value) {
            return /^[0-9]+(\.[0-9]{1,2})?$/.test(value);
          },
          message: "Amount must be a valid decimal number with up to 2 decimal places.",
        },
        display: "Amount is required and must be a valid decimal number",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }


    const result = await borrowLendModel.updateRecord(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Record is not update",
          error: ["Record is not update"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Record Update successfully",
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


//get Record by user_id
const get_record = async (req, res) => {
  try {
    const result = await borrowLendModel.getRecord(req);

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
};

//get record by id
const get_record_by_id = async (req, res) => {
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

    const result = await borrowLendModel.getRecordById(req);

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
};

//get record by contact id
const get_record_by_contact_id
  = async (req, res) => {
    try {
      const rules = {
        contact_id: {
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

      const result = await borrowLendModel.getRecordByContactId(req);

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
  };

//get record by borrow type
const get_record_by_borrow_type
  = async (req, res) => {
    try {
      const rules = {
        type: {
          required: true,
          trim: true,
          display: "type",
        },
      };

      const error = await validateInput(req.body, rules, "");
      if (error.length > 0) {
        return res
          .status(400)
          .json({ message: "Validation failed", error, status: "400" });
      }

      const result = await borrowLendModel.getRecordByType(req);

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
  };

//get_total_borrow_lend_record

const get_total_borrow_lend_record = async (req, res) => {
  try {
    const result = await borrowLendModel.getTotalBorrowOrLendRecord(req);

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


module.exports = {
  add_record,
  update_record,
  get_record,
  get_record_by_id,
  get_record_by_contact_id,
  get_record_by_borrow_type,
  get_total_borrow_lend_record
};

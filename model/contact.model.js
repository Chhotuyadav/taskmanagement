const { queryResult } = require("../utils/queryResult.js");

//add Contact
const addContact = async (data) => {


  try {
    const sql = "INSERT INTO contact (first_name, last_name, mobile_no, email, image, creater_id) VALUES (?, ?, ?, ?, ?, ?)"
    values = [
      data.body.first_name,
      data.body.last_name,
      data.body.mobile_no,
      data.body.email,
      data.body.image,
      data.id
    ];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in adding contact");
    }
    return result;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


const updateContact = async (data) => {
  try {

    const imageToUpdate = data.body.image || null;

    const sql = `
      UPDATE contact 
      SET 
        first_name = ?, 
        last_name = ?, 
        mobile_no = ?, 
        email = ?, 
        image = COALESCE(?, image), 
        creater_id = ? 
      WHERE id = ?`;

    const values = [
      data.body.first_name,
      data.body.last_name,
      data.body.mobile_no,
      data.body.email,
      imageToUpdate,
      data.id,
      data.body.id
    ];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in updating contact");
    }

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
};


//getContactByUserid
const getContactByUserid = async (data) => {
  try {
    const sql = "SELECT * FROM contact WHERE creater_id = ? ";
    const values = [data.id];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting Contacts");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//get contact
const getContactById = async (data) => {
  try {
    const sql = "SELECT * FROM contact WHERE id = ?";
    const values = [data.body.id];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting Contact");
    }
    return result;
  } catch (error) {
    throw error;
  }
};


//check email exits or not
const checkEmail = async (data) => {
  try {
    console.log("check Email :", data.body.email);
    const sql = "SELECT * FROM contact WHERE email = ?";
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
    const sql = "SELECT * FROM contact WHERE mobile_no = ?";
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

//get Total Borrow Or Lend By Contact

const getTotalBorrowOrLendByContact = async (data) => {
  try {

    // Get the total amount borrowed from the specific contact
    const borrowSql = "SELECT SUM(amount) AS total_borrowed FROM borrow_lend_record WHERE type = 'borrow' AND creater_id = ? AND contact_id = ?";
    const borrowValues = [data.id, data.body.contact_id];
    const borrowResult = await queryResult(borrowSql, borrowValues);

    // Get the total amount repaid for borrow (borrow_return) to the specific contact
    const borrowReturnSql = "SELECT SUM(amount) AS total_borrow_returned FROM borrow_lend_record WHERE type = 'borrow_return' AND creater_id = ? AND contact_id = ?";
    const borrowReturnValues = [data.id, data.body.contact_id];
    const borrowReturnResult = await queryResult(borrowReturnSql, borrowReturnValues);

    // Calculate the remaining borrowed amount with this contact
    const totalBorrowed = borrowResult[0]?.total_borrowed || 0;
    const totalBorrowReturned = borrowReturnResult[0]?.total_borrow_returned || 0;
    const remainingBorrowed = totalBorrowed - totalBorrowReturned;

    // Get the total amount lent to the specific contact
    const lendSql = "SELECT SUM(amount) AS total_lend FROM borrow_lend_record WHERE type = 'lend' AND creater_id = ? AND contact_id = ?";
    const lendValues = [data.id, data.body.contact_id];
    const lendResult = await queryResult(lendSql, lendValues);

    // Get the total amount repaid for lend (lend_return) from the specific contact
    const lendReturnSql = "SELECT SUM(amount) AS total_lend_returned FROM borrow_lend_record WHERE type = 'lend_return' AND creater_id = ? AND contact_id = ?";
    const lendReturnValues = [data.id, data.body.contact_id];
    const lendReturnResult = await queryResult(lendReturnSql, lendReturnValues);

    // Calculate the remaining lend amount with this contact
    const totalLend = lendResult[0]?.total_lend || 0;
    const totalLendReturned = lendReturnResult[0]?.total_lend_returned || 0;
    const remainingLend = totalLend - totalLendReturned;

    return {
      // contactId: contact_id,
      totalBorrowed: remainingBorrowed.toFixed(2), // Remaining amount you need to return to the contact
      totalLend: remainingLend.toFixed(2)         // Remaining amount the contact needs to return to you
    };

  } catch (error) {
    console.error("Error calculating balance with contact:", error);
    throw error;
  }
};

// search conatc
const searchContact = async (data) => {
  try {
    const sql = "SELECT * FROM contact WHERE first_name LIKE ? AND mobile_no LIKE ?";

    const values = [`%${data.body.first_name}%`, `%${data.body.mobile_no}%`];

    const result = await queryResult(sql, values);

    if (!result || result.length === 0) {
      throw new Error("No contacts found.");
    }

    console.log("Search result:", result);
    return result;
  } catch (error) {
    console.error(error);
    throw error;
  }
};


module.exports = {
  checkEmail,
  checkMobile,
  addContact,
  getContactByUserid,
  getContactById,
  getTotalBorrowOrLendByContact,
  updateContact,
  searchContact
};


const { queryResult } = require("../utils/queryResult.js");

//add Record
// const addRecord = async (data) => {

//   try {
//    const sql ="INSERT INTO borrow_lend_record (type, date, amount, contact_id,tag, creater_id) VALUES (?, ?,?, ?, ?, ?)"
//       values = [
//         data.body.type,
//         data.body.date,
//         data.body.amount,
//         data.body.contact_id,
//         data.body.tag,
//         data.id
//       ];

//     const result = await queryResult(sql, values);

//     if (!result) {
//       throw new Error("Error in adding Record");
//     }
//     return result;
//   } catch (error) {
//     console.log(error)
//     throw error;
//   }
// };

const addRecord = async (data) => {
  try {


    const isReturn = data.body.type === "borrow_return" || data.body.type === "lend_return";
    const oppositeType = data.body.type === "lend_return" ? "lend" : "borrow";

    if (isReturn) {
      const totalSql = `
        SELECT 
          (SELECT COALESCE(SUM(amount), 0) FROM borrow_lend_record WHERE type = ? AND creater_id = ? AND contact_id = ?) AS total_original,
          (SELECT COALESCE(SUM(amount), 0) FROM borrow_lend_record WHERE type = ? AND creater_id = ? AND contact_id = ?) AS total_returned
      `;
      const totalValues = [oppositeType, data.id, data.body.contact_id, data.body.type, data.id, data.body.contact_id];
      const [totals] = await queryResult(totalSql, totalValues);

      const totalOriginal = totals.total_original || 0; // Total borrowed/lent
      const totalReturned = totals.total_returned || 0; // Total returned
      const remainingBalance = totalOriginal - totalReturned;

      if (data.body.amount > remainingBalance) {
        const excessAmount = data.body.amount - remainingBalance;

        // Insert the return entry up to the remaining balance
        const returnSql = `
          INSERT INTO borrow_lend_record (type, date, amount, contact_id, tag, creater_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await queryResult(returnSql, [data.body.type, data.body.date, remainingBalance, data.body.contact_id, `${data.body.tag} (Partial Return)`, data.id]);

        // Insert the excess amount as a new borrow/lend entry
        const excessSql = `
          INSERT INTO borrow_lend_record (type, date, amount, contact_id, tag, creater_id)
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        await queryResult(excessSql, [oppositeType, data.body.date, excessAmount, data.body.contact_id, `${data.body.tag} (Excess Return Added)`, data.id]);

        return { message: `Excess amount (${excessAmount}) added as a new ${oppositeType} entry.` };
      }
    }

    // Insert the record for normal entries or non-excess returns
    const sql = `
      INSERT INTO borrow_lend_record (type, date, amount, contact_id, tag, creater_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [data.body.type, data.body.date, data.body.amount, data.body.contact_id, data.body.tag, data.id];
    const result = await queryResult(sql, values);

    return { message: "Record added successfully.", result };
  } catch (error) {
    console.error("Error in addRecord:", error);
    throw error;
  }
};

// update Record

const updateRecord = async (data) => {

  try {

    const sql = "UPDATE borrow_lend_record SET type = ?,date = ?,amount=?,contact_id = ?,tag = ?  WHERE id= ?"
    values = [
      data.body.type,
      data.body.date,
      data.body.amount,
      data.body.contact_id,
      data.body.tag,
      data.body.id,
    ];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in update Record");
    }
    return result;
  } catch (error) {
    console.log(error)
    throw error;
  }
};


//get Record
const getRecord = async (data) => {
  try {
    const sql = ` SELECT *, DATE_FORMAT(date, '${process.env.DATE_FORMAT}') AS date FROM borrow_lend_record`;

    const values = [data.id];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting Record");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//get Record
const getRecordById = async (data) => {
  try {
    const sql = "SELECT * FROM borrow_lend_record WHERE id = ?";
    const values = [data.body.id];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting Record");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//get Record
const getRecordByContactId = async (data) => {
  try {
    const sql = "SELECT * FROM borrow_lend_record WHERE contact_id = ?";
    const values = [data.body.contact_id];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting Record");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
//get Record
const getRecordByType = async (data) => {
  try {
    const sql = "SELECT * FROM borrow_lend_record WHERE type = ?";
    const values = [data.body.type];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting Record");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

const getTotalBorrowOrLendRecord = async (data) => {
  try {
    // Get the total amount borrowed by the user
    const borrowSql = "SELECT SUM(amount) AS total_borrowed FROM borrow_lend_record WHERE type = 'borrow' AND creater_id = ?";
    const borrowValues = [data.id];
    const borrowResult = await queryResult(borrowSql, borrowValues);

    // Get the total amount repaid for borrow (borrow_return)
    const borrowReturnSql = "SELECT SUM(amount) AS total_borrow_returned FROM borrow_lend_record WHERE type = 'borrow_return' AND creater_id = ?";
    const borrowReturnValues = [data.id];
    const borrowReturnResult = await queryResult(borrowReturnSql, borrowReturnValues);

    // Calculate the remaining borrowed amount
    const totalBorrowed = borrowResult[0]?.total_borrowed || 0;
    const totalBorrowReturned = borrowReturnResult[0]?.total_borrow_returned || 0;
    const remainingBorrowed = totalBorrowed - totalBorrowReturned;

    // Get the total amount lend by the user
    const lendSql = "SELECT SUM(amount) AS total_lend FROM borrow_lend_record WHERE type = 'lend' AND creater_id = ?";
    const lendValues = [data.id];
    const lendResult = await queryResult(lendSql, lendValues);

    // Get the total amount repaid for lend (lend_return)
    const lendReturnSql = "SELECT SUM(amount) AS total_lend_returned FROM borrow_lend_record WHERE type = 'lend_return' AND creater_id = ?";
    const lendReturnValues = [data.id];
    const lendReturnResult = await queryResult(lendReturnSql, lendReturnValues);

    // Calculate the remaining lend amount
    const totalLend = lendResult[0]?.total_lend || 0;
    const totalLendReturned = lendReturnResult[0]?.total_lend_returned || 0;
    const remainingLend = totalLend - totalLendReturned;

    return {
      totalBorrowed: remainingBorrowed.toFixed(2),
      totalLend: remainingLend.toFixed(2)
    };

  } catch (error) {
    console.error("Error calculating remaining balance:", error);
    throw error;
  }
};




module.exports = {
  addRecord,
  getRecord,
  getRecordByContactId,
  getRecordById,
  getRecordByType,
  updateRecord,
  getTotalBorrowOrLendRecord
};

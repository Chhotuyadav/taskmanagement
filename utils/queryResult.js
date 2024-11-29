const mysql = require("mysql2");
const pool = require("./dbConnection");


// Query result function using the pool
const queryResult = (sql, values = []) => {
  console.log("SQL Query", sql);
  return new Promise((resolve, reject) => {
    pool.query(sql, values, (error, result) => {
      if (error) {
        console.error("Error in query:", error.message);
        return reject(new Error("Database query error"));
      }

      return resolve(result);
    });
  });
};

// Dynamic update function
function dynamicUpdate(
  table,
  columns,
  values,
  conditionColumn,
  conditionValue
) {
  const setClause = columns.map((column, index) => `${column} = ?`).join(", ");
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${conditionColumn} = ?`;
  const params = [...values, conditionValue];
  return queryResult(sql, params);
}

module.exports = { queryResult, dynamicUpdate };

// Example static export
const images = [
  "../images/image1.png",
  "../images/image2.png",
  "../images/image3.png",
  "../images/image1.png",
];
exports.images = images;

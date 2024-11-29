// backend/logToDatabase.js
// const pool = require("./dbConnection");

// Function to log data to the database
const LogToDatabase = async (data) => {
  const sql = `
    INSERT INTO log_generate 
    (log_type, log_message, request, amount, request_from, header_data, request_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    "INFO",
    "Log generated",
    JSON.stringify(data.body),
    "0",
    data.method,
    JSON.stringify(data.headers),
    data.originalUrl,
  ];

  try {
    // Execute the SQL query using the shared pool
    const [result] = await pool.promise().execute(sql, values);
    console.log("Log inserted successfully:", result);
    return result;
  } catch (error) {
    console.error("Error logging to database:", error);
    throw error;
  }
};

module.exports = { LogToDatabase };

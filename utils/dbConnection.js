// backend/dbConnection.js
const mysql = require("mysql2");

// Create a single connection pool when the app starts
const pool = mysql.createPool({
  host: process.env.MYHOST,
  user: process.env.DBUSERNAME,
  password: process.env.DBPASSWORD,
  database: process.env.DATABASENAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Log connection and acquisition events for the pool
pool.on("connection", (connection) => {
  console.log("New connection established with ID:", connection.threadId);
});
pool.on("acquire", (connection) => {
  console.log("Connection %d acquired", connection.threadId);
});

// Export the pool to be used by other modules
module.exports = pool;

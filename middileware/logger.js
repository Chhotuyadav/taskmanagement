// logger.js
const fs = require("fs");
const path = require("path");
const {LogToDatabase} = require("../utils/LogToDatabase")

// Create a log directory if it doesn't exist
const logDirectory = path.join(__dirname, "../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Function to format current date and time for logs
function getFormattedDate() {
  return new Date().toISOString();
}

// Log function to handle different log types
const logRequest = async (req, res, next) => {
  // console.log("request", req);
  const { method, originalUrl, ip, headers,body } = req;
  
  const start = Date.now();

  res.on("finish", () => {
    const { statusCode } = res;
    const duration = Date.now() - start;

    const log = `${getFormattedDate()} | Method: ${method} | URL: ${originalUrl} | Status: ${statusCode} | Duration: ${duration}ms\n  | Headers: ${JSON.stringify(headers)}\n | requestFrom: ${ip}\n | request: ${JSON.stringify(body)}\n`;

    // Write log to file
    fs.appendFile(path.join(logDirectory, "requests.log"), log, (err) => {
      if (err) {
        console.error("Error writing log:", err);
      }
    });
    
  });

  next();
}

module.exports = logRequest;

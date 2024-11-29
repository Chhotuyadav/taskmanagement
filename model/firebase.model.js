const { queryResult } = require("../utils/queryResult.js");

const addPushToken = async (data) => {
  try {
    console.log("erdsfoiujwoidurfjgsdiufjesdpofij", data.id);
    const { android_token, web_token, ios_token } = data.body;
    let id = data.id;
    let field;
    let data1 = [];
    if (android_token) {
      field = "android_token";
      data1 = [android_token, id];
    }
    if (web_token) {
      field = "web_token";
      data1 = [web_token, id];
    }
    if (ios_token) {
      field = "ios_token";
      data1 = [ios_token, id];
    }

    const condition = await check_user_exist(id);
    console.log("condition", condition);
    if (condition) {
      console.log("updated");
      const query = `UPDATE push_notification SET ${field} = ? WHERE user_id = ?`;
      const result = await queryResult(query, data1);
      if (!result) {
        throw new ApiError("Result not found");
      }
      return result;
    } else {
      console.log("added");
      const query = `INSERT INTO push_notification (${field}, user_id) VALUES (?, ?)`;
      const result = await queryResult(query, data1);
      if (!result) {
        throw new ApiError("Result not found");
      }
      return result;
    }
  } catch (error) {
    throw error;
  }
};

const check_user_exist = async (id) => {
  const tmp_query = `SELECT id FROM push_notification WHERE user_id = ?`;
  const result1 = await queryResult(tmp_query, id);
  console.log(result1.length);
  //console.log(result1[0].id);
  if (result1.length > 0 && result1[0].id) {
    return true;
  }
  return false;
};

const getTokens = async (user_ids) => {
  console.log(user_ids, "user_ids");
  try {
    // Construct the SQL query
    const query = `SELECT android_token, web_token, ios_token FROM push_notification WHERE user_id IN (?)`;

    // Execute the query with the array of user_ids
    const result = await queryResult(query, [user_ids]);

    // // Extract tokens and store them in an array
    // const tokens = result.map(row => row.android_token);
    // console.log(tokens);
    const tokens = [];
    result.forEach((row) => {
      if (row.android_token) tokens.push(row.android_token);
      if (row.web_token) tokens.push(row.web_token);
      if (row.ios_token) tokens.push(row.ios_token);
    });
    // console.log("Tokens:", tokens);
    return tokens;
  } catch (error) {
    //console.error("Error fetching tokens:", error);
    throw error;
  }
};

module.exports = { addPushToken, getTokens };

const { queryResult } = require("../utils/queryResult.js");

// Add Task Record
const addRecord = async (data) => {
  try {
    const sql = `
      INSERT INTO tasks (title, description, due_date, priority, users, creater_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.body.title,
      data.body.description,
      data.body.due_date,
      data.body.priority,
      JSON.stringify(data.body.users),
      data.id,  // Assuming `id` refers to the authenticated user's ID (creator)
    ];

    const result = await queryResult(sql, values);
    return result;
  } catch (error) {
    console.error("Error in addRecord:", error);
    throw error;
  }
};

// Update Task Record
const updateRecord = async (data) => {
  try {
    const sql = `
      UPDATE tasks
      SET title = ?, description = ?, due_date = ?, priority = ?, users = ?
      WHERE id = ?
    `;
    const values = [
      data.body.title,
      data.body.description,
      data.body.due_date,
      data.body.priority,
      JSON.stringify(data.body.users),
      data.body.id, // Task ID to update
    ];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in updating record");
    }
    return result;
  } catch (error) {
    console.log("Error in updateRecord:", error);
    throw error;
  }
};

// Get Task Record by User ID
const getRecord = async (data) => {
  try {
    const sql = `
      SELECT * FROM tasks WHERE user_id = ?;
    `;
    const values = [data.id];  // User ID

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting record");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Get Task Record by Task ID
const getTaskById = async (data) => {
  try {
    const sql = `SELECT * FROM tasks WHERE FIND_IN_SET(?, REPLACE(REPLACE(users, '[', ''), ']', '')) > 0;
    `;
    const values = [data.id];  // User ID

    const result = await queryResult(sql, values);
    if (!result) {
      throw new Error("Error in getting record by user ID");
    }
    return result;
  } catch (error) {
    throw error;
  }
};


// Get All Tasks with Pagination (Optional)
const getAllTasks = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    const sql = `
      SELECT * FROM tasks LIMIT ? OFFSET ?;
    `;
    const values = [parseInt(limit), parseInt(offset)];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in getting tasks");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

// Delete Task by Task ID
const deleteRecord = async (data) => {
  try {
    const sql = `
      DELETE FROM tasks WHERE id = ?;
    `;
    const values = [data.body.id];  // Task ID

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in deleting task");
    }
    return result;
  } catch (error) {
    throw error;
  }
};
//getAllPriorityColors
const getAllPriorityColors = async (data) => {
  try {
    const sql = `
      SELECT * FROM priority_colors;
    `;
    const result = await queryResult(sql);

    if (!result) {
      throw new Error("Error in getting priority colors");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

//updateStatus

const updateStatus = async (data) => {
  try {
    const sql = `
      UPDATE tasks
      SET status =?
      WHERE id =?;
    `;
    const values = [data.body.status, data.body.taskId];

    const result = await queryResult(sql, values);

    if (!result) {
      throw new Error("Error in updating status");
    }
    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  addRecord,
  updateRecord,
  getRecord,
  getTaskById,
  getAllTasks,
  deleteRecord,
  getAllPriorityColors,
  updateStatus
};

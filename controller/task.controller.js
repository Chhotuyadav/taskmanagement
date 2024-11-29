const taskModel = require("../model/task.model.js");
const { validateInput } = require("../utils/vailidator.js");

// Add Task (Create)
const add_task = async (req, res) => {
  try {
    const rules = {
      title: {
        required: true,
        trim: true,
        display: "Title",
      },
      description: {
        required: true,
        trim: true,
        display: "Description",
      },
      due_date: {
        required: true,
        trim: true,
        display: "Due Date is required",
      },
      priority: {
        required: true,
        trim: true,
        display: "Priority",
      },
      users: {
        required: true,
        trim: true,
        display: "User ID is required",
      }
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }

    const result = await taskModel.addRecord(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Task could not be added",
          error: ["Task not added"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Task added successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: `${error}` || "Internal server error",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

// Update Task
const update_task = async (req, res) => {
  try {
    const rules = {
      title: {
        required: true,
        trim: true,
        display: "Title",
      },
      description: {
        required: true,
        trim: true,
        display: "Description",
      },
      due_date: {
        required: true,
        trim: true,
        display: "Due Date is required",
      },
      priority: {
        required: true,
        trim: true,
        display: "Priority",
      },
      users: {
        required: true,
        trim: true,
        display: "User ID is required",
      }
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }

    const result = await taskModel.updateRecord(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Task could not be updated",
          error: ["Task not updated"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Task updated successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: `${error}` || "Internal server error",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

// Get Task by ID
const get_task_by_user_id = async (req, res) => {
  try {


    const result = await taskModel.getTaskById(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "Task not found",
          error: ["Task not found"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Task fetched successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: `${error}` || "Internal server error",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

// Get All Tasks (With optional pagination)
const get_all_tasks = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const result = await taskModel.getAllTasks(page, limit);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "No tasks found",
          error: ["No tasks found"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Tasks fetched successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: `${error}` || "Internal server error",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

// Delete Task by ID
const delete_task = async (req, res) => {
  try {
    const rules = {
      id: {
        required: true,
        trim: true,
        display: "Task ID",
      },
    };

    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }

    const result = await taskModel.deleteRecord(req);

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .send({
          message: "Task could not be deleted",
          error: ["Task not deleted"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "Task deleted successfully",
        data: [],
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: `${error}` || "Internal server error",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

// priority_colors

const priority_colors = async (req, res) => {
  try {

    const result = await taskModel.getAllPriorityColors(req);

    if (result.length === 0) {
      return res
        .status(400)
        .send({
          message: "No color found",
          error: ["No color found"],
          data: [],
          status: "400",
        })
        .end();
    }

    return res
      .status(200)
      .send({
        message: "priority colors fetched successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: `${error}` || "Internal server error",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
};

// update status

const update_status = async (req, res) => {
  try {
    const rules = {
      taskId: {
        required: true,
        trim: true,
        display: "Task ID",
      },
      status: {
        required: true,
        trim: true,
        display: "Status",
      },
    };
    const error = await validateInput(req.body, rules, "");
    if (error.length > 0) {
      return res
        .status(400)
        .json({ message: "Validation failed", error, status: "400" });
    }
    const result = await taskModel.updateStatus(req);
    if (!result) {
      return res
        .status(400)
        .send({
          message: "Task status could not be updated",
          error: ["Task status not updated"],
          data: [],
          status: "400",
        })
        .end();
    }
    return res
      .status(200)
      .send({
        message: "Task Status Update successfully",
        data: result,
        status: "200",
      })
      .end();
  } catch (error) {
    res
      .status(500)
      .send({
        message: `${error}` || "Internal server error",
        error: error || "Internal server error",
        data: [],
        status: "500",
      })
      .end();
  }
}



module.exports = {
  add_task,
  update_task,
  get_task_by_user_id,
  get_all_tasks,
  delete_task,
  priority_colors,
  update_status

};

const verifyJWT = require("../middileware/auth.middileware.js");
const express = require("express");

const userController = require("../controller/users.controller.js");

const TaskController = require("../controller/task.controller.js")



const createRouter = () => {
  const userRouter = express.Router();

  //User routes
  userRouter.route("/auth/register").post(userController.register_user);
  userRouter.route("/auth/login").post(userController.loginUser);
  userRouter.route("/user/get_user_by_id").post(verifyJWT, userController.get_user_profile)
  userRouter.route("/user/get_all_user").post(verifyJWT, userController.get_all_user)


  //all borrow route 

  userRouter.route("/task/add").post(verifyJWT, TaskController.add_task)
  userRouter.route("/task/update").post(verifyJWT, TaskController.update_task);
  userRouter.route("/task/get_task_by_user_id").post(verifyJWT, TaskController.get_task_by_user_id);
  userRouter.route("/task/get_all_task").post(verifyJWT, TaskController.get_all_tasks);

  // Delete Task
  userRouter.route("/task/delete").post(verifyJWT, TaskController.delete_task);
  userRouter.route("/task/priority_colors").post(verifyJWT, TaskController.priority_colors);


  userRouter.route("/task/update_status").post(verifyJWT, TaskController.update_status);






  return userRouter;
};

module.exports = createRouter;

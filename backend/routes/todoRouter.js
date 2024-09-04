const express = require("express");
const isAuth = require("../middlewares/isAuthMiddleware");
const {createTodoController, editTodoController, updateCompletedStatus, readTasksController, deleteTaskController, isImportantTodoController} = require("../controllers/todoController");
const todoRouter = express.Router();

todoRouter.post("/create-todo", isAuth, createTodoController);
todoRouter.post("/edit-todo", isAuth, editTodoController);
todoRouter.post("/changeCompletedStatus", isAuth, updateCompletedStatus);
todoRouter.get("/read-todo", isAuth, readTasksController)
todoRouter.post("/delete-todo", isAuth, deleteTaskController)
todoRouter.post("/changeImportanceStatus", isAuth, isImportantTodoController)
module.exports = todoRouter;
const {createTodo, editTodoWithId, getTodoById, changeCompletedStatus, readTask, deleteTaskWithId, changePriorityStatus} = require("../models/todoModel");
const todoSchema = require("../schemas/todoSchema");
const { todoDataValidation } = require("../utils/todoDataValidation");


const createTodoController = async (req, res) => {
    const {task, isImportant, dueDate, priority} = req.body;
    console.log("create-todo", req.body)
    const userId = req.user._id;

    try {
        await todoDataValidation({task});
    } catch (error) {
        return res.status(400).send({
            message: error,
          });
    }
    try {
        const todoDb = await createTodo({task, isImportant, priority, dueDate, userId})
        return res.status(201).send({
            message: "TODO Created Successfully",
            data: todoDb,
          });
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            error: error,
        })
      }
}

const editTodoController = async(req, res) => {
    const {task, dueDate, todoId} = req.body;
    const userId = req.user._id;

    try {
        await todoDataValidation({ task});
        const todoDb = await getTodoById({todoId});

        if (!userId.equals(todoDb.userId))
            return res.send({
              status: 403,
              message: "Not Allowed To Edit The Todo",
        });
        const editTodoDb = await editTodoWithId({ task, dueDate, todoId });
        res.status(200).send({
            message: "Todo Updated Successfully",
            data: editTodoDb,
          });
      } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            error: error,
        });
      }
}

const updateCompletedStatus = async(req, res) => {
    const { todoId} = req.body;
    const userId = req.user._id;
    try {
        const todoDb = await getTodoById({todoId});
    
        if (!userId.equals(todoDb.userId))
            return res.send({
              status: 403,
              message: "Not Allowed To Edit The Todo",
        });
        
        const editTodoDb = await changeCompletedStatus({ todoId });
        res.status(200).send({
            message: "Todo Updated Successfully",
            data: editTodoDb,
          });
      } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            error: error,
        });
      }
    }

const readTasksController = async (req, res) => {

    const userId = req.user._id;
    try {
        const readDb = await readTask({userId});
        if(readDb.length === 0){
            return res.status(200).send({
                message: "No TODO Found",
            })
        }
        return res.status(200).send({
            message: "Read Success",
            data: readDb,
        });
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error",
            error: error,
        });
    }
}

const isImportantTodoController = async (req, res) => {
    const userId = req.user._id;
    const { todoId , status } = req.body;
    try {
        const todoDb = await getTodoById({todoId});
        if (!userId.equals(todoDb.userId))
            return res.send({
              status: 403,
              message: "Not Allowed To Edit The Todo",
        });
        
        const isImportantTodoDb = await changePriorityStatus({todoId, status});
       
        return res.status(200).send({
            message: "Read Success",
            data: "none",
        });
    } catch (error) {
        res.status(500).send({
            message : "Internal Server Error",
            error : error,
        })
    }
}
const deleteTaskController = async (req, res) => {
    const { todoId } = req.body;
    const userId = req.user._id;
    try {
        const taskDb = await getTodoById({todoId});
        if (!userId.equals(taskDb.userId)) {
            return res.status(403).send({
            message: "Not Allowed To Delete Blog",
            });
        }
        const deleteTask = await deleteTaskWithId({ todoId });
        return res.status(200).send({
            message: "task Deleted Successfully",
            data: deleteTask,
        });
    } catch (error) {
        return res.status(500).send({
            message: "Internal Server Error",
            error: error,
          });
    }
}
module.exports = {createTodoController, deleteTaskController, editTodoController, updateCompletedStatus, readTasksController, isImportantTodoController};
// const bcrypt = require("bcrypt");
// const User = require("../models/userModel");
// const { userDataValidation, userDataValidationForLogin } = require("../utils/authutils");
// const session = require("express-session");

// const registerController = async (req, res) => {
//   const { email, username, password } = req.body;
//   try {
//     await userDataValidation({ email, username, password });

//     // Create a new user object
//     const userModelObj = new User({ email, username, password });

//     // Register the user
//     const userDB = await userModelObj.registerUser();
//     return res.status(201).send({
//       message: "User Registered Successfully",
//       data: userDB,
//     });
//   } catch (error) {
//     return res.status(400).send({
//       message: "Invalid User",
//       error: error.message || error,
//     });
//   }
// };

// const loginController = async (req, res) => {
//   console.log("hii", req.body)
//   if (req.session.isAuth) {
//     return res.status(400).send({
//       message: "User already logged in",
//     });
//   }
//   const { email, password } = req.body;
//   try {
//     await userDataValidationForLogin({ email, password });

//     const userDB = await User.findUserWithKey({ key: email });

//     // Check if password matches
//     const isMatched = await bcrypt.compare(password, userDB.password);
//     if (!isMatched) {
//       return res.status(400).send({
//         message: "Incorrect password",
//       });
//     }
//     req.session.isAuth = true;
//     req.session.user = {
//       userId: userDB._id,
//       username: userDB.username,
//       email: userDB.email,
//     };
//     return res.status(200).send({
//       message: "User Logged In Successfully",
//       data: userDB,
//     });
//   } catch (error) {
//     return res.status(500).send({
//       error: error.message,
//     });
//   }
// };

// const logoutController = async (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       return res.status(400).send({
//         message: "Logout unsuccessful",
//       });
//     } else {
//       return res.status(200).send({
//         message: "Logout successful",
//       });
//     }
//   });
// };

// module.exports = { registerController, loginController, logoutController };


import { endOfToday, startOfToday } from "date-fns";
import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  CREATE_TODO_REQUEST,
  CREATE_TODO_SUCCESS,
  CREATE_TODO_FAILURE,
  CHANGE_IS_COMPLETED,
  CHANGE_IS_IMPORTANT,
  EDIT_TASK,
  DELETE_TASK,
  FILTER_IMPORTANT,
} from "../actions/taskAction";

// Fetch all tasks
export const fetchAllTasks = () => async (dispatch) => {
  dispatch({ type: FETCH_TASKS_REQUEST });
  try {
    const response = await fetch("https://taskmanagerbackend-xrer.onrender.com/todo/read-todo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
      credentials: 'include', // Include credentials (cookies)
    });

    const data = await response.json();

    if (response.status === 200) {
      dispatch({ type: FETCH_TASKS_SUCCESS, payload: data.data });
    } else {
      throw new Error("Failed to fetch tasks");
    }
  } catch (error) {
    dispatch({
      type: FETCH_TASKS_FAILURE,
      payload: error.message,
    });
  }
};

// Create a new todo
export const createTodo = (todoData) => {
  return async (dispatch) => {
    dispatch({ type: CREATE_TODO_REQUEST });
    try {
      const response = await fetch("https://taskmanagerbackend-xrer.onrender.com/todo/create-todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(todoData),
        credentials: "include", // Include credentials (cookies)
      });

      if (!response.ok) {
        const errorData = await response.json();
        dispatch({
          type: CREATE_TODO_FAILURE,
          payload: errorData.message || "Something went wrong",
        });
        return;
      }

      const data = await response.json();
      dispatch({ type: CREATE_TODO_SUCCESS, payload: data.data });
    } catch (error) {
      dispatch({ type: CREATE_TODO_FAILURE, payload: error.message });
    }
  };
};

// Change importance status of a todo
export const changeStatusOfIsImportant = (todoID, status, tasks) => async (dispatch) => {
  try {
    const updatedTasks = tasks.map((task) =>
      task._id === todoID ? { ...task, isImportant: !status } : task
    );

    dispatch({ type: CHANGE_IS_IMPORTANT, payload: updatedTasks });

    await fetch(
      "https://taskmanagerbackend-xrer.onrender.com/todo/changeImportanceStatus",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ todoId: todoID, status: !status }),
        credentials: "include", // Include credentials (cookies)
      }
    );
  } catch (error) {
    console.error("Failed to update importance status:", error);
  }
};

// Change completion status of a todo
export const changeStatusOfIsCompleted = (todoID, status, tasks) => async (dispatch) => {
  try {
    const updatedTasks = tasks.map((task) =>
      task._id === todoID ? { ...task, isCompleted: !status } : task
    );

    dispatch({ type: CHANGE_IS_COMPLETED, payload: updatedTasks });

    await fetch(
      "https://taskmanagerbackend-xrer.onrender.com/todo/changeCompletedStatus",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ todoId: todoID }),
        credentials: "include", // Include credentials (cookies)
      }
    );
  } catch (error) {
    console.error("Failed to update completion status:", error);
  }
};

// Update a todo
export const updateTodo = (task, todoId, dueDate, tasks) => async (dispatch) => {
  const updatedTasks = tasks.map((t) =>
    t._id === todoId ? { ...t, task, dueDate: dueDate || new Date() } : t
  );

  dispatch({ type: EDIT_TASK, payload: updatedTasks });

  try {
    await fetch("https://taskmanagerbackend-xrer.onrender.com/todo/edit-todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ task, dueDate, todoId }),
      credentials: "include", // Include credentials (cookies)
    });
  } catch (error) {
    dispatch({ type: CREATE_TODO_FAILURE, payload: error.message });
  }
};

// Delete a todo
export const deleteTodo = (todoId, tasks) => async (dispatch) => {
  const updatedTasks = tasks.filter((task) => task._id !== todoId);
  dispatch({ type: DELETE_TASK, payload: updatedTasks });

  try {
    await fetch("https://taskmanagerbackend-xrer.onrender.com/todo/delete-todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify({ todoId }),
      credentials: "include", // Include credentials (cookies)
    });
  } catch (error) {
    dispatch({ type: CREATE_TODO_FAILURE, payload: error.message });
  }
};

// Filter tasks marked as important
export const filterImportantData = (globalTasks) => (dispatch) => {
  const importantTasks = globalTasks.filter((task) => task.isImportant);
  dispatch({ type: FILTER_IMPORTANT, payload: importantTasks });
};

// Filter tasks due today
export const filterTodayData = (globalTasks) => (dispatch) => {
  const today = new Date();
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

  const todayTasks = globalTasks.filter((task) => {
    const taskDueDate = new Date(task.dueDate);
    return taskDueDate >= startOfToday && taskDueDate < endOfToday;
  });

  dispatch({ type: FILTER_IMPORTANT, payload: todayTasks });
};

// Filter all tasks
export const filterAllData = (globalTasks) => (dispatch) => {
  dispatch({ type: FILTER_IMPORTANT, payload: globalTasks });
};

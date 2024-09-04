const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const { userDataValidation, userDataValidationForLogin } = require("../utils/authutils");
const session = require("express-session");

const registerController = async (req, res) => {
  const { email, username, password } = req.body;
  try {
    await userDataValidation({ email, username, password });

    // Create a new user object
    const userModelObj = new User({ email, username, password });

    // Register the user
    const userDB = await userModelObj.registerUser();
    return res.status(201).send({
      message: "User Registered Successfully",
      data: userDB,
    });
  } catch (error) {
    return res.status(400).send({
      message: "Invalid User",
      error: error.message || error,
    });
  }
};

const loginController = async (req, res) => {
  console.log("hii", req.body)
  if (req.session.isAuth) {
    return res.status(400).send({
      message: "User already logged in",
    });
  }
  const { email, password } = req.body;
  try {
    await userDataValidationForLogin({ email, password });

    const userDB = await User.findUserWithKey({ key: email });

    // Check if password matches
    const isMatched = await bcrypt.compare(password, userDB.password);
    if (!isMatched) {
      return res.status(400).send({
        message: "Incorrect password",
      });
    }
    req.session.isAuth = true;
    req.session.user = {
      userId: userDB._id,
      username: userDB.username,
      email: userDB.email,
    };
    return res.status(200).send({
      message: "User Logged In Successfully",
      data: userDB,
    });
  } catch (error) {
    return res.status(500).send({
      error: error.message,
    });
  }
};

const logoutController = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(400).send({
        message: "Logout unsuccessful",
      });
    } else {
      return res.status(200).send({
        message: "Logout successful",
      });
    }
  });
};

module.exports = { registerController, loginController, logoutController };

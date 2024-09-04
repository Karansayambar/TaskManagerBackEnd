const jwt = require("jsonwebtoken")


 const getToken = (userID) => {
    return jwt.sign({identifier: userID},process.env.SECRET_KEY)
}

module.exports = { getToken }


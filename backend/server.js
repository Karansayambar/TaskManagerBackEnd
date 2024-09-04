// Package Imports
const express = require("express");
const cors = require('cors')
// Files Imports
const db = require("./db"); // Assuming this connects to your MongoDB
const authRouter = require("./routes/authRouter");
const todoRouter = require("./routes/todoRouter");
const { ExtractJwt, Strategy } = require("passport-jwt");
const passport = require("passport");
const userSchema = require("./schemas/userSchema");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();


const BASE_URL = process.env.BASE_URL;
// Constants

const PORT = process.env.PORT || 3000; // Default to 3000 if PORT is not defined



// Middlewares
app.use(express.urlencoded({ extended: true}))
app.use(express.json())
app.use(cookieParser())

app.use(cors({
  origin : process.env.BASE_URL || 'https://task-manager-frontend-app-e95m.onrender.com', //Frontend URL
  credentials : true // Allow credentials (cookies, headers)
}));

app.set('trust proxy',1)


app.get('/', (req, res) => {
  res.send({msg:"Everything is working good!"})
})


//Strategy for User
const userOpts = {} 
userOpts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
userOpts.secretOrKey = process.env.SECRET_KEY


passport.use('user',new Strategy(userOpts, async(jwt_payload, done) => {
  try {
    const user = await userSchema.findOne({_id: jwt_payload.identifier})
    if(user) {
      done(null, user)
    }
    else {
      done(null, false)
    }
  }
  catch(err) {
    done(err, false)
  }
}))


app.use("/auth", authRouter);
app.use("/todo", todoRouter);

// Listener
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});




// const store = new MongoDBStore({
//   uri: process.env.DB_URL,
//   collection: "sessions", // Correct collection name
// });

// app.use(session({
//   secret: process.env.SECRET_KEY,
//   store: store,
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false, httpOnly: false } // Set `secure: true` if using HTTPS
// }));
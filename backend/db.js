const mongoose = require("mongoose");
require("dotenv").config(); // Correctly configure dotenv
mongoose.connect(process.env.DB_URL)
.then((res) => console.log("MongoDB Connected Succesfully"))
.catch((error) => {
    console.log(error);
})
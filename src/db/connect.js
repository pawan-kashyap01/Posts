require("dotenv/config");
const mongoose = require("mongoose");
const DB_URI = process.env.MONGO_URI;

//Creating a db connection
mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection success.");
  })
  .catch((err) => {
    console.log("error in connection with DB=", err);
  });

//export the connection
const connection = mongoose.connection;
module.exports = connection;

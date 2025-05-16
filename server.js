const express = require("express");
const env = require("dotenv").config();
//getting the connection and connecting to a db
const dbConnection = require("./config/dbconnection");
//establishing the connection
dbConnection();
const app = express();
const port = process.env.PORT;
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use("/credentials", require("./UserRoutes/AuthanticationRoutes"));
app.listen(port, () => {
  console.log("the server is running");
});

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
//user login routes
app.use("/credentials", require("./UserRoutes/AuthanticationRoutes"));
//complain routes
app.use("/citizen-complain", require("./UserRoutes/complainRoute"));
//institute routes
app.use("/instititutes", require("./GovRoutes/instituteCreationRoute"));
app.listen(port, () => {
  console.log("the server is running");
});

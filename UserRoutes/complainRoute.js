const express = require("express");
const routes = express.Router();
const { newComplain } = require("../UserControllers/userComplains");
const authanticatecaUser = require("../middlewares/creatingToken");
routes
  .route("/new-complain")
  .post(authanticatecaUser, newComplain)
  .get(authanticatecaUser, (req, res) => {
    res.status(200).json({ message: "claim your write" });
  });
module.exports = routes;

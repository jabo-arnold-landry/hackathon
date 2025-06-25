const express = require("express");
const routes = express.Router();
const { newComplain } = require("../UserControllers/userComplains");
const { newComment } = require("../UserControllers/complain.interaction");
const { displayComplain } = require("../UserControllers/complainDisplay");
const authanticatecaUser = require("../middlewares/creatingToken");
routes
  .route("/new-complain")
  .post(authanticatecaUser, newComplain)
  .get(authanticatecaUser, (req, res) => {
    res.status(200).json({ message: "claim your write" });
  });
routes.route("/comment").post(authanticatecaUser, newComment);
routes.route("/feed").get(authanticatecaUser, displayComplain);
module.exports = routes;

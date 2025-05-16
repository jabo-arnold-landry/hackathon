const express = require("express");
const { get } = require("mongoose");
const router = express.Router();
const { createAccount, login } = require("../UserControllers/signupController");
router
  .route("/create/new/account")
  .get((req, res) => {
    res
      .status(200)
      .json({ message: "welcome back, you are in the right place!!" });
  })
  .post(createAccount);
router.route("/user-Auth/login").post(login);
module.exports = router;

const express = require("express");
const { get } = require("mongoose");
const router = express.Router();
const { createInstitute } = require("../UserControllers/signupController");
const govtComplainDisplay = require("../UserControllers/complainDisplay");
router
  .route("/create/institute")
  .get((req, res) => {
    res
      .status(200)
      .json({ message: "welcome back, you are in the right place!!" });
  })
  .post(createInstitute);
router.route("/institute/creation").post(createInstitute);

router.route("/complains").post(govtComplainDisplay);
module.exports = router;

const express = require("express");
const routes = express.Router();
const govtComplainDisplay = require("../UserControllers/complainDisplay");
routes.route("/Complains").get(getComputedStyle);
module.exports = routes;

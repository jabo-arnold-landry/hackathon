const { populate } = require("dotenv");
const { User, Complain, GovInstitute } = require("../Schemas/schema");
const govtComplainDisplay = async (req, res) => {
  const { filter } = req.body;
  const findInstitute = await GovInstitute.findOne({
    instituteName: filter,
  }).populate({
    path: "complains",
    select: "complTitle complBody submittedBy",
    populate: {
      path: "submittedBy",
      select: "names email",
    },
  });
  res.json({ message: findInstitute });
};
const displayComplain = async (req, res, next) => {
  const complains = await Complain.find({});
  if (complains) return res.status(200).json({ message: complains });
  const error = new Error("unexpected error occures");
  error.statusCode = 500;
  return next(error);
};
module.exports = { govtComplainDisplay, displayComplain };

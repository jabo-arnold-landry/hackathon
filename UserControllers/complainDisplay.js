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
  console.log(findInstitute);
  res.json({ message: findInstitute });
};
module.exports = govtComplainDisplay;

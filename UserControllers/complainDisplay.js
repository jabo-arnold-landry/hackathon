const { User, Complain, GovInstitute } = require("../Schemas/schema");
const govtComplainDisplay = async (req, res) => {
  const userInfo = req.user;
  if (userInfo.role === "govmentAgent") {
    try {
      const govtInstute = await GovInstitute.findOne(userInfo.id);
      const institutesComplains = await Complain.find();
    } catch (err) {
      console.log(err);
    }
  }
};

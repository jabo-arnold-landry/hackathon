const { User, Complain, GovInstitute } = require("../Schemas/schema");
const newComplain = async (req, res) => {
  const userInfo = req.user;
  try {
    const { complTitle, complBody, assignedTo } = req.body;
    if (!complTitle || !complBody || !assignedTo) {
      return res
        .status(400)
        .json({ message: "there are must be no empty field(s)!" });
    }
    if (!userInfo || userInfo.role !== "citizen") {
      return res
        .status(403)
        .json({ message: "you are not authorised to use this section" });
    }
    const govtAgent = await GovInstitute.findOne({ instituteName: assignedTo });
    if (!govtAgent)
      return res.status(404).json({ message: "the institute not found" });
    const complainMade = await Complain.create({
      complTitle,
      complBody,
      submittedBy: userInfo.id,
      assignedTo: govtAgent._id,
    });
    await User.findByIdAndUpdate(
      userInfo.id,
      {
        $push: { complains: complainMade._id },
      },
      { new: true }
    );

    await GovInstitute.findByIdAndUpdate(
      govtAgent._id,
      {
        $push: { complains: complainMade._id },
      },
      { new: true }
    );

    return res.status(201).json({ message: `the complain successfuly sent` });
  } catch (err) {
    console.log(err);
  }
};
module.exports = { newComplain };

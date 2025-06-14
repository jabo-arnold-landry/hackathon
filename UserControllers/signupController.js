const { User, RefreshToken, GovInstitute } = require("../Schemas/schema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createAccount = async (req, res) => {
  const { names, email, password } = req.body;
  if (!names || !email || !password) {
    return res.status(400).json({ message: "all fields are mandatory!" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const userCreation = await User.create({
    names,
    email,
    password: hashedPassword,
    roles: req.body.roles,
  });
  res.status(201).json({ message: `welcome ${userCreation.names}!` });
};
function accessToken(user) {
  return jwt.sign(
    {
      userInfo: {
        id: user._id,
        name: user.names,
        email: user.email,
        role: user.roles,
      },
    },
    process.env.JWT_WORD,
    { expiresIn: "4s" }
  );
}
function refrestToken(user) {
  return jwt.sign(
    {
      userInfo: {
        id: user._id,
        name: user.names,
        email: user.email,
        role: user.roles,
      },
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "15s" }
  );
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "fill in the empty fields to continue!" });
    }
    const foundUser = await User.findOne({ email });
    if (foundUser && (await bcrypt.compare(password, foundUser.password))) {
      const token = accessToken(foundUser);
      const refreshedToken = refrestToken(foundUser);
      await RefreshToken.create({
        owner: foundUser._id,
        token: refreshedToken,
        expiresAt: new Date(Date.now() + 15 * 1000),
        userAgent: req.headers["user-agent"],
        ip: req.ip,
      });
      return res.status(200).json({ token, refreshedToken });
    } else {
      return res.status(401).json({
        message: "user email or password is incorrect verify and try agin",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
const createInstitute = async (req, res) => {
  const { instituteName } = req.body;
  if (!instituteName)
    return res.status(400).json({ message: "input required" });
  const instituteCreation = await GovInstitute.create({ instituteName });
  res
    .status(201)
    .json({ message: `${instituteCreation.instituteName}created successfuly` });
};
module.exports = { createAccount, login, createInstitute };

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
    { expiresIn: "1m" }
  );
}
function refreshToken(user) {
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
    { expiresIn: "1d" }
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
      const refreshedToken = refreshToken(foundUser);
      await RefreshToken.create({
        owner: foundUser._id,
        token: refreshedToken,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
        userAgent: req.headers["user-agent"],
        ip: req.ip,
      });
      res.cookie("jwt", refreshedToken, {
        httpOnly: true, //makes inaccessible in javascript console
        secure: false, //makes it secure
        sameSite: "None", // allows cross-site origin
        maxAge: 7 * 24 * 60 * 60 * 1000,
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
const refreshMethod = async (req, res) => {
  const cookies = req.cookies.jwt;
  console.log(cookies);
  if (!cookies) return res.status(401).json({ message: "unauthorized!" });
  const refreshToken = cookies;
  let payload;
  //getting the user data from the payload in refresh token created
  try {
    payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "the session expired" });
  }
  //validtchromeing if the token is valid and issued by our server
  const checkIssuedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!checkIssuedToken)
    return res.status(403).json({ message: "the token is not valid" });
  if (checkIssuedToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ token: checkIssuedToken._id });
    return res.status(403).json({ message: "the token has expired" });
  }
  const user = await User.findOne({ email: payload.userInfo.email });
  accessToken(user);
};
const logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  res.status(200).json({ message: "logged out" });
};
module.exports = {
  createAccount,
  login,
  createInstitute,
  refreshMethod,
  logout,
};

const { User, Complain, GovInstitute } = require("../Schemas/schema");
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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "fill in the empty fields to continue!" });
    }
    const findUser = await User.findOne({ email });
    if (findUser && (await bcrypt.compare(password, findUser.password))) {
      const token = jwt.sign(
        {
          userInfo: {
            name: findUser.names,
            email: findUser.email,
            role: findUser.roles,
          },
        },
        process.env.SCREAT_WORD,
        { expiresIn: "24h" }
      );
      return res.status(200).json({ message: token });
    } else {
      return res.statu(401).json({
        message: "user email or password is incorrect verify and try agin",
      });
    }
  } catch (err) {
    console.log(err);
  }
};
module.exports = { createAccount, login };

const jwt = require("jsonwebtoken");
const authanticatecaUser = (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const parts = authHeader.split(" ");
      if (parts.length === 2 && parts[0] === "Bearer") {
        token = parts[1];
      } else {
        return res.status(401).json({ message: "malformed token" });
      }
      const decodedToken = jwt.verify(token, process.env.JWT_WORD);
      req.user = decodedToken.userInfo;
      //console.log(decodedToken);
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: "the session expired" });
    }
  } else {
    return res.status(401).json({ message: "invalid signup" });
  }
};
module.exports = authanticatecaUser;

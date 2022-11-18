const jwt = require("jsonwebtoken");
const env = require("dotenv");

//verification middleware
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) return res.sendStatus(401); //unauthorized
  const token = authHeader.split(" ")[1]; //extracting token
  // verifying token against access token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token request
    req.user = decoded.UserInfo.username;
    req.roles = decoded.UserInfo.roles;
    next();
  });
};

module.exports = verifyJWT;

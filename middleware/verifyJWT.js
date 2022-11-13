const jwt = require("jsonwebtoken");
const env = require("dotenv");

//verification middleware
const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.sendStatus(401); //unauthorized
  console.log(authHeader); //Bearer token
  const token = authHeader.split(" ")[1]; //extracting token
  // verifying token against access token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403); //invalid token request
    req.user = decoded.username;
    next();
  });
};

module.exports = verifyJWT;

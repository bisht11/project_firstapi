const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// authorization using bcrypt
const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  // checking name and password
  const foundUser = await User.findOne({ username: user }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    const roles = Object.values(foundUser.roles); // get user roles
    // create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles, //sending roles with access token
        },
      },
      process.env.ACCESS_TOkEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOkEN_SECRET,
      { expiresIn: "1d" }
    );
    // invalidate token after user logouts (saving refresh token with current user in DB)
    foundUser.refreshToken = refreshToken;
    const result = await foundUser.save();
    console.log(result);
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true, // only for production env
      maxAge: 24 * 60 * 60 * 1000,
    }); //sending refresh token as a cookie
    res.json({ accessToken }); //sending the access token
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };

const User = require("../model/User");

//logout handler (deletes refreshToken)
const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  //checking for cookies with jwt properties
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;

  // Is refresh token in DB
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }
  //delete refreshtoken in db
  foundUser.refreshToken = ""; //erase token
  const result = await foundUser.save(); // save to DB
  console.log(result);

  res.clearCookie("jwt", { httpOnly: true }); //secure : true - only serves on https
  res.sendStatus(204);
};

module.exports = { handleLogout };

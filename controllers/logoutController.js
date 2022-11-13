const usersDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const fspromises = require("fs").promises;
const path = require("path");

//logout handler
const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  //checking for cookies with jwt properties
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  const refreshToken = cookies.jwt;
  // Is refresh token in DB
  const foundUser = usersDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true });
    return res.sendStatus(204);
  }
  //delete refreshtoken in db
  const OtherUsers = usersDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" }; //blanked refreshtoken
  usersDB.setUsers([...OtherUsers, currentUser]);
  await fspromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(usersDB.users)
  );
  res.clearCookie("jwt", { httpOnly: true }); //secure : true - only serves on https
  res.sendStatus(204);
};

module.exports = { handleLogout };

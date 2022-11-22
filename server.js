require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const connectDB = require("./config/dbConn");
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

//serve static files(CSS)
app.use("/", express.static(path.join(__dirname, "/public")));

// routes (without JWT protection)
app.use("/", require("./routes/root"));
// user register route
app.use("/register", require("./routes/register"));
// user auth route
app.use("/auth", require("./routes/auth"));
// refresh token route (issues a new access token)
app.use("/refresh", require("./routes/refresh"));
// logout route (clearing refreshtoken from db)
app.use("/logout", require("./routes/logout"));

//JWT protected routes
app.use(verifyJWT);
// employees route
app.use("/employees", require("./routes/api/employees"));

// custom 404
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

// custom errorhandler
app.use(errorHandler);

// listening to port
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB"); //prevents connection when something goes wrong 
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // will only work when there is no error
});

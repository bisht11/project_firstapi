const { format } = require("date-fns");
// uuid to generate a unique logger id everytime
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// logger funtion
const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "yyyyMMdd\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    // if dir doesn't exist
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      // create a dir
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    // append data to the newly file
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

// custom middleware for logging data
const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, "reqLog.txt");
  console.log(`${req.method} ${req.path}`);
  next();
};

module.exports = { logger, logEvents };

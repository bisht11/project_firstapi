const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create schema 
const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});

// model - create and export 
module.exports = mongoose.model("Employee", employeeSchema); //collection in DB - employees (lowercase and plural by default)

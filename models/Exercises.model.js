const { Schema, model } = require("mongoose");

const exerciseSchema = new Schema({
  name: {
    type: String,
  },
});

const Exercise = model("Exercise", exerciseSchema);
module.exports = Exercise;

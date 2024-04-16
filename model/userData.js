const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const FHBSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  oldBrews: [
    {
      order: Number,
      date: String,
      menuName: String,
      methodName: String,
      water: String,
      coffee: Number,
      roasting: String,
      grind: String,
    },
  ],
  favourites: [
    {
      favName: String,
      order: Number,
      date: String,
      menuName: String,
      methodName: String,
      water: String,
      coffee: Number,
      roasting: String,
      grind: String,
      description: String,
    },
  ],
});

const FHB = mongoose.model("fhb", FHBSchema, "FHB");

module.exports = FHB;

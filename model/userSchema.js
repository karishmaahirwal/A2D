const mongose = require("mongoose");
const userSchema = new mongose.Schema(
  {
    userId: { type: String },
    userName: { type: String },
    password: { type: String },
    conformPassword: { type: String },

  },
  {
    timestamps: true,
  }
);
module.exports = mongose.model("user", userSchema);

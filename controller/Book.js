const bookidgen = require("bookidgen");
const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const config = require("../config");
const jwt = require("jsonwebtoken");

const moment = require("moment");



// post for Register
const Register = async (req, res) => {
  let { userName, password, conformPassword } = req.body;
  try {
    if (!userName || !password || !conformPassword ) {
      res.json({ message: "enter all data", status: false });
    } else {
      if (password != conformPassword) {
        res.json({ message: "check your password", status: false });
      } else {
        const hashpwd = bcrypt.hashSync(password, 10);
        let userId = bookidgen("UserId", 14522, 199585);
        var obj = await new User({
          userId,
          userName,
          password: hashpwd,
          conformPassword,

        });
        const user = await obj.save();
        if (obj) {
          res.json({ message: "user saved succesfully", status: true });
        } else {
          res.json({ message: "user not saved", status: false });
        }
      }
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};



// post for login
const login = async (req, res) => {
  let { userName, password } = req.body;
  try {
    if (!userName || !password) {
      res.json({ message: "Enter all data", status: false });
    } else {
      const users = await User.findOne({ userName: userName });
      if (!users) {
        res.json({
          msg: "User doesn't exist",
        });
      } else {
        let token = await jwt.sign(
          {
            id: users.userId,
          },
          config.JWT_TOKEN_KEY
        );
        User.token = token;
        var compare = bcrypt.compareSync(password, users.password);
        if (compare === false) {
          res.json({
            message: "Invalid UserName/password",
            status: false,
          });
        } else {
          res.json({ message: "login success", token, status: true });
        }
      }
    }
  } catch (err) {
    res.json({ message: err.message, status: false });
  }
};





module.exports = {
  login,
  Register,
};
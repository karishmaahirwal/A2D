
const bookidgen = require("bookidgen");

const User = require("../model/userSchema");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const config = require("../config");
const jwt = require("jsonwebtoken");

const moment = require("moment");

const book = require("../model/BookSchema");

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

// Post Book
const addBook = async (req, res) => {
  try {
    const {bookName,bookPrice,AuthorName } = req.body;

    let bookId = bookidgen("BOOK", 999999, 9999999);
    if (!bookName || !bookPrice || !AuthorName  ) {
      res.json({ message: "Enter all data", status: false });
    } else {
      const addBook = await book.create({
        
      bookName,
      bookPrice,
      AuthorName,

      

      });

      res.json({
        message: "Book added  successfully",
        status: true,
        
      });
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};


function paginate(arr, page, pageSize) {
  return arr.slice(pageSize * (page - 1), pageSize * page);
}


//Get all Book
const getAllBook = async (req, res) => {
  try {
    const allbook = await book.find({});
    res.json({ BookCollection: allbook, status: true });
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

function paginate(arr, page, pageSize) {
  return arr.slice(pageSize * (page - 1), pageSize * page);
}

const getAllBooks = async (req, res, next) => {

  try {
            let { page, size } = req.query;
    
            if (!page) {
                page = 1;
            }
            if (!size) {
                size = 10;
            }
            const limit = parseInt(size);
            const skip = (page - 1) * size

    
            const user = await book.find().limit(limit).skip(skip)
            res.send({
                page,
                size,
                Info: user,
            });
        }
        catch (error) {
            res.sendStatus(500);
        }
};

const getParticularBookByAuthor = async (req, res, next) => {
  let { authorName } = req.params;
  try {
    if (!authorName) {
      res.json({ message: "Enter authorName", status: false });
    } else {
      const data = await book.findOne({ AuthorName: authorName });
      if (!data) {
        res.json({ message: "Book not found", status: false });
      } else {
        res.json({ message: "Book found", status: true, data: data });
      }
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};


//Delete Book
const deleteBook = async (req, res) => {
  try {
    const bookRemove = await book.findOneAndDelete({ _id: req.params.id });

    if (bookRemove) {
      res.json({ message: "book deleted successfully", status: true });
    } else {
      res.json({
        message: "book cannot be found. Enter correct id to delete",
        status: false,
      });
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

// Patch Book
const patchBook = async (req, res) => {
  const {bookName,bookPrice,AuthorName } = req.body;

  try {
    if (!bookName || !bookPrice || !AuthorName) {
      res.json({ message: "Enter all data", status: false });
    } else {
      const BookEdit = await book.findOneAndUpdate(
        { _id: req.params.id },
        {
          bookName,
          bookPrice,
          AuthorName,
        }
      );

      if (BookEdit) {
        res.json({ message: "book updated successfullly", status: true });
      } else {
        res.json({
          message: "book cannot be found. Enter correct id to edit",
          status: false,
        });
      }
    }
  } catch (error) {
    res.json({ message: error.message, status: false });
  }
};

module.exports = {
  login,
  Register,
  addBook,
  getAllBook,
  deleteBook,
  patchBook,
  getParticularBookByAuthor,
  getAllBooks,

};
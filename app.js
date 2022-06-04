const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const app = express();
const config = require("./config");
const Book = require("./router/Book");



// security
app.use(helmet());

// cors
app.use(cors());

// convert everything to json
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// mongodb database connect 
mongoose
  .connect(
    "mongodb+srv://karishma:keema12345678@a2d.teulr4a.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("mongodb connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("success"));
app.use("/api", Book);




module.exports = app;

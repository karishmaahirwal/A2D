const express = require("express");
const router = express.Router();
const Book = require("../controller/Book")
const auth = require("../auth/adminMiddleware");




// post Register from Books
router.post("/register", Book.Register);
// post login from Books
router.post("/login", Book.login);



module.exports = router;

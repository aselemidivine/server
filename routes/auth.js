const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET} = require('../keys');



// ROUTE TO SIGNUP
router.post("/signup", (req, res) => {
  // console.log(req.body)
  const { name, email, password } = req.body;
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all the fields" });
  }

  // QUERRYING THE DATABASE TO FIND USERS WITH THE EMAIL
  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res
          .status(422)
          .json({ error: "User already exist with that email!" });
      }

      // WE NEED TO HASH THE PASSWORD BEFORE CREATING THE USER
      bcrypt
        .hash(password, 12) // NUMBER OF PASSWORD MUSNT BE LESS THAN 12
        .then((hashedPassword) => {
          const user = new User({
            email,
            password: hashedPassword,
            name,
          });
          user
            .save() //CREATED A NEW USER AND SAVED IN THE DB
            .then((user) => {
              res.json({ message: "User saved successfully" });
            })
            .catch((err) => {
              console.log(err);
            });
        });
    })
    .catch((err) => {
      console.log(err);
    });
});


// ROUTE TO SIGNIN
router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(422).json({ error: "Please add email or password" });
  }

  // Find one user email from the Database
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "Invalid email or password" });
    }
    // If there is a user in the DB, use bcrypt to compare the password that is saved in the Db.
    bcrypt.compare(password, savedUser.password).then((doMatch) => {
      if (doMatch) {
        // res.json({ message: "Successfully signed in" });
        const token = jwt.sign({_id:savedUser._id}, JWT_SECRET)
        res.json({ token})
      } else {
        res.status(422).json({ error: "Please add email or password" });
      }
    })
    .catch((error) => { 
      console.log(err)
    })
  })
})

router.get('/protected', (req, res) => {
  res.send("hello world");
})


module.exports = router;

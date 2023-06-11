const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");


// USE THE MIDDLEWARE TO MAKE IT A PROTECTED ROUTE. ONLY USERS CAN CREATE POSTS
router.post('/createpost', requireLogin, (req, res) => {
    const { title, body } = req.body
    if (!title || !body) {

        res.send(422).json({error: "Please add all the fields"})
     }

    //  WE DON'T WANT TO STORE THE PASSWORD IN THE DB
     req.user.password = undefined
    
     const post = new Post({
        title, 
        body, 
        postedBy: req.user
     })

    //  SAVEPOST IN THE DB
     post.save().then(result => {
        res.json({post: result})
     })
     .catch(err => {
        console.log(err)
     })
})

module.exports = router 
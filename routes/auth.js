const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hasshedPassword = await bcrypt.hash(req.body.password, salt); // 새로운 비밀번호 생성

        // create new user
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hasshedPassword,
        });

        // save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
    }
})

module.exports = router;
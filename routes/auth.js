const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//REGISTER
router.post("/register", async (req, res) => {
    try {
        // generate new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt); // 새로운 비밀번호 생성

        // create new user
        const newUser = await new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword,
        });

        // save user and return response
        const user = await newUser.save();
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
});

//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        !user && res.status(404).send("user not found");

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(404).json("wrong password");

        res.status(200).json(user); // 성공시 user를 반환한다
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})
module.exports = router;
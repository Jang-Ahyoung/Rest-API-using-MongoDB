const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// UPDATE USER
router.put("/:id", async (req, res) => {
    // userid가 일치할 경우에만 사용자 계정을 업데이트, 삭제할 수 있도록
    if (req.body.userId === req.params.id || req.user.isAdmin) {
        if (req.body.password) { // body 안에 pw를 포함해 보내면 해시처리하여 요청 암호를 업데이트한다.
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch (err) { return res.status(500).json(err) }
        }
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body });
            res.status(200).json("Account has been update");
        } catch (err) { return res.status(500).json(err) }
    } else { return res.status(403).json("You can update only your account"); }
})

// DELETE USER

// GET A USER

// FOLLOW A USER

// UNFOLLOW USER
module.exports = router;
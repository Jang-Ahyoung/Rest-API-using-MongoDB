const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");

// UPDATE USER
router.put("/:id", async (req, res) => {
    // userid가 일치할 경우에만 사용자 계정을 업데이트, 삭제할 수 있도록
    if (req.body.userId === req.params.id || req.body.isAdmin) {
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
router.delete("/:id", async (req, res) => {
    // userid가 일치할 경우에만 사용자 계정을 업데이트, 삭제할 수 있도록
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        } catch (err) { return res.status(500).json(err) }
    }
    else {
        return res.status(403).json("You can delete only your account");
    }
})

// GET A USER
router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, updatedAt, ...other } = user._doc; // 2가지 변수 제외하고 받아와
        res.status(200).json(other);
    } catch (err) {
        res.status(500).json(err);
    }
})
// FOLLOW A USER
router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.parmas.id); // 해당 id 가진 user 찾을때까지 기다리기
            const currentUser = await User.findById(req.body.userId);
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({ $push: { followers: req.body.userId } });
                await currentUser.updateOne({ $push: { followings: req.body.userId } }); // 팔로우 요청 시도 사용자
                res.status(200).json("Use has been followed");
            } else {
                res.status(403).json("Already following");
            }
        } catch (err) { res.status(500).json(err) }

    } else {
        res.status(403).json("You can't follow yourself");
    }
})
// UNFOLLOW USER
module.exports = router;
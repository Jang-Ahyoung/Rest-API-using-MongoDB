// router 선언 & export
const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

// create a post
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {// create new one
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err);
    }
})

// update a post
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id); // postId로 해당 포스트 정보를 받아오고
        if (post.userId === req.body.userId) { // 사용자 id를 비교
            await post.updateOne({ $set: req.body });
            res.status(200).json("post has been updated");
        } else {
            res.status(403).json("you can update only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})
// delete a post
router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.deleteOne();
            res.status(200).json("post has been deleted");
        } else {
            res.status(403).json("you can delete only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

// like&dislike a post
router.put("/:id/like", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({ $push: { likes: req.body.userId } });
            res.status(200).json("post has been like");
        } else {
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("The post has been disliked");
        }
    } catch (err) {
        res.status(500).json(err);
    }
})

// get a post
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json(err);
    }
})

// get user's timeline posts
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id });
        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;

// get timeline posts (all following user's)
router.get("/timeline/:userId", async (req, res) => {
    try { // 루프를 사용할 경우 await 대신 Promise.all 사용
        const currentUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({ userId: currentUser._id }); // 사용자가 작성한 게시물
        const friendPosts = await Promise.all(  // 팔로잉된 친구 게시물
            currentUser.followings.map((friendId) => {
                return Post.find({ userId: friendId }); // 각각의 게시물을 friendPosts 배열 안으로 반환시켜줄것! return 필요
            })
        )
        res.status(200).json(userPosts.concat(...friendPosts)); // 모든 friendPosts 포스트를 가져와 userPosts와 결합
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
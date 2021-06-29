const router = require("express").Router();
router.get("/", (req, res) => {
    res.send("AuthRouter");
})

module.exports = router;
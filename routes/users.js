const router = require("express").Router();
router.get("/", (req, res) => {
    res.send("UserRouter");
})

module.exports = router;
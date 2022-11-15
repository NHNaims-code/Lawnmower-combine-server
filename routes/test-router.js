const express = require("express");
const router = express.Router();

router.get("/", function(req, res, next) {
    res.status(200).json({
        success: true,
        message: "Ping successful"
    });
});

module.exports = router;
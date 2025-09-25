const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post("/:serviceId/rate", isAuthenticated, ratingController.createRating);

module.exports = router;

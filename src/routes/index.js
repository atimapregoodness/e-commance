// src/routes/index.js
const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

router.get("/", async (req, res) => {
  const services = await Service.find().limit(8).lean();
  res.render("index", { services });
});

module.exports = router;

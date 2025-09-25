// src/routes/services.js
const express = require("express");
const router = express.Router();
const Service = require("../models/Service");

// list services
router.get("/", async (req, res) => {
  const services = await Service.find().lean();
  res.render("services/index", { services });
});

// show single service
router.get("/:id", async (req, res) => {
  const service = await Service.findById(req.params.id).lean();
  if (!service) return res.redirect("/services");
  res.render("services/show", { service });
});

module.exports = router;

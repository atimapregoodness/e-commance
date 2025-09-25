// src/routes/bookings.js
const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Service = require("../models/Service");

function ensureAuth(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.flash("error", "You must be signed in");
  res.redirect("/auth/login");
}

// new booking form
router.get("/new/:serviceId", ensureAuth, async (req, res) => {
  const service = await Service.findById(req.params.serviceId).lean();
  res.render("bookings/new", { service });
});

// create booking
router.post("/", ensureAuth, async (req, res) => {
  const { serviceId, appointmentDate, notes } = req.body;
  const booking = new Booking({
    user: req.user._id,
    service: serviceId,
    appointmentDate,
    notes,
    status: "pending",
  });
  await booking.save();
  req.flash(
    "success",
    "Booking created. Please make N10,000 deposit to complete booking (details on site)."
  );
  res.redirect("/user/profile");
});

module.exports = router;

// src/routes/admin.js
const express = require("express");
const router = express.Router();
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const { upload } = require("../config/cloudinary");

// admin guard
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === "admin") return next();
  req.flash("error", "Admin only");
  res.redirect("/auth/login");
}

// dashboard
router.get("/", ensureAdmin, async (req, res) => {
  const bookings = await Booking.find()
    .populate("user service")
    .sort({ createdAt: -1 })
    .lean();
  const services = await Service.find().sort({ createdAt: -1 }).lean();
  res.render("admin/dashboard", { bookings, services });
});

// create service form
router.get("/services/new", ensureAdmin, (req, res) =>
  res.render("admin/newService")
);

// create service action (with cloudinary upload)
router.post(
  "/services",
  ensureAdmin,
  upload.single("image"),
  async (req, res) => {
    const { title, description, price, durationMins } = req.body;
    const service = new Service({
      title,
      description,
      price: Number(price),
      durationMins: Number(durationMins),
      createdBy: req.user._id,
    });
    if (req.file && req.file.path) {
      service.image = { url: req.file.path, public_id: req.file.filename };
    }
    await service.save();
    req.flash("success", "Service created");
    res.redirect("/admin");
  }
);

// reply to booking
router.post("/bookings/:id/reply", ensureAdmin, async (req, res) => {
  const { reply, status } = req.body;
  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    req.flash("error", "Booking not found");
    return res.redirect("/admin");
  }
  booking.adminReply = reply;
  if (status) booking.status = status;
  await booking.save();
  req.flash("success", "Replied to booking");
  res.redirect("/admin");
});

module.exports = router;

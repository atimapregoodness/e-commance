const Booking = require("../models/Booking");
const Service = require("../models/Service");
const upload = require("../middlewares/uploadMiddleware");

exports.getBookingForm = async (req, res) => {
  const service = await Service.findById(req.params.serviceId);
  res.render("pages/bookingForm", { service });
};

exports.createBooking = async (req, res) => {
  const { date, time } = req.body;
  const depositProof = req.file ? req.file.path : "";
  const booking = new Booking({
    user: req.user.id,
    service: req.params.serviceId,
    date,
    time,
    depositProof,
  });
  await booking.save();
  res.redirect("/profile");
};

exports.getUserBookings = async (req, res) => {
  const bookings = await Booking.find({ user: req.user.id }).populate(
    "service"
  );
  res.render("pages/profile", { bookings }); // Assume profile shows bookings
};

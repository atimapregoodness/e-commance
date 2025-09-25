const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Contact = require("../models/Contact");

exports.getDashboard = async (req, res) => {
  const bookings = await Booking.find().populate("user service");
  const services = await Service.find();
  const contacts = await Contact.find();
  res.render("pages/adminDashboard", { bookings, services, contacts });
};

exports.replyToBooking = async (req, res) => {
  const { reply } = req.body;
  await Booking.findByIdAndUpdate(req.params.id, { reply });
  res.redirect("/admin/bookings");
};

exports.getAdminServices = async (req, res) => {
  const services = await Service.find();
  res.render("pages/adminServices", { services });
};

exports.getAdminBookings = async (req, res) => {
  const bookings = await Booking.find().populate("user service");
  res.render("pages/adminBookings", { bookings });
};

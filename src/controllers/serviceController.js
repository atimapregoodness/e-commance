const Service = require("../models/Service");
const upload = require("../middlewares/uploadMiddleware");

exports.getServices = async (req, res) => {
  const services = await Service.find();
  res.render("pages/services", { services });
};

exports.getServiceDetail = async (req, res) => {
  const service = await Service.findById(req.params.id).populate("ratings");
  res.render("pages/serviceDetail", { service });
};

exports.createService = async (req, res) => {
  const { name, description, price } = req.body;
  const image = req.file ? req.file.path : "";
  const service = new Service({ name, description, price, image });
  await service.save();
  res.redirect("/admin/services");
};

exports.updateService = async (req, res) => {
  const { name, description, price } = req.body;
  const updateData = { name, description, price };
  if (req.file) updateData.image = req.file.path;
  await Service.findByIdAndUpdate(req.params.id, updateData);
  res.redirect("/admin/services");
};

exports.deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.redirect("/admin/services");
};

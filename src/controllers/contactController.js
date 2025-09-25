const Contact = require("../models/Contact");

exports.getContact = (req, res) => {
  res.render("pages/contact");
};

exports.createContact = async (req, res) => {
  const { name, email, message } = req.body;
  const contact = new Contact({ name, email, message });
  await contact.save();
  res.redirect("/contact");
};

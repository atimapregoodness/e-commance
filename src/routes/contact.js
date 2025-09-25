// src/routes/contact.js
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.get("/", (req, res) => res.render("contact"));

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;
  // configure transporter using env vars
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: process.env.FROM_EMAIL,
    subject: `Contact Form: ${name}`,
    text: `${name} (${email}) says:\n\n${message}`,
  });

  req.flash("success", "Message sent. We'll reply soon.");
  res.redirect("/contact");
});

module.exports = router;

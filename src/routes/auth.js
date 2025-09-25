// src/routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

// register
router.get("/register", (req, res) => res.render("auth/register"));
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  if (!name || !email || !password || password !== password2) {
    req.flash("error", "All fields are required and passwords must match");
    return res.redirect("/auth/register");
  }
  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    req.flash("error", "Email already registered");
    return res.redirect("/auth/register");
  }
  const hashed = await bcrypt.hash(password, 12);
  const user = new User({ name, email: email.toLowerCase(), password: hashed });
  await user.save();
  req.flash("success", "Account created. Please login.");
  res.redirect("/auth/login");
});

// login
router.get("/login", (req, res) => res.render("auth/login"));
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
  }),
  (req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect("/"); // or req.session.returnTo
  }
);

// logout
router.get("/logout", (req, res) => {
  req.logout(() => {});
  req.flash("success", "Logged out");
  res.redirect("/");
});

module.exports = router;

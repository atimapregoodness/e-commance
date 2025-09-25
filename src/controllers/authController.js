const User = require("../models/User");
const jwt = require("jsonwebtoken");
const flash = require("connect-flash");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = new User({ name, email, password });
    await user.save();
    req.flash("success", "Registration successful. Please login.");
    res.redirect("/login");
  } catch (err) {
    req.flash("error", "Error registering user.");
    res.redirect("/register");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      req.flash("error", "Invalid credentials.");
      return res.redirect("/login");
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    req.session.token = token;
    res.redirect(user.role === "admin" ? "/admin/dashboard" : "/");
  } catch (err) {
    req.flash("error", "Error logging in.");
    res.redirect("/login");
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/");
};

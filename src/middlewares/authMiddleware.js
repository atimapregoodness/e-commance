const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.isAuthenticated = (req, res, next) => {
  const token = req.session.token;
  if (!token) return res.redirect("/login");
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.redirect("/login");
  }
};

exports.isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (user.role !== "admin") return res.status(403).send("Access denied");
  next();
};

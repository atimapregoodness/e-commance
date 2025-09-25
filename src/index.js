if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const passport = require("passport");
const ejsMate = require("ejs-mate");
const serverless = require("serverless-http");

const app = express();

/* ------------------ Database Connection ------------------ */
(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (e) {
    console.error("❌ MongoDB connection error:", e.message);
    process.exit(1); // Stop app if DB fails
  }
})();

/* ------------------ View Engine ------------------ */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ------------------ Security Middlewares ------------------ */
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xssClean());

/* ------------------ Static Files ------------------ */
app.use(express.static(path.join(__dirname, "../public")));

/* ------------------ Logging & Overrides ------------------ */
app.use(morgan("dev"));
app.use(methodOverride("_method"));

/* ------------------ Sessions ------------------ */
app.use(
  session({
    name: "gsess",
    secret: process.env.SESSION_SECRET || "change_me",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // only https in prod
    },
  })
);

app.use(flash());

/* ------------------ Passport ------------------ */
require("./config/passportConfig")(passport);
app.use(passport.initialize());
app.use(passport.session());

/* ------------------ Locals for Views ------------------ */
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.success = req.flash("success") || [];
  res.locals.error = req.flash("error") || [];
  res.locals.currentPage = req.path;
  res.locals.brandName = "GloriousStylist";

  res.locals.siteInfo = {
    address: "47b Adebayo Doherty Road, Lekki Phase 1, Lagos",
    bookingPolicy:
      "Upon booking, kindly make a ₦10,000 non-refundable deposit to Opay, 8149280058 (Ototomo Gloria Iruoghene). Send receipt & deliver wig 2 days before appointment day to 08149280058 (WhatsApp). ₦10,000/30mins lateness fee applies.",
    cancellationPolicy:
      "You can cancel or reschedule up to 6 hours before the appointment time.",
  };
  next();
});

/* ------------------ Config ------------------ */
require("./config/cloudinary");

/* ------------------ Routes ------------------ */
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/services", require("./routes/services"));
app.use("/bookings", require("./routes/bookings"));
app.use("/admin", require("./routes/admin"));
app.use("/contact", require("./routes/contact"));

/* ------------------ 404 Handler ------------------ */
app.use((req, res, next) => {
  const err = new Error("Page not found");
  err.status = 404;
  next(err);
});

/* ------------------ Error Handler ------------------ */
app.use((err, req, res, next) => {
  console.error("❌ Error:", err);
  const status = err.status || 500;
  res.status(status);

  try {
    res.render("layout/error", {
      status,
      message: err.message || "Server Error",
    });
  } catch (renderErr) {
    // fallback in case EJS fails
    res.type("txt").send(`${status} | ${err.message}`);
  }
});

/* ------------------ Local Server ------------------ */
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Server running at http://localhost:${PORT}`)
  );
}

/* ------------------ Serverless Export ------------------ */
module.exports = app;
module.exports.handler = serverless(app);

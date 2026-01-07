if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const helmet = require("helmet"); // <-- NEW

// Routes
const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");

// Auth
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const app = express();

// MongoDB connection
mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log(err));

// View engine
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", "https://api.mapbox.com"],
      scriptSrc: ["'self'", "https://api.mapbox.com", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://api.mapbox.com", "https://cdn.jsdelivr.net"],
      imgSrc: ["'self'", "blob:", "data:", "https://res.cloudinary.com/"],
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
    },
  })
); // <-- NEW Helmet + CSP

// Session config ✅ enhanced security
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only HTTPS in production
    sameSite: "lax", // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000 // 1 week
  }
};

app.use(session(sessionConfig));


app.use(session(sessionConfig));
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// GLOBAL LOCALS
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// Routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

// Home
app.get("/", (req, res) => {
  res.redirect("/listings");
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.log("🔥 ERROR CAUGHT FULL:", err);
  res.status(500).send(typeof err === "object" ? JSON.stringify(err, null, 2) : err);
});

// Server
app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});

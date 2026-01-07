if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const helmet = require("helmet");
const ExpressError = require("./utils/ExpressError");

const listings = require("./routes/listings.js");
const reviews = require("./routes/review.js");
const users = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const app = express();

/* -------------------- DATABASE -------------------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/wanderlust")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.log(err));

/* -------------------- VIEW ENGINE -------------------- */
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* -------------------- MIDDLEWARE -------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

/* -------------------- HELMET (IMAGES + ICONS FIXED) -------------------- */
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],

      connectSrc: [
        "'self'",
        "https://api.mapbox.com",
        "https://events.mapbox.com",
        "https://cdn.jsdelivr.net"
      ],

      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://kit.fontawesome.com",
        "https://api.mapbox.com"
      ],

      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://api.mapbox.com"
      ],

      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://res.cloudinary.com",
        "https://images.unsplash.com",
        "https://plus.unsplash.com"
      ],

      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com",
        "https://ka-f.fontawesome.com"
      ],

      objectSrc: [],
    },
  })
);



/* -------------------- SESSION -------------------- */
const sessionConfig = {
  secret: process.env.SESSION_SECRET || "mysupersecretcode",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  },
};

app.use(session(sessionConfig));
app.use(flash());

/* -------------------- PASSPORT -------------------- */
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* -------------------- GLOBAL LOCALS -------------------- */
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

/* -------------------- ROUTES -------------------- */
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

app.get("/", (req, res) => {
  res.redirect("/listings");
});

/* -------------------- 404 -------------------- */
app.use((req, res, next) => {
  next(new ExpressError("Page Not Found", 404));
});

/* -------------------- ERROR HANDLER -------------------- */
app.use((err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).render("error", { err });
});

/* -------------------- SERVER -------------------- */
app.listen(8080, () => {
  console.log("🚀 Server running on port 8080");
});

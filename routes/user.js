const express = require("express");
const router = express.Router();
const passport = require("passport");
const usersController = require("../controllers/user");
const { saveRedirectUrl } = require("../middleware");

// SIGNUP
router
  .route("/signup")
  .get(usersController.renderSignupForm)
  .post(usersController.signup);

// LOGIN
router
  .route("/login")
  .get(usersController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login"
    }),
    usersController.login
  );

// LOGOUT
router.get("/logout", usersController.logout);

module.exports = router;

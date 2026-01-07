const User = require("../models/user");

// signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};

// signup logic
module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email });

    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash("success", "Welcome to WanderLust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

// login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};

// login logic
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listings");
};

// logout
module.exports.logout = (req, res) => {
  req.logout(() => {
    req.flash("success", "Logged out successfully!");
    res.redirect("/listings");
  });
};

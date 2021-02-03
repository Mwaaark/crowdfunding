const User = require("../models/user");

module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};
module.exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "You have been successfully registered!");
      res.redirect("/projects");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

module.exports.login = (req, res) => {
  req.flash("success", `Hi ${req.user.username}! Welcome to Crowdfunding!`);
  const redirectUrl = req.session.returnTo || "/projects";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You have successfully logged out!");
  res.redirect("/projects");
};

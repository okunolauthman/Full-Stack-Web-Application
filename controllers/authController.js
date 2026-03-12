const User = require("../models/User");
const bcrypt = require("bcryptjs");

exports.showLogin = (req, res) => {
  res.render("login", { message: "", flag: "" });
};

exports.login = async (req, res) => {
  const { userid, password } = req.body;
  const user = await User.findOne({ userid });

  if (!user) return res.render("login", { message: "Invalid Login", flag: "" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.render("login", { message: "Invalid Login", flag: "" });

  req.session.userid = userid;
  res.redirect("/index");
};

exports.register = async (req, res) => {
  const { userid, password, password2 } = req.body;

  if (password !== password2)
    return res.render("register", { message: "Passwords Do Not Match", flag: "" });

  const exists = await User.findOne({ userid });
  if (exists)
    return res.render("register", { message: "User Already Exists", flag: "" });

  const hash = await bcrypt.hash(password, 10);
  await User.create({ userid, password: hash });

  res.render("login", { message: "Registration Successful", flag: "" });
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect("/login");
};

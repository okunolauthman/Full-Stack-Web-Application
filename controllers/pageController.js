exports.home = (req, res) => {
  res.render("index", {
    title: "Home"
  });
};
exports.about = (req, res) => {
  res.render("about");
};

exports.contact = (req, res) => {
  res.render("contact");
};

exports.shop = (req, res) => {
  res.redirect("products");
};



exports.contactReply = (req, res) => {
  res.render("contactreply");
};

exports.end = (req, res) => {
  res.render("end");
};

exports.login = (req, res) => {
  res.render("login", { message: "", flag: "" });
};

exports.register = (req, res) => {
  res.render("register", { message: "", flag: "" });
};

exports.logoff = (req, res) => {
  res.render("logoff");
};

exports.cart = (req, res) => {
  if (!req.session.userid) {
    return res.redirect("/login");
  }
  res.render("cart");
};

exports.checkout = (req, res) => {
  if (!req.session.userid) {
    return res.redirect("/login");
  }
  res.render("checkout");
};


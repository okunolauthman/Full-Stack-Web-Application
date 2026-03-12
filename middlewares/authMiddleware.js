module.exports = (req, res, next) => {
  if (!req.session.userid) {
    return res.render("login", { message: "Session expired", flag: "" });
  }
  next();
};

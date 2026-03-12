const router = require("express").Router();
const auth = require("../controllers/authController");

router.get("/login", auth.showLogin);
router.post("/login", auth.login);
router.get("/register", (req, res) => res.render("register"));
router.post("/register", auth.register);
router.get("/logout", auth.logout);

module.exports = router;

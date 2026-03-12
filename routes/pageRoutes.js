const express = require("express");
const router = express.Router();
const pageController = require("../controllers/pageController");

// Pages routes
router.get("/", pageController.home);
router.get("/about", pageController.about);
router.get("/contact", pageController.contact);
router.get("/shop", pageController.shop);
router.get("/contactreply", pageController.contactReply);
router.get("/end", pageController.end);
router.get("/login", pageController.login);
router.get("/register", pageController.register);
router.get("/logoff", pageController.logoff);
router.get("/cart", pageController.cart);
router.get("/checkout", pageController.checkout);

module.exports = router;

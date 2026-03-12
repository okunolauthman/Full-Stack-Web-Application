const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const cart = require("../controllers/cartController");

router.post("/api/cart", auth, cart.saveCart);

module.exports = router;

const router = require("express").Router();
const auth = require("../middlewares/authMiddleware");
const catalogController = require("../controllers/catalogController");

router.get("/products", auth, catalogController.getProducts);

module.exports = router;

const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema({
  title: String,
  price: String,
  productImg: String,
  quantity: Number,
  userId: String
});

module.exports = mongoose.model("CartItem", CartItemSchema);

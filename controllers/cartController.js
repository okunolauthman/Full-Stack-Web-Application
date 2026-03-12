const CartItem = require("../models/CartItem");

exports.saveCart = async (req, res) => {
  const userId = req.session.userid;
  const { cartItems } = req.body;

  cartItems.forEach(item => item.userId = userId);

  await CartItem.create(cartItems);

  res.status(201).json({ message: "Cart items saved successfully" });
};

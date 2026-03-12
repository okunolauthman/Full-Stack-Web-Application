const mongoose = require("mongoose");

const CatalogSchema = new mongoose.Schema({
  code: String,
  name: String,
  price: Number,
  quantity: Number
});

module.exports = mongoose.model("Catalog", CatalogSchema);

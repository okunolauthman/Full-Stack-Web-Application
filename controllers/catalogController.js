const Catalog = require("../models/Catalog");

exports.getProducts = async (req, res) => {
  const data = await Catalog.find({});
  
  let catalogHTML = "";
  data.forEach(item => {
    const img = "/Products/" + item.code + ".jpeg";
    catalogHTML += `
      <div class="product-box">
        <img src="${img}" alt="${item.name}" class="product-img">
        <h2 class="product-title">${item.name}</h2>
        <span class="price">${item.price}</span>
        <i class='bx bxs-cart add-cart'></i>
      </div>
    `;
  });

  res.render("products", {
    catalog: catalogHTML,
    flag: "1",
    message: ""
  });
};

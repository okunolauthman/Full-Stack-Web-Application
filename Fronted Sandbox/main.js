let cartIcon = document.querySelector('#cart-icon');
let cart = document.querySelector('.cart');

// Retrieve cart items from local storage
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

// JS functionality only activates after the document is loaded or is ready
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready);
} 
else {
  ready();
}


function ready() {
  var removeCartButtons = document.getElementsByClassName('cart-remove');
  for (var i = 0; i < removeCartButtons.length; i++) {
    var button = removeCartButtons[i];
    button.addEventListener('click', removeCartItem);//removeCartItem is a function defined elsewhere.
   }

  //Quantity Value for Items
  var quantityInputs = document.getElementsByClassName('cart-quantity');
  for (var i = 0; i < quantityInputs.length; i++) {
    var input = quantityInputs[i];
    input.addEventListener('change', quantityChanged);//quantityChanged is a function defined elsewhere
  }
 
  //Adding to the cart
  var addCart = document.getElementsByClassName('add-cart');
  for (var i = 0; i < addCart.length; i++) {
    var button = addCart[i];
    button.addEventListener('click', addCartClicked);//addCartClicked is a function
  }

  //Buy Button
  document.getElementsByClassName('btn-buy')[0].addEventListener('click', buybuttonClicked);

  updateCart();
}///////////////////////////

//BuyButton for cart
function buybuttonClicked() {
  
 // alert('Your Order is Placed');

  //cartItems = [];//clears the cart

  saveCartItemsToLocalStorage();
  updateCart();
}

//Remove Items from cart
function removeCartItem(event) {
  var buttonClicked = event.target; //retrieves removecartbutton that was clicked & assigns to the variable.
  var cartBox = buttonClicked.parentElement.parentElement; // Get the grandparent element of the remove button(entire cart item)
  var index = Array.from(cartBox.parentElement.children).indexOf(cartBox); // Determine the index of the cart item within its parent's children
  cartItems.splice(index, 1); // Remove the cart item from the cartItems array using the determined index

  saveCartItemsToLocalStorage();
  updateCart();
}

//Quantity Changes
function quantityChanged(event) {
// Get the input element (presumably representing the quantity) that triggered the event
  var input = event.target;
  var input = event.target;
  var cartBox = input.parentElement.parentElement;
  var index = Array.from(cartBox.parentElement.children).indexOf(cartBox);
  
  // Update the quantity of the corresponding cart item in the cartItems array
  cartItems[index].quantity = input.value;
  saveCartItemsToLocalStorage();
  updateCart();
}

//Add to cart
function addCartClicked(event) {//setup the title,price & product image that will be shown in the cart page
  var button = event.target;
  var shopProducts = button.parentElement;
  var title = shopProducts.querySelector('.product-title').innerText;
  var price = shopProducts.querySelector('.price').innerText;
  var productImg = shopProducts.querySelector('.product-img').src;//Retrieve the source URL of the elemnt with class 'product-img'
  var quantity = 1;

  //Error Handling
  for (var i = 0; i < cartItems.length; i++) {
    if (cartItems[i].title === title) {
      alert('You have already added this item to the cart');
      return;
    }
  }
  // Create a new item object with the properties below
  var newItem = { title: title, price: price, productImg: productImg, quantity: quantity };
  cartItems.push(newItem);

  saveCartItemsToLocalStorage();
  updateCart();
}

function saveCartItemsToLocalStorage() {
  localStorage.setItem('cartItems', JSON.stringify(cartItems));
}

function updateCart() {
  var cartContent = document.querySelector('.cart-content');
  cartContent.innerHTML = '';

  cartItems.forEach(function (item, index) {
    var cartBox = document.createElement('div');
    cartBox.classList.add('cart-box');

    var cartBoxContent = `
      <img src="${item.productImg}" alt="" class="cart-img">
      <div class="detail-box">
        <div class="cart-product-title">${item.title}</div>
        <div class="cart-price">${item.price}</div>
        <input type="number" value="${item.quantity}" class="cart-quantity">
      </div>
      <i class='bx bxs-trash-alt cart-remove'></i>
    `;
    // Set the HTML content to the cartBox element
    cartBox.innerHTML = cartBoxContent;
    cartContent.appendChild(cartBox);

    cartBox.querySelector('.cart-remove').addEventListener('click', function () {
      removeCartItem(index);
    });

    cartBox.querySelector('.cart-quantity').addEventListener('change', function (event) {
      quantityChanged(event, index);
    });
  });

  updatetotal();
}

function removeCartItem(index) {
// Remove one item from the cartItems array at the specified index
  cartItems.splice(index, 1);
  saveCartItemsToLocalStorage();
  updateCart();
}

function quantityChanged(event, index) {
  var input = event.target;
 // Update the quantity of the corresponding item in the cartItems array
  cartItems[index].quantity = input.value;
  saveCartItemsToLocalStorage();
  updateCart();
}

function updatetotal() {
  var total = 0;
  cartItems.forEach(function (item) {
    var price = parseFloat(item.price.replace('$', ''));
    var quantity = parseInt(item.quantity);
    total += price * quantity;
  });

  total = Math.round(total * 100) / 100;
  document.querySelector('.total-price').innerText = '$' + total;
}


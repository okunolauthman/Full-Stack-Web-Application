const getJSONString = function (obj) {
  return JSON.stringify(obj, null, 2);
};
const express = require("express");
const bcrypt = require("bcryptjs");
const app = express();

const layout = require("express-ejs-layouts");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(layout);

var bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
app.use(
  session({
    secret: "1234567",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());

//////////////////////////////////////////////////////////////////////////////////

var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb+srv://okunolauthman:FP2sY3vZhneNBZQm@cluster0.9liicgv.mongodb.net/cis485",
  { useUnifiedTopology: true, useNewUrlParser: true }
);

///Schema
var loginSchema = new mongoose.Schema({
  userid: String,
  password: String,
});


const cartItemSchema = new mongoose.Schema({
  title: String,
  price: String,
  productImg: String,
  quantity: Number,
  userId: String,
});

var catalogSchema = new mongoose.Schema({
  code: String,// code is the name of the img files rendered 
  name: String,
  price: Number,
  quantity: Number,
});

mongoose.pluralize(null);

var User = mongoose.model("login", loginSchema);
const CartItem = mongoose.model('CartItem', cartItemSchema);

var Catalog = mongoose.model("catalog", catalogSchema);

////////////////////////////////////////////////////////////////////////////

// Authentication middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.userId ? true : false;
  next();
});

//Middleware log 
app.use((req, res, next) => {
  console.log(`request made to: ${req.url}`);
  next();
});

// Route (first thing that renders is login page)
app.get('/', (req, res) => {
  res.render('login.ejs', { message: "", flag: "" });
});

//////////////////////////////////////////////////////////////////////
            /*LOGIN PAGE*/
app.get("/login", function (req, res) {
  res.render("login.ejs", { message: "", flag: "" });
});
 
//Login Authentication
app.post('/login', (req, res) => {

  // Find user in the database based on provided userid
  User.findOne({ userid: req.body.userid }).exec()
    .then(function (data) {

      // Check if user exists
      if (data == null) {
        // Render login view with "Invalid Login" message if user is not found
        res.render("login", { message: "Invalid Login", flag: "" });
      } else {
        // Compare entered password with hashed password stored in the database
        bcrypt.compare(req.body.password, data.password, function (err, result) {
          if (result) {
            // If password is correct, set session variables and redirect to index page
            req.session.userid = req.body.userid;
            req.session["flag"] = "1";
            res.redirect("/index");
          } else {
            // Render login view with "Invalid Login" message if password is incorrect
            res.render("login", { message: "Invalid Login", flag: "" });
          }
        });
      }
    })
    .catch(function (error) {
      // Handle any errors that occur during the process
      console.error(error);
      // Render error view with a generic error message
      res.render("error", { message: "An error occurred" });
    });
});

/////////////////////////////////////////////////////////////////////////////
//LOgOUT POST
app.get("/logoff", function (req, res) {
  if (req.session.flag == "1")
    res.render("logoff.ejs", { message: "", flag: "1" });
  else res.render("login.ejs", { message: "Must Login First", flag: "" });
});

app.post("/logoff", (req, res) => {
  console.log("POST LOGOFF");
  req.session.destroy(function (err) {
    res.redirect("/login");
  });
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});
///////////////////////////////////////////////////////////////////

//REGISTER PAGE
app.get("/register", function (req, res) {
  res.render("register.ejs", { message: "", flag: "" });
});

// Registration Authentication
app.post("/register", async (req, res) => {
  try {
    // Check if the user already exists in the database
    const data = await User.findOne({ userid: req.body.userid }).exec();

    if (data === null) {
      // If the user doesn't exist
      if (req.body.password === req.body.password2) {
        // If the passwords match, hash the password
        bcrypt.hash(req.body.password, 5, async function (err, hashpass) {
          console.log("hashpassword=" + hashpass);
          req.body.password = hashpass;
          
          // Create a new User instance and save it to the database
          var x = new User(req.body);
          await x.save();

          // Render the login view with a "Registration Successful" message
          res.render("login", {
            message: "Registration Successful",
            flag: "",
          });
        });
      } else {
        // If the passwords don't match, render the register view with an error message
        res.render("register", {
          message: "ERROR: Passwords Do Not Match",
          flag: "",
        });
      }
    } else {
      // If the user already exists, render the register view with an error message
      res.render("register", {
        message: "ERROR: User Already In Database",
        flag: "",
      });
    }
  } catch (err) {
    // Handle any errors that occur during the registration process
    console.error(err);
    // Render the error view with a generic error message
    res.render("error", {
      message: "An error occurred during registration",
      flag: "",
    });
  }
});


///////////////////////////////////////////////////////////////////
//ABOUT PAGE
app.get("/about", function (req, res) {
  if (req.session.flag != "1") {
    res.render("about.ejs", { message: "", flag: "" });
  } else {
    res.render("about.ejs", { message: "", flag: "1" });
  }
});

//CONTACT PAGE
app.get("/contact", function (req, res) {
  if (req.session.flag != "1") {
    res.render("contact.ejs", { message: "", flag: "" });
  } else {
    res.render("contact.ejs", { message: "", flag: "1" });
  }
});


///////// PRODUCTS & CATALOG ////////////
app.get("/products", async (req, res) => {
  // STEP04-SESSION VALIDATION
  if (req.session.flag !== "1") {
    res.render("login", { message: "Session Expired", flag: "" });
  }

  try {
    const item2find = {};
    // Fetch data from Catalog using modern Mongoose syntax
    const data = await Catalog.find(item2find).exec();
  
    // Log the data for debugging
    console.log("result=" + JSON.stringify(data));
  
    if (data.length === 0) {
      // If cart is empty
      const cart = "";
      return res.render("products.ejs", { cart: cart, message: "", flag: "1" });
    } 
    
    else {
      let catalog = ""; 
  
      for (var i = 0; i < data.length; i++) {
        // use absolute path for product dir
        var image = "/Products/" + data[i].code + ".jpeg"; // note only extension jpeg are rendered  


        //renders the product in Catalog
        catalog += `
          <div class="product-box">
            <img src="${image}" alt="${data[i].name}" class="product-img"> 
            <h2 class="product-title">${data[i].name}</h2>
            <span class="price">${data[i].price}</span>
            <i class='bx bxs-cart add-cart'; ></i>
          </div>`;
      }
  
      // Render the products page with the catalog data
      return res.render("products.ejs", { catalog: catalog, message: "", flag: "1" });
    }
  } catch (err) {
    console.error(err);
    return res.render("error", { message: "An error occurred" });
  }
});


//////////////////////////////////////////////////////////////////////
//CHECKOUT
app.get("/checkout", async function (req, res) {
  console.log("body=" + getJSONString(req.body));
  var msg = "No MSG";
  var flag = 0;
  var message = "";

  // Define cart with an initial value
  var cart = "";

  res.render("checkout.ejs", {
    cart: cart,
    flag: req.session.flag,
    message: "",
  });
});

////////////////////////////////////////////////////////////////// Standard route & reply pages
app.get("/end", function (req, res) {
  if ((req.session.flag = "1"))
    res.render("end.ejs", { message: "", flag: "1" });
});
app.get("/contactreply", function (req, res) {
  if ((req.session.flag = "1"))
    res.render("contactreply.ejs", { message: "", flag: "1" });
});
app.get("/index", function (req, res) {
  if ((req.session.flag = "1"))
    res.render("index.ejs", { message: "", flag: "1" });
});

////////// THE CART PAGE 
app.get("/cart", (req, res) => {
  console.log("body=" + getJSONString(req.body));
  const item2find = new Object();
  item2find.userid = req.session.userid;

  CartItem.find(item2find).exec()
    .then((data) => {
      var cart = "";
      res.render("cart.ejs", { cart, flag: req.session.flag, message: "" });
    })
    .catch((error) => {
      console.error(error);
      // Handle the error and send an appropriate response
      res.status(500).send("Internal Server Error");
    });
});


app.post('/api/cart', async (req, res) => {
  try {
    // Extract userId from the session
    const userId = req.session.userid;
    // Extract cartItems from the request body
    const { cartItems } = req.body;

    // Loop through each cart item and add the userId property
    for (let i = 0; i < cartItems.length; i++) {
      cartItems[i].userId = userId;
    }

    console.log(cartItems);

    //saving to databse
      await CartItem.create(cartItems);
    

    res.status(201).json({ message: 'Cart items added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

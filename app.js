require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./config/db");
const session = require("express-session");
const layout = require("express-ejs-layouts");
const pageRoutes = require("./routes/pageRoutes");



db();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(layout);

// session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use((req, res, next) => {
  res.locals.flag = req.session.flag || "";
  next();
});

// Routes
app.use("/", pageRoutes);
app.use("/", require("./routes/authRoutes"));
app.use("/", require("./routes/catalogRoutes"));
app.use("/", require("./routes/cartRoutes"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port " + PORT));

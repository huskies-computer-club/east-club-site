const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const saltRounds = process.env.SALT_ROUNDS || 10;
const cors = require("cors");
var vhost = require("vhost");

const app = express();
const shopApp = express();

const PORT = process.env.PORT || 3000;
const DOMAIN = process.env.DOMAIN;
const session = require("express-session");
const KnexSessionStore = require("connect-session-knex")(session);
const knex = require("knex");
const dbConfig = require("./knexfile");
const dbEnv = process.env.NODE_ENV || "development";
const db = knex(dbConfig[dbEnv]);
const store = new KnexSessionStore({
  knex: db,
  tablename: "sessions",
  clearInterval: 1000 * 60 * 60,
});

const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// Configure Cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// Enable All CORS Requests
app.use(cors());

// needed to handle post request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public/static")));
shopApp.all(express.static(path.join(__dirname, "public/static/shop")));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

shopApp.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/shop", "index.html"));
});

shopApp.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "public/shop", "cart.html"));
});

app.use(vhost(`shop.${DOMAIN}`, shopApp));
app.use(vhost(`shop.${DOMAIN}`, userapp))

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});
app.get("/admin-login", function (req, res) {
  res.sendFile(path.join(__dirname, "public", "admin-login.html"));
});

app.get("/admin-dashboard", function (req, res) {
  if (!req.session.userId) {
    res.redirect("/admin-login");
  } else {
    // User is logged in, proceed to dashboard...
    res.sendFile(path.join(__dirname, "public", "admin-dashboard.html"));
  }
});

// get all items
app.get("/items", async (req, res) => {
  try {
    const items = await db("items").select("*");
    res.status(200).json(items);
  } catch (err) {
    res.json({ error: err });
  }
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "huskies-computer-club-shop",
    format: async (req, file) => "png", // supports promises as well
  },
});

const parser = multer({ storage: storage });

app.post("/item", parser.single("uploaded_file"), async (req, res) => {
  if (!req.session.userId) {
    res.redirect("/admin-login");
  }
  console.log(req.file.path);
  const { name, price, description } = req.body;
  try {
    const item = await db("items")
      .insert({ name, price, description, image_url: req.file.path })
      .returning("*");

    console.log(item);

    res.status(201).json(item);
  } catch (err) {
    console.log("error", err);
    res.json({ error: err });
  }
});

// create user
app.post("/user", async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  const propsToCheck = ["first_name", "last_name", "email", "password"];
  const hasAllProps = propsToCheck.every((prop) => prop in req.body);
  if (!hasAllProps) {
    return res.status(400).json({ error: "missing params" });
  }

  // const existingEmail = await db('users').where('email', email).first();
  // if (existingEmail) {
  //   return res.status(400).json({error: 'email already exists'});
  // }

  try {
    const emailExists = await db("users").where({ email }).first();
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    if (!emailExists && hashedPassword) {
      const user = await db("users")
        .insert({
          first_name,
          last_name,
          email,
          password: hashedPassword,
        })
        .returning("*");
      res.send("User created successfully!");
    } else {
      res.status(400).send("Email already exists");
    }
  } catch (err) {
    res.status(500).send("Error registration");
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db("users").where({ email }).first();
    if (user && (await bcrypt.compare(password, user.password))) {
      //! give a cookie
      res.send("Login successful!");
    } else {
      res.status(400).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Error logging in");
  }
});

app.post("/admin-login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db("admin_users").where({ email }).first();
    const compare = await bcrypt.compare(password, user.password);
    if (user && compare) {
      //! give a cookie
      req.session.userId = user.id;
      res.redirect("/admin-dashboard");
    } else {
      res.redirect("/admin-login");
    }
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Error logging in");
  }
});
app.post("/order", async (req, res) => {
  const { user_id } = req.body;
  try {
    const order = await db("orders").insert({ user_id });
    res.status(201).json(order);
  } catch (err) {
    res.json({ error: err });
  }
});

app.post("/order-items", async (req, res) => {
  const { order_id, item_id, quantity } = req.body;
  try {
    const order_item = await db("order_items").insert({
      order_id,
      item_id,
      quantity,
    });
    res.status(201).json(order_item);
  } catch (err) {
    res.json({ error: err });
  }
});

app.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    res.redirect("/admin-login");
  });
});
app.listen(PORT, () => {
  //? maybe add a domain env later
  console.log("USING NODE ENV type:", process.env.NODE_ENV);
  console.log(`Server started on http://${DOMAIN}:${PORT}`);
});

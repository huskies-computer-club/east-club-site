const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");
const cors = require("cors");

const app = express();

const PORT = process.env.PORT || 3000;

// Enable All CORS Requests
app.use(cors());

// needed to handle post request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Using Knex to validate and sanitize the input data to avoid SQL injection
const knex = require("knex");
// db connection
const dbConfig = require("./knexfile");
const dbEnv = process.env.NODE_ENV || "development";
// database instance
const db = knex(dbConfig[dbEnv]);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
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

  const saltRounds = 10;
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

app.listen(PORT, () => {
  //? maybe add a domain env later
  console.log("USING NODE ENV type:", process.env.NODE_ENV);
  console.log(`Server started on http://localhost:${PORT}`);
});

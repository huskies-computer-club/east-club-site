const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");
dotenv.config();
const KnexSessionStore = require("connect-session-knex")(session);
const cors = require("cors");
const path = require("path");
const knex = require("knex");
const dbConfig = require("../../knexfile");
const dbEnv = process.env.NODE_ENV || "development";
const db = knex(dbConfig[dbEnv]);
const rootPath = path.resolve(__dirname, "../../");

const store = new KnexSessionStore({
  knex: db,
  tablename: "sessions",
  clearInterval: 1000 * 60 * 60,
});

module.exports = (server) => {
  server.use(cors());

  // needed to handle post request
  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));

  // Serve static files from the 'public' directory
  server.use("/public", express.static(path.join(rootPath, "public")));

  server.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store,
    })
  );
};

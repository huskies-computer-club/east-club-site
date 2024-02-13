var vhost = require("vhost");
const shopAppServer = require("express")();
const dotenv = require("dotenv");
dotenv.config();
const DOMAIN = process.env.DOMAIN;

module.exports = (server) => {
  server.use(vhost(`shop.${DOMAIN}`, shopAppServer));
  require("./shop")(shopAppServer);
};

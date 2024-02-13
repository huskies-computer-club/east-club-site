const path = require("path");
const rootPath = path.resolve(__dirname, "../../../");

module.exports = (shopApp) => {
  shopApp.get(["/", "/index.html"], (req, res) => {
    res.sendFile(path.join(rootPath, "public/shop", "index.html"));
  });

  shopApp.get(["/cart", "/cart.html"], (req, res) => {
    res.sendFile(path.join(rootPath, "public/shop", "cart.html"));
  });

  shopApp.get(["/contact", "/contact.html"], (req, res) => {
    res.sendFile(path.join(rootPath, "public/shop", "contact.html"));
  });

  shopApp.get(["/order-placed", "/order-placed.html"], (req, res) => {
    res.sendFile(path.join(rootPath, "public/shop", "order-placed.html"));
  });
};

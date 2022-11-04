const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productsRoutes = require("./routes/products-routes");
const HttpError = require("./models/http-error");

const server = express();

server.use(bodyParser.json());

server.use("/products", productsRoutes);

server.use((req, res, next) => {
  const error = new HttpError("Could not find this route", 404);
  throw error;
});

server.use((error, req, res, next) => {
  if (req.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured" });
});

mongoose
  .connect(
    "mongodb+srv://RomanyshynOleh:qwerty12345@cluster0.3fm9gr1.mongodb.net/test-inforce?retryWrites=true&w=majority"
  )
  .then(() => {
    server.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

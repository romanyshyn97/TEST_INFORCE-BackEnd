const express = require("express");
const { check } = require("express-validator");

const HttpError = require("../models/http-error");

const productsControllers = require("../controllers/products-controllers");

const router = express.Router();

router.get("/", productsControllers.getAllProducts);

router.get("/:productId", productsControllers.getProductById);

router.post(
  "/",
  [check("name").not().isEmpty()],
  productsControllers.createProduct
);

router.patch(
  "/:productId",
  [check("name").not().isEmpty()],
  productsControllers.updateProduct
);

router.delete("/:productId", productsControllers.deleteProduct);

module.exports = router;

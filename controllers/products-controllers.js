const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const ProductSchema = require("../models/product-schema");

let DUMMY_PRODUCTS = [
  {
    id: "1",
    imageUrl: "some url here",
    name: "Product name",
    count: 4,
    size: {
      width: 200,
      height: 200,
    },
    weight: "200g",
    comments: [
      {
        id: 1,
        productId: 1,
        description: "some text here",
        date: "14:00 22.08.2021",
      },
    ],
  },
];

const getAllProducts = async (req, res, next) => {
  let products;
  try{
    products = await ProductSchema.find({});
  }catch(err){
    const error = new HttpError('Could not fetch products', 500);
    return next(error);
  }

  res.json({products: products.map(product => product.toObject({getters: true}))})
  
};

const getProductById = async (req, res, next) => {
  const productId = req.params.productId;

  let product;
  try{
    product = await ProductSchema.findById(productId);
  }catch(err){
    const error = new HttpError('Something went wrong, could not find place', 500);
    return next(error);
  }
  
  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided id",
      404
    );
    return next(error);
  }
  res.json({ product: product.toObject({getters: true}) });
};

const createProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { name, count , imageUrl} = req.body;

  const createdProduct = new ProductSchema({
    name,
    count: 1,
    imageUrl: "https://healthjade.com/wp-content/uploads/2017/10/apple-fruit.jpg",
    size: {
      width: 200,
      height: 200,
    },
    weight: "100g",
  });

  try{
    await createdProduct.save();
  }catch(err){
    const error = new HttpError('Creating product failed, please try again', 500);
    return next(error);
  }

  res.status(201).json({ product: createdProduct });
};

const updateProduct = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, please check your data", 422);
  }
  const { name } = req.body;
  const productId = req.params.productId;

  let product;
  try{
    product = await ProductSchema.findById(productId);
  }catch(err){
    const error = new HttpError('Something went wrong, could not update product',500);
    return next(error);
  }

  product.name = name;

  try{
    await product.save();
  }catch(err){
    const error = new HttpError('Something went wrong, could not update product',500);
    return next(error);
  }

  res.status(200).json({ product: product.toObject({getters:true}) });
};

const deleteProduct = async (req, res, next) => {
  const productId = req.params.productId;
  
  let product;
  try{
    product = await ProductSchema.findById(productId);
  }catch(err){
    const error = new HttpError('Something went wrong, could not delete product',500);
    return next(error);
  }

  try{
    await product.remove();
  }catch(err){
    const error = new HttpError('Something went wrong, could not delete product',500);
    return next(error);
  }

  res.status(200).json({ message: "Deleted place" });
};

exports.getAllProducts = getAllProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;

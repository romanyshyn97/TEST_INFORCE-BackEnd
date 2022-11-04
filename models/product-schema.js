const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  count: Number,
  imageUrl: { type: String, required: true },
  size: {
    width: Number,
    height: Number,
  },
  weight: { type: String, required: true },
});

module.exports = mongoose.model('Product', productSchema);
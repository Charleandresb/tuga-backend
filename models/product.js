import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  images: {
    type: [String],
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },

  minPrice: {
    type: Number,
    default: 0,
  },

  defaultSku: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;

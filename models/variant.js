import mongoose from "mongoose";

const variantSchema = mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  size: {
    type: String,
    enum: ["OSFA", "S", "M", "L", "XL"],
    required: true,
  },

  sizeOrder: {
    type: Number,
    required: true,
  },

  price: {
    type: Number,
    required: true,
  },

  stock: {
    type: Number,
    default: 0,
  },

  sku: {
    type: String,
    unique: true,
    inmutable: true,
  },

  createAt: {
    type: Date,
    default: Date.now,
  },
});

const Variant = mongoose.model("Variant", variantSchema);
export default Variant;

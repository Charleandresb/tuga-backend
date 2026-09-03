import express from "express";
import {
  getAllProduct,
  getProductType,
  createProduct,
  getProduct,
  getProductVariants,
  hydrateCart,
  editVariant,
} from "../controllers/product.js";

const router = express.Router();

router.get("/all", getAllProduct);

router.get("/type", getProductType);

router.get("/sku", getProduct);

router.get("/variants/:productId", getProductVariants);

router.post("/cart/validate", hydrateCart);

router.post("/", createProduct);

router.patch("/variant/edit", editVariant);

export default router;

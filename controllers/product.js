import Product from "../models/product.js";
import Variant from "../models/variant.js";
import generateSKU from "../helper/generateSKU.js";
import NotReqError from "../errors/not-req-error.js";
import NotFoundError from "../errors/not-found-error.js";

export async function getAllProduct(req, res, next) {
  await Product.find({})
    .sort({ createdAt: -1 })
    .orFail(() => {
      throw new NotFoundError("Lista de productos no encontrada");
    })
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
}

export async function getProductType(req, res, next) {
  await Product.find({ type: req.query.productType })
    .sort({ createdAt: -1 })
    .orFail(() => {
      throw new NotFoundError("lista de cartas no encontrada");
    })
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);
}

export async function getProduct(req, res, next) {
  try {
    const variant = await Variant.findOne({
      sku: req.query.productSku,
    }).populate("productId");

    if (!variant) {
      throw new NotFoundError("Producto no encontrado");
    }

    res.send({
      product: variant.productId,
      variant,
    });
  } catch (error) {
    next(error);
  }
}

export async function getProductVariants(req, res, next) {
  try {
    const variants = await Variant.find({
      productId: req.params.productId,
    }).sort({ sizeOrder: 1 });

    if (!variants.length) {
      throw new NotFoundError("Variantes no encontradas");
    }

    res.send(variants);
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req, res, next) {
  const { images, name, description, type, variants } = req.body;

  try {
    if (!variants || !variants.length) {
      throw new NotReqError("El producto debe tener al menos una variante");
    }

    const product = await Product.create({
      images,
      name,
      description,
      type,
      minPrice: 0,
      defaultSku: "TEMP",
    });

    const existingVariants = await Variant.countDocuments({
      productId: product._id,
    });

    const SIZE_ORDER = { XS: 1, S: 2, M: 3, L: 4, XL: 5, XXL: 6, OSFA: 7 };

    const variantDocs = variants.map((variant, index) => ({
      productId: product._id,
      size: variant.size,
      sizeOrder: SIZE_ORDER[variant.size],
      price: variant.price,
      stock: variant.stock,
      sku: generateSKU({
        type,
        name,
        size: variant.size,
        seq: String(existingVariants + index + 1).padStart(3, "0"),
      }),
    }));

    const createdVariants = await Variant.insertMany(variantDocs);

    const cheapestVariants = createdVariants.reduce((min, v) =>
      v.price < min.price ? v : min,
    );

    await Product.findByIdAndUpdate(product._id, {
      minPrice: cheapestVariants.price,
      defaultSku: cheapestVariants.sku,
    });

    res.status(201).send({
      product,
      variants: createdVariants,
    });
  } catch (error) {
    next(error);
  }
}

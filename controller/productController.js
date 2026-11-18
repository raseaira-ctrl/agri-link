const Product = require("../models/productModel");

function getDb(req) {
  return req.app.locals.db;
}

function validProductData(data, isUpdate = false) {
  if (!isUpdate) {
    if (
      typeof data.name !== "string" || !data.name.trim() ||
      typeof data.category !== "string" || !data.category.trim() ||
      data.price === undefined ||
      data.stock === undefined
    ) {
      return "Name, category, price, and stock are required.";
    }
  }

  if (data.price !== undefined) {
    const price = Number(data.price);

    if (!Number.isFinite(price) || price < 0) {
      return "Price must be a non-negative number.";
    }
  }

  if (data.stock !== undefined) {
    const stock = Number(data.stock);

    if (!Number.isInteger(stock) || stock < 0) {
      return "Stock must be a non-negative whole number.";
    }
  }

  return null;
}

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts(getDb(req));

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products."
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.getProductById(
      getDb(req),
      req.params.id
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or invalid ID."
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product."
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const errorMessage = validProductData(req.body);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    const productData = {
      ...req.body,
      sellerId: req.user.id
    };

    const product = await Product.createProduct(
      getDb(req),
      productData
    );

    res.status(201).json({
      success: true,
      message: "Product added successfully.",
      product
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to add product."
    });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "category",
      "price",
      "stock",
      "description",
      "image",
      "sellerName",
      "sellerContact",
      "location"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide product fields to update."
      });
    }

    if (
      updates.name !== undefined &&
      (typeof updates.name !== "string" || !updates.name.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Product name cannot be empty."
      });
    }

    if (
      updates.category !== undefined &&
      (typeof updates.category !== "string" || !updates.category.trim())
    ) {
      return res.status(400).json({
        success: false,
        message: "Category cannot be empty."
      });
    }

    const errorMessage = validProductData(updates, true);

    if (errorMessage) {
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.category !== undefined) {
      updates.category = updates.category.trim();
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    if (updates.stock !== undefined) {
      updates.stock = Number(updates.stock);
    }

    const result = await Product.updateProduct(
      getDb(req),
      req.params.id,
      updates
    );

    if (!result || result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or invalid ID."
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update product."
    });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const result = await Product.deleteProduct(
      getDb(req),
      req.params.id
    );

    if (!result || result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found or invalid ID."
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product."
    });
  }
};
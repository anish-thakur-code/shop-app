const Product = require("../models/Product");

// CREATE
const createProduct = async (req, res) => {
  const { name, price, image, description } = req.body;

  const product = await Product.create({
    name,
    price,
    image,
    description,
  });

  res.json(product);
};

// READ
const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

// UPDATE
const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = req.body.name || product.name;
    product.price = req.body.price || product.price;
    product.image = req.body.image || product.image;
    product.description = req.body.description || product.description;

    const updated = await product.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } else {
    res.status(404).json({ message: "Product not found" });
  }
};

module.exports = {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
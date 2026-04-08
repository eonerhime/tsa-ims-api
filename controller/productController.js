const Product = require("../models/productModel");
const cloudinary = require("../config/cloudinaryConfig");

/*
  {
    "name": "Samsung Fold 3",
    "description": "Fairly used but in good conditions",
    "price": 1200,
    "quantity": 2
  }
*/
// Create a new product
const createProduct = async (req, res) => {
  try {
    // 1. Check if the file actually exists first
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }
    // 2 .retrieve image details from req
    const imageUrl = req.file?.path;
    const publicId = req.file?.filename;

    // 3. Validation: Ensure price is a number (Multer sends it as a string)
    const price = Number(req.body.price);
    const quantity = Number(req.body.quantity);

    if (isNaN(req.body.price) || price < 0) {
      return res.status(400).json({ message: "Invalid price provided" });
    }

    const product = await Product.create({
      name: req.body.name,
      description: req.body.description,
      price: price,
      quantity: quantity,
      imageUrl: imageUrl,
      cloudinaryId: publicId,
    });
    res.status(201).json(product);
  } catch (error) {
    // 4. Log the actual error for debugging, return a clean message to user
    console.error("Upload Error:", error);
    res.status(400).json(`Error: ${error.message}`);
  }
};

// Get all created products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.status(200).json(products);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Get one product by ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// Update a product by ID
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find product
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // 2. Handle Image Update
    if (req.file) {
      // Delete OLD image from Cloudinary if it exists
      // Prefer using the stored cloudinaryId if you have it
      const oldId =
        product.cloudinaryId ||
        (product.imageUrl
          ? product.imageUrl.split("/").pop().split(".")[0]
          : null);

      if (oldId) {
        // Use destroy() instead of getAllProducts
        await cloudinary.uploader.destroy(oldId);
      }

      console.log("File path:", req.file.path);
      console.log("File name:", req.file.filename);

      // Update the product object with NEW image details
      product.imageUrl = req.file.path;
      product.cloudinaryId = req.file.filename;
    }

    // 3. Update Text Fields (Name, Price, etc.)
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price || product.price;
    product.quantity = req.body.quantity || product.quantity;

    // 4. Save to MongoDB
    const updatedProduct = await product.save();

    res.status(200).json({
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json(error.message);
  }
};

// Delete a product by ID
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
};

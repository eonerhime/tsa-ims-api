const Product = require("../models/productModel");
const cloudinary = require("../config/cloudinaryConfig");
const sendEmail = require("../middleware/emailSender");
const User = require("../models/userModel");
const newProductTemplate = require("../util/newProductEmail");

/*
{
  "name": "Samsung Galaxy Fold 3",
  "description": "Samsung Galaxy Z Fold 3 - 512GB ROM - 12GB RAM - 5g - 4400mAh",
  "price": 1200,
  "quantity": 15,
  "imageUrl": "https://res.cloudinary.com/dgyu3a3xa/image/upload/v1775636316/InventoryFolder/promojsfm7hhwl1dx6bj.jpg",
  "cloudinaryId": "InventoryFolder/promojsfm7hhwl1dx6bj",
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
      name: req?.body?.name,
      description: req?.body?.description,
      price: price,
      quantity: quantity,
      imageUrl: imageUrl,
      cloudinaryId: publicId,
    });

    // Get all admins
    const admins = await User.find({ role: "admin" });
    const adminEmails = admins.map((a) => a.email);

    // Send email
    const subject = `Inventory Update: ${product.name} added`;
    const html = newProductTemplate(product);

    // Only attempt to send if the array isn't empty
    if (adminEmails.length > 0) {
      try {
        // We pass the array, the sender function handles the rest
        await sendEmail(adminEmails, subject, html);
      } catch (emailError) {
        console.error("Email failed, but product was created:", emailError);
        // We don't want to crash the whole request if just the email fails
      }
    }
    res.status(201).json({
      message: "Product created and admins notified",
      product,
    });
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

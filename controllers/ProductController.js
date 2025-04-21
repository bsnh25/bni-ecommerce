const { Product } = require("../models");

class ProductController {
  // Get all products
  static async getAllProducts(req, res, next) {
    try {
      const products = await Product.findAll();

      res.status(200).json({
        message: "Products retrieved successfully",
        data: products,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get product by ID
  static async getProductById(req, res, next) {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        throw { status: 404, message: "Product not found" };
      }

      res.status(200).json({
        message: "Product retrieved successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // Create new product (admin only)
  static async createProduct(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== "admin") {
        throw { status: 403, message: "Forbidden: Admin access required" };
      }

      const { name, price } = req.body;

      // Validate required fields
      if (!name || !price) {
        throw { status: 400, message: "Name and price are required" };
      }

      const product = await Product.create({
        name,
        price,
      });

      res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // Update product (admin only)
  static async updateProduct(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== "admin") {
        throw { status: 403, message: "Forbidden: Admin access required" };
      }

      const { id } = req.params;
      const { name, price } = req.body;

      const product = await Product.findByPk(id);
      if (!product) {
        throw { status: 404, message: "Product not found" };
      }

      await product.update({
        name: name || product.name,
        price: price || product.price,
      });

      res.status(200).json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }

  // Delete product (admin only)
  static async deleteProduct(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== "admin") {
        throw { status: 403, message: "Forbidden: Admin access required" };
      }

      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        throw { status: 404, message: "Product not found" };
      }

      await product.destroy();

      res.status(200).json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProductController;

const { Purchase, User, Product } = require("../models");

class PurchaseController {
  static async purchaseProduct(req, res, next) {
    try {
      const { productId, quantity = 1 } = req.body;

      // Validate required fields
      if (!productId) {
        throw { status: 400, message: "Product ID is required" };
      }

      // Create purchase record
      const purchase = await Purchase.create({
        userId: req.user.id,
        productId,
        purchaseDate: new Date(),
      });

      res.status(201).json({
        message: "Purchase successful",
        data: purchase,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get all purchases (admin only)
  static async getAllPurchases(req, res, next) {
    try {
      // Check if user is admin
      if (req.user.role !== "admin") {
        throw { status: 403, message: "Forbidden: Admin access required" };
      }

      const purchases = await Purchase.findAll({
        include: [
          {
            model: User,
            attributes: ["id", "name", "email"],
          },
          {
            model: Product,
            attributes: ["id", "name", "price"],
          },
        ],
        order: [["createdAt", "DESC"]], // Order by creation date instead
      });

      res.status(200).json({
        message: "Purchases retrieved successfully",
        data: purchases,
      });
    } catch (error) {
      next(error);
    }
  }

  // Get purchases for logged-in user
  static async getUserPurchases(req, res, next) {
    try {
      const purchases = await Purchase.findAll({
        where: {
          userId: req.user.id,
        },
        include: [
          {
            model: Product,
            attributes: ["id", "name", "price"],
          },
        ],
        order: [["createdAt", "DESC"]], // Order by creation date instead
      });

      res.status(200).json({
        message: "User purchases retrieved successfully",
        data: purchases,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = PurchaseController;

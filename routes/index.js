const routes = require("express").Router();
const userControllers = require("../controllers/UserController");
const errorHandler = require("../middlewares/errorHandler");
const { authenticateToken } = require("../middlewares/authentication");
const purchaseController = require("../controllers/PurchaseController");
const productController = require("../controllers/ProductController");

// Public routes (no authentication needed)
routes.get("/", (req, res) => {
  res.send("SAMPAI DISINI - Routes");
});

routes.post("/register", userControllers.userRegister);
routes.post("/login", userControllers.userLogin);

// Public product routes
routes.get("/products", productController.getAllProducts); // Anyone can view products
routes.get("/products/:id", productController.getProductById); // Anyone can view product details

// Protected routes (requires authentication)
routes.use(authenticateToken); // All routes below this will require authentication

// Purchase routes
routes.post("/purchase", purchaseController.purchaseProduct);
routes.get("/purchases", purchaseController.getAllPurchases); // Admin only
routes.get("/purchases/user", purchaseController.getUserPurchases); // For logged-in user

// Protected product routes (admin only)
routes.post("/products", productController.createProduct);
routes.put("/products/:id", productController.updateProduct);
routes.delete("/products/:id", productController.deleteProduct);

// Add more protected routes here
routes.get("/profile", (req, res) => {
  res.json({
    message: "Profile accessed successfully",
    user: req.user,
  });
});

module.exports = routes;

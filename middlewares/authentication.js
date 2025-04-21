const jwt = require("jsonwebtoken");
const User = require("../models");

async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    console.log("Ini authHeader", authHeader);
    console.log("Ini token seperate", token);

    if (!token) {
      throw { status: 401, message: "Authentication required" };
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
        throw { status: 403, message: "Invalid or expired token" };
      }
      //   const finUser = User.findOne({
      //     where: {
      //       email: user.email,
      //     },
      //   });

      //   if (!finUser) {
      //     throw { status: 401, message: "Authentication required" };
      //   }

      req.user = user;
      next();
    });
    // Add user info to request object

    // console.log("Ini decode", decode);
  } catch (err) {
    next(err);
  }
}

module.exports = { authenticateToken };

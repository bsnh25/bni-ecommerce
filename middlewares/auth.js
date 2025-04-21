// const jwt = require("jsonwebtoken");

// const authenticateToken = (req, res, next) => {
//   try {
//     const authHeader = req.headers["authorization"];
//     const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
//     console.log("Ini token seperate", token);

//     if (!token) {
//       throw { status: 401, message: "Authentication required" };
//     }

//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
//       if (err) {
//         throw { status: 403, message: "Invalid or expired token" };
//       }

//       // Add user info to request object
//       req.user = user;
//       next();
//     });
//   } catch (err) {
//     next(err);
//   }
// };

// module.exports = { authenticateToken };

// function normsMiddleware(req, res, next) {
//   // const errorHandler =
//   const { role } = req.body;
//   console.log("Ini yang middleware, value role adalah " + role);
//   if (role != "admin") {
//     console.log("Kamu Bukan admin");
//   } else {
//     next();
//     console.log("Kamu adalah admin");
//   }
// }

function errorHandlerMiddleware(err, req, res, next) {
  // const errorHandler =
  console.log(err, " ===> Ini error middleware (kedua)");

  const statusCode = err.status || 500;
  const messageStatus = err.message || "Internal Server Error";

  res.status(statusCode).json({
    message: messageStatus,
  });
}

module.exports = errorHandlerMiddleware;

function authorization(req, res, next) {
  let role = req.user.role;

  if (role === "admin") {
    next();
  }
}

module.exports = authorization;

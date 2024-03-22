const jwt = require("jsonwebtoken");
const User = require("../models/Users.model");

// Instantiate the JWT token validation middleware
const isAuthenticated = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      res.status(401).json({ error: "You must be logged in." });
      return;
    }

    const token = req.headers.authorization.split(" ")[1]; // get the token from headers "Bearer 123XYZ..."

    jwt.verify(token, process.env.SECRET_KEY, async (err, payload) => {
      if (err) {
        res.status(401).json({ error: "You must be logged in." });
        return;
      }

      const { userId } = payload;
      const user = await User.findById(userId);
      req.payload = payload;
      req.user = user;

      next();
    });
  } catch (error) {
    // the middleware will catch any error in the try and send 401 if:
    // 1. There is no token
    // 2. Token is invalid
    // 3. There is no headers or authorization in req (no token)
    res.status(401).json("token not provided or not valid");
  }
};

// Export the middleware so that we can use it to create protected routes
module.exports = {
  isAuthenticated,
};

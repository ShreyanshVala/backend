const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Get the token from the 'Authorization' header
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from the header (after 'Bearer')

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    // Verify the token using the JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded token (which usually contains user info) to req.user
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // Catch any errors during token verification
    res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = authMiddleware;

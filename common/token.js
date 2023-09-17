'use strict'

const jwt = require('jsonwebtoken');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];

// Middleware to verify the token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication failed. Token missing.' });
  }
  
  const splitToken = token.split(' ');
  
  if (
    splitToken
    && splitToken.length > 0
    && splitToken[0] === 'Bearer'
    && splitToken[1]
    && splitToken[1] !== 'null'
  ) {
    jwt.verify(splitToken[1], config.secret, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Authentication failed. Invalid token.' });
      }
      
      req.userId = decoded.userId;
      next();
    });
  } else {
  
  }
}

const generateToken = (user) => {
  // Generate a token
  return jwt.sign({ userId: user.id }, config.secret, { expiresIn: '1h' });
}

module.exports = {
  verifyToken,
  generateToken
}

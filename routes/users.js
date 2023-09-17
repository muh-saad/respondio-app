const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const sequelize = require('../models'); // Import your Sequelize models
const Sequelize = require('sequelize');
const bcrypt = require('bcrypt');

const { generateToken }= require('../common/token');
const logger = require('../common/logger')

// Initialize User model
const User = require('../models/user')(sequelize, Sequelize.DataTypes);

// User Registration
router.post('/register', [
  check('username')
    .notEmpty()
    .withMessage("Username is required"),
  check('email')
    .isEmail()
    .withMessage("Email is required"),
  check('password')
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Minimum length of password should be 6"),
],
  async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { username, email, password } = req.body;
    
    // Check if the user already exists
    const existingUser = await User.findOne({
      where: {
        email,
      },
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create the user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', [
  check('email')
    .isEmail()
    .withMessage("Email is required"),
  check('password')
    .notEmpty()
    .withMessage("Password is required"),
],
  async (req, res) => {
  // Validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  try {
    const { email, password } = req.body;
    
    // Check if the user exists
    const user = await User.findOne({
      where: {
        email,
      },
    });
    
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }
    
    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Authentication failed.' });
    }
    
    // User is authenticated; generate a token
    const token = generateToken(user);
    
    res.status(200).json({ message: 'Authentication successful.', token });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

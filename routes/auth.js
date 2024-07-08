const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Helper function to validate email
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};
    
// Function to generate JWT token
const generateToken = (userId, res) => {
  const payload = {
    user: {
      id: userId,
    },
  };

  jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '7d' },
    (err, token) => {
      if (err) throw err;
      
      console.log('Generated Token:', token);
      
      // Set the token in an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        sameSite: 'None', // Set this to 'Strict' or 'Lax' if not using HTTPS
        secure: process.env.NODE_ENV === 'production', // Secure if in production
      });
      
      res.json({ msg: 'Login successful' });
    }
  );
};

// Authenticate user and register if not exists
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email) {
    return res.status(400).json({ msg: 'Email is required' });
  }
  if (!password) {
    return res.status(400).json({ msg: 'Password is required' });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ msg: 'Invalid email format' });
  }

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Register new user (if you want to support registration without hashing)
      user = new User({ email, password }); // Save password as plaintext
      await user.save();

      // Generate JWT token
      generateToken(user.id, res);
    } else {
      // Authenticate existing user
      console.log('User found:', user);

      if (user.password !== password) {
        return res.status(400).json({ msg: 'invalid credential' });
      }

      // Generate JWT token
      generateToken(user.id, res);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

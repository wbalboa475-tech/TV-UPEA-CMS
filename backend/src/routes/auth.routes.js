const express = require('express');
const router = express.Router();
const {
  register,
  login,
  getMe,
  logout,
  refreshToken
} = require('../controllers/authController');
const { protect } = require('../middlewares/auth');
const { authValidators } = require('../utils/validators');

// Rutas públicas
router.post('/register', authValidators.register, register);
router.post('/login', authValidators.login, login);
router.post('/refresh', refreshToken);

// Rutas protegidas
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;
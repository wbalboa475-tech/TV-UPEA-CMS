const express = require('express');
const router = express.Router();

// Importar rutas
const authRoutes = require('./auth.routes');
const fileRoutes = require('./files.routes');
const folderRoutes = require('./folders.routes');
const userRoutes = require('./users.routes');
const programRoutes = require('./programs.routes');

// Usar rutas
router.use('/auth', authRoutes);
router.use('/files', fileRoutes);
router.use('/folders', folderRoutes);
router.use('/users', userRoutes);
router.use('/programs', programRoutes);

// Ruta de bienvenida del API
router.get('/', (req, res) => {
  res.json({
    message: '🎬 TV UPEA CMS API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      files: '/api/files',
      folders: '/api/folders',
      users: '/api/users',
      programs: '/api/programs'
    }
  });
});

module.exports = router;
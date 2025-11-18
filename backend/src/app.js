const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
require('dotenv').config();

const { connectDB } = require('./config/database');
const config = require('./config/app');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./utils/logger');

// Importar modelos
require('./models');

// Importar rutas
const routes = require('./routes');

const app = express();

// Middlewares
app.use(helmet());
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.env === 'development') {
  app.use(morgan('dev'));
}

// Rutas
app.get('/', (req, res) => {
  res.json({ 
    message: '🎬 TV UPEA CMS API', 
    version: '1.0.0',
    status: 'online',
    docs: '/api'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// API Routes
app.use('/api', routes);

// Error handlers
app.use((req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Ruta no encontrada' 
  });
});

app.use(errorHandler);

// Iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    
    app.listen(config.port, () => {
      logger.info(`🚀 Servidor corriendo en puerto ${config.port}`);
      logger.info(`📍 Entorno: ${config.env}`);
      logger.info(`🌐 URL: ${config.apiUrl}`);
    });
  } catch (error) {
    logger.error(`❌ Error al iniciar servidor: ${error.message}`);
    process.exit(1);
  }
};

startServer();

module.exports = app;
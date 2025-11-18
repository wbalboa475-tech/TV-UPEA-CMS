const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: console.log, // ACTIVAR logs para ver qué está pasando
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL conectado correctamente');
    
    // En producción, usar alter: true para adaptar el esquema
    // En desarrollo, usar alter: false para recrear
    const shouldAlter = process.env.NODE_ENV === 'production';
    
    console.log('🔄 Sincronizando tablas...');
    await sequelize.sync({ alter: shouldAlter, force: false });
    console.log('✅ Tablas sincronizadas exitosamente');
  } catch (error) {
    console.error('❌ Error al conectar PostgreSQL:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
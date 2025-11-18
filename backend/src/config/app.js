module.exports = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || 'development',
  apiUrl: process.env.API_URL,
  frontendUrl: process.env.FRONTEND_URL,
  
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 5368709120,
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [],
    tempDir: './uploads'
  },
  
  jwt: {
    secret: process.env.JWT_SECRET,
    expire: process.env.JWT_EXPIRE,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    refreshExpire: process.env.JWT_REFRESH_EXPIRE
  }
};
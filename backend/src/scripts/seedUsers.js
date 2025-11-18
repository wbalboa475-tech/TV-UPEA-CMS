const { User } = require('../models');
const { connectDB } = require('../config/database');

const seedUsers = async () => {
  try {
    await connectDB();

    // Verificar si ya existen usuarios
    const existingUsers = await User.count();
    if (existingUsers > 0) {
      console.log('⚠️  Ya existen usuarios en la base de datos');
      console.log(`📊 Total de usuarios: ${existingUsers}`);
      process.exit(0);
    }

    // Crear usuarios de prueba
    const users = [
      {
        name: 'Admin Usuario',
        email: 'admin@tvupea.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
      },
      {
        name: 'Productor Test',
        email: 'productor@tvupea.com',
        password: 'productor123',
        role: 'producer',
        isActive: true,
      },
      {
        name: 'Editor Test',
        email: 'editor@tvupea.com',
        password: 'editor123',
        role: 'editor',
        isActive: true,
      },
      {
        name: 'Viewer Test',
        email: 'viewer@tvupea.com',
        password: 'viewer123',
        role: 'viewer',
        isActive: true,
      },
    ];

    for (const userData of users) {
      await User.create(userData);
      console.log(`✅ Usuario creado: ${userData.email}`);
    }

    console.log('\n🎉 Usuarios de prueba creados exitosamente!');
    console.log('\n📝 Credenciales de acceso:');
    console.log('═══════════════════════════════════════════');
    console.log('Admin:     admin@tvupea.com     / admin123');
    console.log('Productor: productor@tvupea.com / productor123');
    console.log('Editor:    editor@tvupea.com    / editor123');
    console.log('Viewer:    viewer@tvupea.com    / viewer123');
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear usuarios:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedUsers();
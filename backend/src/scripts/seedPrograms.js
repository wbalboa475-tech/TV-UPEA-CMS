const { Program } = require('../models');
const { connectDB } = require('../config/database');

const seedPrograms = async () => {
  try {
    await connectDB();

    // Verificar si ya existen programas
    const existingPrograms = await Program.count();
    if (existingPrograms > 0) {
      console.log('⚠️  Ya existen programas en la base de datos');
      process.exit(0);
    }

    // Crear los 9 programas
    const programs = [
      {
        name: 'Noticiero Central',
        slug: 'noticiero-central',
        description: 'Noticiero principal con las noticias más importantes del día',
        color: '#EF4444',
        icon: 'newspaper',
        schedule: 'Lunes a Viernes 20:00',
        order: 1
      },
      {
        name: 'Deportes UPEA',
        slug: 'deportes-upea',
        description: 'Resumen deportivo semanal',
        color: '#10B981',
        icon: 'trophy',
        schedule: 'Sábados 18:00',
        order: 2
      },
      {
        name: 'Cultura y Sociedad',
        slug: 'cultura-y-sociedad',
        description: 'Programa cultural con entrevistas y reportajes',
        color: '#8B5CF6',
        icon: 'palette',
        schedule: 'Miércoles 19:00',
        order: 3
      },
      {
        name: 'Educación Hoy',
        slug: 'educacion-hoy',
        description: 'Temas educativos y académicos',
        color: '#3B82F6',
        icon: 'book-open',
        schedule: 'Martes 16:00',
        order: 4
      },
      {
        name: 'Salud y Bienestar',
        slug: 'salud-y-bienestar',
        description: 'Consejos de salud y bienestar',
        color: '#06B6D4',
        icon: 'heart-pulse',
        schedule: 'Jueves 17:00',
        order: 5
      },
      {
        name: 'Tecnología Digital',
        slug: 'tecnologia-digital',
        description: 'Últimas tendencias en tecnología',
        color: '#6366F1',
        icon: 'cpu',
        schedule: 'Viernes 18:00',
        order: 6
      },
      {
        name: 'Medio Ambiente',
        slug: 'medio-ambiente',
        description: 'Ecología y cuidado del medio ambiente',
        color: '#22C55E',
        icon: 'leaf',
        schedule: 'Lunes 15:00',
        order: 7
      },
      {
        name: 'Entrevistas Especiales',
        slug: 'entrevistas-especiales',
        description: 'Conversaciones con personalidades destacadas',
        color: '#F59E0B',
        icon: 'mic',
        schedule: 'Domingos 20:00',
        order: 8
      },
      {
        name: 'Variedades UPEA',
        slug: 'variedades-upea',
        description: 'Programa de entretenimiento y variedades',
        color: '#EC4899',
        icon: 'sparkles',
        schedule: 'Sábados 21:00',
        order: 9
      }
    ];

    for (const programData of programs) {
      await Program.create(programData);
      console.log(`✅ Programa creado: ${programData.name}`);
    }

    console.log('\n🎉 Programas creados exitosamente!');
    console.log('\n📺 Programas disponibles:');
    console.log('═══════════════════════════════════════════');
    programs.forEach((p, i) => {
      console.log(`${i + 1}. ${p.name} - ${p.schedule}`);
    });
    console.log('═══════════════════════════════════════════\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear programas:', error);
    process.exit(1);
  }
};

seedPrograms();
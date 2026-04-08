import pool from '../config/db.js';
import bcrypt from 'bcryptjs';

export const seedData = async () => {
  try {
    console.log('Starting to seed database...');

    console.log('Cleaning up existing data...');
    await pool.query('DELETE FROM time_slots');
    await pool.query('DELETE FROM classrooms');
    await pool.query('DELETE FROM courses');
    await pool.query('DELETE FROM teachers');
    await pool.query('DELETE FROM users');
    console.log('Existing data cleaned up');

    // Seed users with passwords
    const usersData = [
      {
        name: 'Admin GI',
        email: 'admin@gi.cm',
        password: 'admin123',
        role: 'admin',
        department: 'GI',
        avatar: null
      },
      {
        name: 'Pr. Paune',
        email: 'paune@example.cm',
        password: 'password123',
        role: 'teacher',
        department: 'GI',
        avatar: null
      },
      {
        name: 'Mme. Elad Georgette',
        email: 'elad@example.cm',
        password: 'password123',
        role: 'teacher',
        department: 'GI',
        avatar: null
      },
      {
        name: 'Dr. Manga',
        email: 'manga@example.cm',
        password: 'password123',
        role: 'teacher',
        department: 'GL',
        avatar: null
      }
    ];

    for (const user of usersData) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role, department, avatar) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (email) DO NOTHING',
        [user.name, user.email, hashedPassword, user.role, user.department, user.avatar]
      );
    }
    console.log('Users seeded successfully');

    // Seed teachers
    const teachersData = [
      {
        name: 'Pr. Paune Felix',
        email: 'paune@example.cm',
        department: 'GI',
        specialization: 'Maintenance et Administration des Reseaux',
        availableDays: ['Monday', 'Tuesday', 'Wednesday']
      },
      {
        name: 'Dr. Manga Fabrice',
        email: 'manga@example.cm',
        department: 'GI',
        specialization: 'Cryptographie et Application',
        availableDays: ['Monday', 'Thursday', 'Friday']
      },
      {
        name: 'Mme. Elad Georgette',
        email: 'elad@example.cm',
        department: 'GI',
        specialization: "Ergonomie D'interfaces Logiciels",
        availableDays: ['Tuesday', 'Wednesday', 'Friday']
      }
    ];

    for (const teacher of teachersData) {
      await pool.query(
        'INSERT INTO teachers (name, email, department, specialization, available_days) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (email) DO NOTHING',
        [teacher.name, teacher.email, teacher.department, teacher.specialization, teacher.availableDays]
      );
    }
    console.log('Teachers seeded successfully');

    // Seed courses
    const coursesData = [
      {
        name: 'Maintenance et Administration des Reseaux',
        code: 'GI101',
        department: 'GI',
        credits: 4,
        hoursPerWeek: 4
      },
      {
        name: 'Cryptographie et Application',
        code: 'GI201',
        department: 'GI',
        credits: 3,
        hoursPerWeek: 3
      },
      {
        name: "Ergonomie D'interfaces Logiciels",
        code: 'GI301',
        department: 'GI',
        credits: 5,
        hoursPerWeek: 5
      }
    ];

    for (const course of coursesData) {
      await pool.query(
        'INSERT INTO courses (name, code, department, credits, hours_per_week) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (code) DO NOTHING',
        [course.name, course.code, course.department, course.credits, course.hoursPerWeek]
      );
    }
    console.log('Courses seeded successfully');

    // Seed classrooms
    const classroomsData = [

      {
        name: 'Amphi 100',
        capacity: 80,
      },
      {
        name: 'Labo 21',
        capacity: 60,
      },
      {
        name: 'Labo 22',
        capacity: 60,
      },
      {
        name: 'Labo 23',
        capacity: 60,
      },
      
    ];

    for (const classroom of classroomsData) {
      await pool.query(
        'INSERT INTO classrooms (name, capacity) VALUES ($1, $2)',
        [classroom.name, classroom.capacity]
      );
    }
    console.log('Classrooms seeded successfully');

    // Get IDs for time slots - query in creation order to get consistent teacher
    const paauneResult = await pool.query('SELECT id FROM users WHERE email = \'paune@example.cm\' AND role = \'teacher\'');
    const coursesResult = await pool.query('SELECT id FROM courses WHERE code = \'GI101\' LIMIT 1');
    const classroomsResult = await pool.query('SELECT id FROM classrooms ORDER BY id LIMIT 1');

    const paauneId = paauneResult.rows[0]?.id;
    const courseId = coursesResult.rows[0]?.id;
    const classroomId = classroomsResult.rows[0]?.id;

    // Seed time slots - use current date/time for testing
    // Always create a slot that is currently active (from 8 AM to 6 PM every day)
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startTime = new Date(today.getTime() + 8 * 60 * 60 * 1000); // 8 AM today
    const endTime = new Date(today.getTime() + 18 * 60 * 60 * 1000); // 6 PM today

    if (paauneId && courseId && classroomId) {
      // Delete existing timeslot to avoid duplicates
      await pool.query('DELETE FROM time_slots');
      
      await pool.query(
        'INSERT INTO time_slots (title, start_time, end_time, classroom_id, teacher_id, course_id, color, teacher_confirmed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
        ['Maintenance et Administration des Reseaux', startTime, endTime, classroomId, paauneId, courseId, '#3b82f6', false]
      );
      console.log(`Time slots seeded for teacher ${paauneId} (${paauneId === 2 ? 'Pr. Paune' : 'other'})`);
    } else {
      console.log(`Warning: Missing IDs - paauneId: ${paauneId}, courseId: ${courseId}, classroomId: ${classroomId}`);
    }

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};
import pool from "../config/db.js";

// Users table
export const createUserTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role VARCHAR(25) NOT NULL CHECK (role IN ('admin', 'teacher', 'student')),
            department VARCHAR(10) CHECK (department IN ('GI', 'ASR', 'GL', 'GRT')),
            avatar VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    try {
        await pool.query(query);
        console.log("Table users created successfully!");
    } catch (error) {
        console.error("Error creating users table:", error);
    }
}

// Teachers table
export const createTeachersTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS teachers (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            department VARCHAR(10) NOT NULL CHECK (department IN ('GI', 'ASR', 'GL', 'GRT')),
            specialization VARCHAR(100) NOT NULL,
            available_days TEXT[],
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    try {
        await pool.query(query);
        console.log("Table teachers created successfully!");
    } catch (error) {
        console.error("Error creating teachers table:", error);
    }
}

// Courses table
export const createCoursesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS courses (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            code VARCHAR(20) UNIQUE NOT NULL,
            department VARCHAR(10) NOT NULL CHECK (department IN ('GI', 'ASR', 'GL', 'GRT')),
            credits INTEGER NOT NULL,
            hours_per_week INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    try {
        await pool.query(query);
        console.log("Table courses created successfully!");
    } catch (error) {
        console.error("Error creating courses table:", error);
    }
}

// Classrooms table
export const createClassroomsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS classrooms (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL,
            capacity INTEGER NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    try {
        await pool.query(query);
        console.log("Table classrooms created successfully!");
    } catch (error) {
        console.error("Error creating classrooms table:", error);
    }
}

// Classes/Student Groups table
export const createClassesTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS classes (
            id SERIAL PRIMARY KEY,
            name VARCHAR(50) NOT NULL UNIQUE,
            department VARCHAR(10) NOT NULL CHECK (department IN ('GI', 'ASR', 'GL', 'GRT')),
            student_count INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    try {
        await pool.query(query);
        console.log("Table classes created successfully!");
    } catch (error) {
        console.error("Error creating classes table:", error);
    }
}

// Time slots table
export const createTimeSlotsTable = async () => {
    const query = `
        CREATE TABLE IF NOT EXISTS time_slots (
            id SERIAL PRIMARY KEY,
            title VARCHAR(100) NOT NULL,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP NOT NULL,
            classroom_id INTEGER REFERENCES classrooms(id),
            teacher_id INTEGER REFERENCES users(id),
            course_id INTEGER REFERENCES courses(id),
            class_id INTEGER REFERENCES classes(id),
            color VARCHAR(7),
            teacher_confirmed BOOLEAN DEFAULT FALSE,
            confirmed_at TIMESTAMP,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;
    try {
        await pool.query(query);
        console.log("Table time_slots created successfully!");
    } catch (error) {
        console.error("Error creating time_slots table:", error);
    }
}

// Create all tables
export const createAllTables = async () => {
    try {
        await createUserTable();
        await createTeachersTable();
        await createCoursesTable();
        await createClassroomsTable();
        await createClassesTable();
        await createTimeSlotsTable();
        console.log("All tables created successfully!");
    } catch (error) {
        console.error("Error creating tables:", error);
    }
}
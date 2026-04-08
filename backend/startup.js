import dotenv from "dotenv";
import { createAllTables } from "./src/data/createTables.js";
import { seedData } from "./src/data/seedData.js";
import { Pool } from 'pg';

dotenv.config();

// Database connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

// Wait for database to be ready
async function waitForDatabase() {
  console.log('Waiting for database to be ready...');
  
  while (true) {
    try {
      await pool.query('SELECT 1');
      console.log('Database is ready!');
      break;
    } catch (error) {
      console.log('Database not ready yet, waiting 2 seconds...');
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Setup database (create tables and seed data)
async function setupDatabase() {
  try {
    console.log('Starting database setup...');
    
    // Check environment variables
    const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error('Missing environment variables:', missingVars.join(', '));
      throw new Error('Missing required environment variables');
    }
    
    console.log('Environment variables are set');
    
    // Create tables
    console.log('Creating database tables...');
    await createAllTables();
    console.log('Tables created successfully');
    
    // Seed data
    console.log('Seeding database with sample data...');
    await seedData();
    console.log('Database seeded successfully');
    
    console.log('Database setup completed!');
    
  } catch (error) {
    console.error('Database setup failed:', error.message);
    throw error;
  }
}

// Start the Express server
async function startServer() {
  try {
    console.log('Starting Express server...');
    
    // Import the app
    const app = await import('./server.js');
    const port = process.env.PORT || 3001;
    
    app.default.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
    
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

// Main startup function
async function startup() {
  try {
    console.log('Starting ERP IUT application...\n');
    
    // Wait for database to be ready
    await waitForDatabase();
    
    // Setup database (create tables and seed data)
    await setupDatabase();
    
    // Start the Express server
    await startServer();
    
  } catch (error) {
    console.error('Startup failed:', error.message);
    process.exit(1);
  }
}

// Run startup
startup(); 
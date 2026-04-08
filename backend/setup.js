import dotenv from "dotenv";
import { createAllTables } from "./src/data/createTables.js";
import { seedData } from "./src/data/seedData.js";

dotenv.config();

async function setup() {
  try {
    console.log(' Starting ERP IUT setup...\n');
    
    // Check environment variables
    const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.error(' Missing environment variables:', missingVars.join(', '));
      console.error('Please create a .env file with the required database configuration.');
      process.exit(1);
    }
    
    console.log('Environment variables are set');
    
    // Create tables
    console.log('\n Creating database tables...');
    await createAllTables();
    console.log('Tables created successfully');
    
    // Seed data
    console.log('\n Seeding database with sample data...');
    await seedData();
    console.log(' Database seeded successfully');
    
    console.log('\n Setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Start the backend server: npm run dev');
    console.log('2. Start the frontend: cd ../frontend && npm run dev');
    console.log('3. Open http://localhost:5173 in your browser');
    
  } catch (error) {
    console.error(' Setup failed:', error.message);
    process.exit(1);
  }
}

setup(); 
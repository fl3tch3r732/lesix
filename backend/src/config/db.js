import pkg from 'pg';
import dotenv from "dotenv";
const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

pool.on("connect", () => {
  console.log("Connected to the database");
});

pool.connect()
  .then(() => console.log(' Connected to PostgreSQL!'))
  .catch(err => console.error(' Failed to connect to DB', err));


export default pool;
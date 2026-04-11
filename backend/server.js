import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import teacherRoutes from "./src/routes/teacherRoutes.js";
import courseRoutes from "./src/routes/courseRoutes.js";
import classroomRoutes from "./src/routes/classroomRoutes.js";
import classesRoutes from "./src/routes/classesRoutes.js";
import timeSlotRoutes from "./src/routes/timeSlotRoutes.js";
import { createAllTables } from "./src/data/createTables.js";
import { seedData } from "./src/data/seedData.js";

const app = express();

dotenv.config();
app.use(cors({ credentials: true}));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// API routes
app.use("/api/users", userRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/timeslots", timeSlotRoutes);

// Endpoint to create all tables (for setup)
app.get("/api/createtables", async (req, res) => {
  try {
    await createAllTables();
    res.json({ message: "All tables created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Endpoint to seed database with sample data
app.get("/api/seed", async (req, res) => {
  try {
    await seedData();
    res.json({ message: "Database seeded successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DB test endpoint
app.get("/", async (req, res) => {
  const result = await pool.query("SELECT current_database()");
  res.send(`The database name is ${result.rows[0].current_database}`);
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Export the app for use in startup script
export default app;

// Only start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`); 
  });
}
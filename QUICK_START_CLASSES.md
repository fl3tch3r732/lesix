# Quick Start Guide - Student Classes Feature

## What Was Added

You can now specify **which group of students** (class) a teacher is teaching when creating a course schedule. The system supports classes like **GIINFO1**, **GIINFO2**, **GIINFO3**, etc.

## How to Use

### Step 1: For Admins - Create a Course Schedule

1. Open the **Timetable module** in your dashboard
2. Click **"Ajouter un cours au planning"** button
3. Fill in the form fields:
   - **Date**: Select the date
   - **Heure de début**: Start time
   - **Heure de fin**: End time
   - **Cours**: Select the course
   - **Enseignant**: Select the teacher
   - **Salle**: Select the classroom
   - **🆕 Classe**: **Select the student group** (GIINFO1, GIINFO2, GIINFO3, etc.)
   - **Couleur**: Pick a color

4. Click **"Ajouter au planning"**

### Step 2: For Teachers - View and Confirm Class

1. Navigate to **Gestion des Classes** (Classes Module)
2. You'll see all classrooms with their current status
3. When your class is scheduled (current or next), you'll see details:
   - **Cours en cours** (if happening now):
     - Course name
     - **🆕 Teacher name**
     - **🆕 Classroom name**
     - **🆕 Class name** (e.g., GIINFO1, GIINFO2)
     - Time (HH:MM - HH:MM)
     - "Confirmer ma présence" button

4. Click **"Confirmer ma présence"** to confirm your presence

## Available Classes

The system comes pre-loaded with:
- **GIINFO1** - 35 students
- **GIINFO2** - 32 students
- **GIINFO3** - 30 students

### Add More Classes (Via API)

```bash
curl -X POST http://localhost:5000/api/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "GIINFO4",
    "department": "GI",
    "student_count": 28
  }'
```

## What's New in the Display

### In the Timetable Form
✅ **New "Classe" dropdown** - Shows all available student groups

### In the Classes Module
✅ **Teacher name** - Shows who teaches the class
✅ **Classroom name** - Shows where the class is held
✅ **Class name** - Shows which student group (GIINFO1, etc.)

**Before:**
```
Cours en cours
Maintenance et Administration des Reseaux
08:00 - 18:00
```

**After:**
```
Cours en cours
Maintenance et Administration des Reseaux
Enseignant: Pr. Paune Felix
Salle: Amphi 100
Classe: GIINFO1
08:00 - 18:00
```

## API Reference

### Get All Classes
```bash
GET /api/classes
```

### Create a New Class
```bash
POST /api/classes
{
  "name": "GIINFO4",
  "department": "GI",
  "student_count": 28
}
```

### Get Classes by Department
```bash
GET /api/classes/department/GI
```

### Update a Class
```bash
PUT /api/classes/1
{
  "name": "GIINFO1",
  "department": "GI",
  "student_count": 36
}
```

### Delete a Class
```bash
DELETE /api/classes/1
```

## Database Setup

The database automatically creates the `classes` table on first setup. If you're updating an existing installation:

```bash
npm run seed
```

This will:
1. Create the classes table
2. Seed the three default classes (GIINFO1, GIINFO2, GIINFO3)
3. Update existing time slots with class references

## Technical Details

### New Database Table: `classes`
```sql
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(10) NOT NULL,
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Updated Table: `time_slots`
```sql
ALTER TABLE time_slots ADD COLUMN class_id INTEGER REFERENCES classes(id);
```

### New Files
- Backend: `backend/src/models/classesModels.js`
- Backend: `backend/src/controllers/classesControllers.js`
- Backend: `backend/src/routes/classesRoutes.js`

### Updated Files
- `backend/src/data/createTables.js`
- `backend/src/data/seedData.js`
- `backend/src/models/timeSlotModels.js`
- `backend/server.js`
- `frontend/src/types/index.ts`
- `frontend/src/services/api.ts`
- `frontend/src/components/Timetable/CreateTimeSlotForm.tsx`
- `frontend/src/pages/modules/ClassesPage.tsx`

## Troubleshooting

### Classes not showing in dropdown
1. Ensure database is seeded: `npm run seed`
2. Check that `/api/classes` endpoint returns data
3. Clear browser cache and reload

### Class name not displaying after confirmation
1. Verify time slot was created with `class_id`
2. Check database: `SELECT * FROM time_slots WHERE class_id IS NOT NULL;`
3. Ensure frontend is using latest API data

### Error creating time slot with class
1. Verify class exists in database
2. Check that `classId` is being sent in the request
3. Look at browser console for error details

## Next Steps

1. **Test the feature** by creating a time slot with a class
2. **Confirm presence** as a teacher to verify the flow
3. **Add more classes** as needed via API or in seed data
4. **Monitor** confirmation records for attendance tracking

## Support

For issues or questions:
1. Check the IMPLEMENTATION_SUMMARY.md for detailed information
2. Review API response errors in browser console
3. Verify database connectivity

---

**Feature Status:** ✅ Complete and Ready to Use

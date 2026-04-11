# Code Changes Reference

## Backend Changes

### 1. Database Schema - createTables.js

**Added function:**
```javascript
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
    // ... implementation
}
```

**Updated time_slots table:**
- Added: `class_id INTEGER REFERENCES classes(id)` column

**Updated createAllTables():**
- Added: `await createClassesTable();` call

---

### 2. Seed Data - seedData.js

**Added cleanup:**
```javascript
await pool.query('DELETE FROM classes');
```

**Added seed data:**
```javascript
const classesData = [
  { name: 'GIINFO1', department: 'GI', student_count: 35 },
  { name: 'GIINFO2', department: 'GI', student_count: 32 },
  { name: 'GIINFO3', department: 'GI', student_count: 30 }
];

for (const classData of classesData) {
  await pool.query(
    'INSERT INTO classes (name, department, student_count) VALUES ($1, $2, $3) ON CONFLICT (name) DO NOTHING',
    [classData.name, classData.department, classData.student_count]
  );
}
```

**Updated time slot creation:**
```javascript
// Before
const classroomsResult = await pool.query('SELECT id FROM classrooms ORDER BY id LIMIT 1');

// After
const classesResult = await pool.query('SELECT id FROM classes WHERE name = \'GIINFO1\' LIMIT 1');

// In INSERT
INSERT INTO time_slots (..., class_id, ...) VALUES (..., $7, ...)
```

---

### 3. New File - classesModels.js

```javascript
export const classesModels = {
  getAllClasses: async () => { ... },
  getClassesByDepartment: async (department) => { ... },
  getClassById: async (id) => { ... },
  createClass: async (classData) => { ... },
  updateClass: async (id, classData) => { ... },
  deleteClass: async (id) => { ... }
};
```

---

### 4. New File - classesControllers.js

```javascript
export const classesController = {
  getAllClasses: async (req, res) => { ... },
  getClassesByDepartment: async (req, res) => { ... },
  getClassById: async (req, res) => { ... },
  createClass: async (req, res) => { ... },
  updateClass: async (req, res) => { ... },
  deleteClass: async (req, res) => { ... }
};
```

---

### 5. New File - classesRoutes.js

```javascript
import express from 'express';
import { classesController } from '../controllers/classesControllers.js';

const router = express.Router();

router.get('/', classesController.getAllClasses);
router.get('/department/:department', classesController.getClassesByDepartment);
router.get('/:id', classesController.getClassById);
router.post('/', classesController.createClass);
router.put('/:id', classesController.updateClass);
router.delete('/:id', classesController.deleteClass);

export default router;
```

---

### 6. Server Update - server.js

**Added import:**
```javascript
import classesRoutes from "./src/routes/classesRoutes.js";
```

**Added route:**
```javascript
app.use("/api/classes", classesRoutes);
```

---

### 7. Time Slot Models - timeSlotModels.js

**Updated queries to include class information:**

```javascript
// Before
LEFT JOIN classrooms cl ON ts.classroom_id = cl.id

// After
LEFT JOIN classrooms cl ON ts.classroom_id = cl.id
LEFT JOIN classes cs ON ts.class_id = cs.id
```

**Updated SELECT to include:**
```javascript
cs.name as class_name
```

**Updated createTimeSlot:**
```javascript
// Before
const { title, startTime, endTime, classroomId, teacherId, courseId, color } = timeSlotData;
INSERT INTO time_slots (title, start_time, end_time, classroom_id, teacher_id, course_id, color)
VALUES ($1, $2, $3, $4, $5, $6, $7)

// After
const { title, startTime, endTime, classroomId, teacherId, courseId, classId, color } = timeSlotData;
INSERT INTO time_slots (title, start_time, end_time, classroom_id, teacher_id, course_id, class_id, color)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
```

**Updated updateTimeSlot:**
```javascript
// Added class_id to SET clause and parameters
SET ... class_id = $7, ... WHERE id = $9
```

---

## Frontend Changes

### 1. Types Update - types/index.ts

**Updated TimeSlot interface:**
```typescript
// Added
class_id?: number;
class_name?: string;

// To existing interface
export interface TimeSlot {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  classroom_id: number;
  teacher_id: number;
  course_id: number;
  class_id?: number;        // NEW
  color?: string;
  course_name?: string;
  teacher_name?: string;
  classroom_name?: string;
  class_name?: string;      // NEW
  teacher_confirmed?: boolean;
  confirmed_at?: string;
  created_at?: string;
}
```

**New Class interface:**
```typescript
export interface Class {
  id: number;
  name: string;
  department: string;
  student_count: number;
  created_at?: string;
}
```

---

### 2. API Service Update - services/api.ts

**Added new API object:**
```typescript
export const classesAPI = {
  getAll: () => apiCall('/classes'),
  getById: (id: number) => apiCall(`/classes/${id}`),
  getByDepartment: (department: string) => apiCall(`/classes/department/${department}`),
  create: (classData: Class) =>
    apiCall('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    }),
  update: (id: number, classData: Class) =>
    apiCall(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    }),
  delete: (id: number) =>
    apiCall(`/classes/${id}`, {
      method: 'DELETE',
    }),
};
```

---

### 3. Form Update - Timetable/CreateTimeSlotForm.tsx

**Updated imports:**
```typescript
// Before
import { timeSlotsAPI, coursesAPI, teachersAPI, classroomsAPI } from '../../services/api';
import { Course, Teacher, Classroom } from '../../types';

// After
import { timeSlotsAPI, coursesAPI, teachersAPI, classroomsAPI, classesAPI } from '../../services/api';
import { Course, Teacher, Classroom, Class } from '../../types';
```

**Updated state:**
```javascript
const [formData, setFormData] = useState({
  // ... existing fields
  classId: '',              // NEW
  color: '#0ea5e9'
});

const [classes, setClasses] = useState<Class[]>([]);  // NEW
```

**Updated fetchFormData:**
```javascript
// Added to Promise.all
classesAPI.getAll()

// Added to state update
setClasses(classesData);
```

**Updated handleSubmit:**
```javascript
const timeSlotData = {
  // ... existing fields
  classId: formData.classId ? parseInt(formData.classId) : null,  // NEW
  color: formData.color
};

// Reset includes new field
classId: '',
```

**Added new form field (after classroom field):**
```tsx
<div>
  <label htmlFor="classId" className="block text-sm font-medium text-gray-700 mb-1">
    Classe *
  </label>
  <div className="relative">
    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
    <select
      id="classId"
      name="classId"
      value={formData.classId}
      onChange={handleChange}
      required
      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
    >
      <option value="">Sélectionner une classe</option>
      {classes.map((classItem) => (
        <option key={classItem.id} value={classItem.id}>
          {classItem.name} ({classItem.student_count} étudiants)
        </option>
      ))}
    </select>
  </div>
</div>
```

---

### 4. Classes Page Update - pages/modules/ClassesPage.tsx

**Updated current class info display:**

```tsx
// Before
{currentClass && (
  <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
    <div className="flex items-center text-sm text-red-700 mb-1">
      <Clock size={14} className="mr-2" />
      <span className="font-medium">Cours en cours</span>
    </div>
    <p className="text-sm text-red-600 font-medium">{currentClass.course_name || currentClass.title}</p>
    <p className="text-xs text-red-500">
      {new Date(currentClass.start_time).toLocaleTimeString()} - {new Date(currentClass.end_time).toLocaleTimeString()}
    </p>
    {/* confirmation button */}
  </div>
)}

// After
{currentClass && (
  <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-3">
    <div className="flex items-center text-sm text-red-700 mb-1">
      <Clock size={14} className="mr-2" />
      <span className="font-medium">Cours en cours</span>
    </div>
    <p className="text-sm text-red-600 font-medium">{currentClass.course_name || currentClass.title}</p>
    {currentClass.teacher_name && (
      <p className="text-xs text-red-500">Enseignant: {currentClass.teacher_name}</p>
    )}
    {currentClass.classroom_name && (
      <p className="text-xs text-red-500">Salle: {currentClass.classroom_name}</p>
    )}
    {currentClass.class_name && (
      <p className="text-xs text-red-500">Classe: {currentClass.class_name}</p>
    )}
    <p className="text-xs text-red-500">
      {new Date(currentClass.start_time).toLocaleTimeString()} - {new Date(currentClass.end_time).toLocaleTimeString()}
    </p>
    {/* confirmation button */}
  </div>
)}
```

**Updated next class info display:**

```tsx
// Added teacher_name and class_name display similar to above
{!currentClass && nextClass && (
  <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
    {/* ... */}
    {nextClass.teacher_name && (
      <p className="text-xs text-blue-500">Enseignant: {nextClass.teacher_name}</p>
    )}
    {nextClass.class_name && (
      <p className="text-xs text-blue-500">Classe: {nextClass.class_name}</p>
    )}
    {/* ... */}
  </div>
)}
```

---

## Summary of Changed Lines

| File | Changes | Type |
|------|---------|------|
| `backend/src/data/createTables.js` | +15 lines, ~5 modified | Add classes table |
| `backend/src/data/seedData.js` | +20 lines, ~4 modified | Add class seeding |
| `backend/src/models/timeSlotModels.js` | +3 modified, ~20 added to queries | Update joins |
| `backend/src/models/classesModels.js` | +60 lines | NEW FILE |
| `backend/src/controllers/classesControllers.js` | +70 lines | NEW FILE |
| `backend/src/routes/classesRoutes.js` | +15 lines | NEW FILE |
| `backend/server.js` | +2 lines | Add route |
| `frontend/src/types/index.ts` | +8 lines, ~2 modified | Add Class interface |
| `frontend/src/services/api.ts` | +20 lines | Add classesAPI |
| `frontend/src/components/Timetable/CreateTimeSlotForm.tsx` | +30 lines, ~8 modified | Add class dropdown |
| `frontend/src/pages/modules/ClassesPage.tsx` | +15 lines | Display class info |

**Total Backend Changes:** ~200 lines (3 new files, 4 modified)
**Total Frontend Changes:** ~80 lines (4 modified files)
**Total New Lines:** ~280 lines

# Student Classes Feature - README

## 📚 What's New?

Your school management system now includes **Student Classes/Groups** functionality. This allows admins to specify which group of students a teacher teaches when creating course schedules.

## 🎯 Key Features

### For Admins
- Create course schedules with student class selection
- Choose from predefined classes: GIINFO1, GIINFO2, GIINFO3, etc.
- Add new classes via API or database
- View all scheduling information together

### For Teachers
- See which class group is taught in each session
- View complete session details (course, room, time, class)
- Confirm presence with full context

### For System
- Centralized class management
- Proper database relationships
- RESTful API for class operations
- Type-safe frontend components

---

## 🚀 Getting Started

### 1. Database Setup
```bash
cd backend
npm run seed
```

This will create:
- `classes` table
- 3 default classes (GIINFO1, GIINFO2, GIINFO3)
- Updated `time_slots` table with class references

### 2. Start Backend
```bash
npm start
```

### 3. Start Frontend
```bash
cd frontend
npm run dev
```

### 4. Access the Application
Open http://localhost:5173 in your browser

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| `QUICK_START_CLASSES.md` | How to use the feature |
| `IMPLEMENTATION_SUMMARY.md` | Technical details |
| `VISUAL_GUIDE.md` | Architecture diagrams |
| `CHANGES_REFERENCE.md` | Code changes |
| `TESTING_DEPLOYMENT.md` | Testing & deployment |
| `FEATURE_COMPLETE.md` | Implementation status |

---

## 🔑 Key Components

### Backend
- **Model**: `backend/src/models/classesModels.js`
- **Controller**: `backend/src/controllers/classesControllers.js`
- **Routes**: `backend/src/routes/classesRoutes.js`
- **API Endpoint**: `POST/GET/PUT/DELETE /api/classes`

### Frontend
- **Type**: `Class` interface in `types/index.ts`
- **API Service**: `classesAPI` in `services/api.ts`
- **Form**: Class dropdown in `CreateTimeSlotForm.tsx`
- **Display**: Class info in `ClassesPage.tsx`

### Database
- **Table**: `classes` with name, department, student_count
- **Column**: `class_id` foreign key in `time_slots`

---

## 💡 Usage Example

### Create a Schedule with Class

```javascript
// Admin selects:
// - Course: Maintenance et Administration des Reseaux
// - Teacher: Pr. Paune Felix
// - Room: Amphi 100
// - Class: GIINFO1  ← NEW!
// - Time: 08:00-10:00

// Backend receives:
POST /api/timeslots
{
  title: "Maintenance et Administration des Reseaux",
  startTime: "2026-04-11T08:00:00",
  endTime: "2026-04-11T10:00:00",
  courseId: 1,
  teacherId: 2,
  classroomId: 1,
  classId: 1,           ← NEW FIELD
  color: "#3b82f6"
}

// Teacher sees in Classes Module:
Cours en cours
├─ Maintenance et Administration des Reseaux
├─ Enseignant: Pr. Paune Felix
├─ Salle: Amphi 100
├─ Classe: GIINFO1        ← NEW!
└─ 08:00 - 10:00
```

---

## 🔗 API Reference

### Classes Endpoints
```
GET    /api/classes                    - Get all classes
GET    /api/classes/:id                - Get class by ID
GET    /api/classes/department/:dept   - Get classes by department
POST   /api/classes                    - Create new class
PUT    /api/classes/:id                - Update class
DELETE /api/classes/:id                - Delete class
```

### Example Requests
```bash
# Get all classes
curl http://localhost:5000/api/classes

# Get GI department classes
curl http://localhost:5000/api/classes/department/GI

# Create new class
curl -X POST http://localhost:5000/api/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "GIINFO4",
    "department": "GI",
    "student_count": 28
  }'
```

---

## 📊 What's Displayed

### Before
```
Cours en cours
Maintenance et Administration des Reseaux
08:00 - 10:00
```

### After
```
Cours en cours
Maintenance et Administration des Reseaux
Enseignant: Pr. Paune Felix
Salle: Amphi 100
Classe: GIINFO1
08:00 - 10:00
```

---

## ✅ Verification

Check that everything is working:

1. **Backend**: `curl http://localhost:5000/api/classes`
   - Should return list of classes

2. **Form**: Create schedule → Classe dropdown visible
   - Should show GIINFO1, GIINFO2, GIINFO3

3. **Display**: Classes module → View course schedule
   - Should show class name with other info

4. **Database**: 
   ```sql
   SELECT * FROM classes;
   SELECT class_id, class_name FROM time_slots;
   ```

---

## 🛠️ Common Tasks

### Add a New Class
```bash
curl -X POST http://localhost:5000/api/classes \
  -H "Content-Type: application/json" \
  -d '{"name":"ASRINFO1","department":"ASR","student_count":28}'
```

### Update a Class
```bash
curl -X PUT http://localhost:5000/api/classes/1 \
  -H "Content-Type: application/json" \
  -d '{"name":"GIINFO1","department":"GI","student_count":36}'
```

### Delete a Class
```bash
curl -X DELETE http://localhost:5000/api/classes/1
```

### View Classes by Department
```bash
curl http://localhost:5000/api/classes/department/GI
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Classes dropdown empty | Check: `npm run seed` completed, `/api/classes` responds |
| Time slot creation fails | Verify: course, teacher, room, and class are selected |
| Class not showing | Check: class_id is in database, refresh frontend |
| API errors | Check: backend is running, PostgreSQL connected |

See `TESTING_DEPLOYMENT.md` for detailed troubleshooting.

---

## 📋 Files Changed

**New Files (3)**
- `backend/src/models/classesModels.js`
- `backend/src/controllers/classesControllers.js`
- `backend/src/routes/classesRoutes.js`

**Modified Files (8)**
- `backend/src/data/createTables.js`
- `backend/src/data/seedData.js`
- `backend/src/models/timeSlotModels.js`
- `backend/server.js`
- `frontend/src/types/index.ts`
- `frontend/src/services/api.ts`
- `frontend/src/components/Timetable/CreateTimeSlotForm.tsx`
- `frontend/src/pages/modules/ClassesPage.tsx`

**Documentation (5)**
- `IMPLEMENTATION_SUMMARY.md`
- `QUICK_START_CLASSES.md`
- `VISUAL_GUIDE.md`
- `CHANGES_REFERENCE.md`
- `TESTING_DEPLOYMENT.md`
- `FEATURE_COMPLETE.md`

---

## 🎓 Learn More

- **Quick Start**: Read `QUICK_START_CLASSES.md`
- **Architecture**: Read `VISUAL_GUIDE.md`
- **Technical Details**: Read `IMPLEMENTATION_SUMMARY.md`
- **Deploy**: Follow `TESTING_DEPLOYMENT.md`

---

## ✨ Summary

The **Student Classes Feature** is fully implemented and production-ready. Admins can now create schedules with specific student groups, and all information displays cohesively for teachers.

**Ready to use!** 🚀

For questions, see the documentation files or check `TESTING_DEPLOYMENT.md` for troubleshooting.

# Student Classes Feature - Visual Guide

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN INTERFACE                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Create TimeSlot │
                    │      Form        │
                    └──────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
           ┌────────┐   ┌─────────┐   ┌───────┐
           │ Course │   │ Teacher │   │ Room  │
           └────────┘   └─────────┘   └───────┘
                │             │             │
                ▼             ▼             ▼
        (from API)    (from API)    (from API)
                │             │             │
                │             ▼             │
                │        ┌─────────┐       │
                │        │ Class   │◄──────┘
                │        │ Groups  │
                │        └─────────┘
                │         (NEW!)
                │
                └─────────────┬─────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  REST API Call   │
                    │  POST /timeslots │
                    └──────────────────┘
                              │
                              ▼
                ┌─────────────────────────────┐
                │   Database Storage          │
                │  (time_slots + class_id)    │
                └─────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TEACHER INTERFACE                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │ Gestion Classes  │
                    │   (Dashboard)    │
                    └──────────────────┘
                              │
                    ┌─────────┴──────────┐
                    │                    │
                    ▼                    ▼
          ┌──────────────────┐  ┌──────────────────┐
          │ Current Class    │  │  Next Class      │
          │ (if happening)   │  │  (if scheduled)  │
          └──────────────────┘  └──────────────────┘
                    │                    │
        ┌───────────┼───────────┐        │
        │           │           │        │
        ▼           ▼           ▼        ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │ Course │ │Teacher │ │ Room   │ │ Class  │
    │ Name   │ │ Name   │ │ Name   │ │ Name   │
    └────────┘ └────────┘ └────────┘ └────────┘
        │           │           │        │
        └───────────┴───────────┴────────┘
                    │
                    ▼
        ┌───────────────────────────┐
        │ "Confirmer ma Présence"   │
        │      (Confirm Button)     │
        └───────────────────────────┘
                    │
                    ▼
        ┌───────────────────────────┐
        │ Attendance Recorded       │
        │ (teacher_confirmed=TRUE)  │
        └───────────────────────────┘
```

---

## Database Schema

```
┌─────────────────────────────────────┐
│           CLASSES TABLE             │
├─────────────────────────────────────┤
│ id (PK)          │ SERIAL            │
│ name (UNIQUE)    │ VARCHAR(50)       │
│ department       │ VARCHAR(10)       │
│ student_count    │ INTEGER           │
│ created_at       │ TIMESTAMP         │
└─────────────────────────────────────┘
         ▲
         │ 1:N relationship
         │
┌─────────────────────────────────────┐
│       TIME_SLOTS TABLE              │
├─────────────────────────────────────┤
│ id (PK)          │ SERIAL            │
│ title            │ VARCHAR(100)      │
│ start_time       │ TIMESTAMP         │
│ end_time         │ TIMESTAMP         │
│ classroom_id (FK)│ INTEGER           │
│ teacher_id (FK)  │ INTEGER           │
│ course_id (FK)   │ INTEGER           │
│ class_id (FK)    │ INTEGER (NEW!)    │
│ color            │ VARCHAR(7)        │
│ teacher_confirmed│ BOOLEAN           │
│ confirmed_at     │ TIMESTAMP         │
│ created_at       │ TIMESTAMP         │
└─────────────────────────────────────┘
         │   │   │   │
         ▼   ▼   ▼   ▼
    ┌─────────────────────┐
    │  Other Tables:      │
    │  • courses          │
    │  • users (teachers) │
    │  • classrooms       │
    └─────────────────────┘
```

---

## Form Flow

```
Admin Dashboard
      │
      ▼
Click "Ajouter un cours au planning"
      │
      ▼
Modal Opens
      │
      ├─────────────────────────────────┐
      │   Form Fields:                  │
      │   ✓ Date                        │
      │   ✓ Start Time                  │
      │   ✓ End Time                    │
      │   ✓ Course (dropdown)           │
      │   ✓ Teacher (dropdown)          │
      │   ✓ Classroom (dropdown)        │
      │   ✓ Classe (NEW dropdown)       │◄─── LOADS FROM /api/classes
      │   ✓ Color                       │
      └─────────────────────────────────┘
      │
      ▼
Admin fills form including CLASS selection
      │
      ├─── GIINFO1 (35 étudiants)
      ├─── GIINFO2 (32 étudiants)
      ├─── GIINFO3 (30 étudiants)
      │
      ▼
Click "Ajouter au planning"
      │
      ▼
POST /api/timeslots
{
  title: "Maintenance et Admin des Reseaux",
  startTime: "2026-04-11T08:00:00",
  endTime: "2026-04-11T10:00:00",
  courseId: 1,
  teacherId: 2,
  classroomId: 1,
  classId: 1,              ◄─── CLASS ID INCLUDED
  color: "#3b82f6"
}
      │
      ▼
Database INSERT with class_id
      │
      ▼
Success! Time slot created with class
```

---

## Display in Classes Module

```
┌──────────────────────────────────────┐
│     Gestion des Classes              │
│     (Classes Management)             │
└──────────────────────────────────────┘
            │
            ▼
┌──────────────────────────────────────┐
│   Amphi 100 (Capacité: 80 places)    │
├──────────────────────────────────────┤
│  ✅ Disponible                       │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Cours en cours               │    │
│  │ Maintenance et Admin         │    │
│  │ Enseignant: Pr. Paune Felix  │◄── NEW
│  │ Salle: Amphi 100             │◄── NEW
│  │ Classe: GIINFO1              │◄── NEW
│  │ 08:00 - 10:00                │    │
│  │ [Confirmer ma Présence]      │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘

┌──────────────────────────────────────┐
│   Labo 21 (Capacité: 60 places)      │
├──────────────────────────────────────┤
│  ✅ Disponible                       │
│                                      │
│  ┌──────────────────────────────┐    │
│  │ Prochain cours               │    │
│  │ Cryptographie et Application │    │
│  │ Enseignant: Dr. Manga        │◄── NEW
│  │ Classe: GIINFO2              │◄── NEW
│  │ 10:30 - 12:00                │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

---

## Data Flow: Create to Display

```
Step 1: ADMIN CREATES
┌─────────────────────────────────────┐
│ SELECT:                             │
│  - Course: GI101                    │
│  - Teacher: Pr. Paune              │
│  - Room: Amphi 100                 │
│  - Class: GIINFO1 ◄─── NEW        │
│  - Time: 08:00-10:00               │
└─────────────────────────────────────┘
              │
              ▼
Step 2: BACKEND PROCESSES
┌─────────────────────────────────────┐
│ INSERT INTO time_slots (            │
│   course_id: 1,                     │
│   teacher_id: 2,                    │
│   classroom_id: 1,                  │
│   class_id: 1 ◄─── NEW             │
│   start_time: '2026-04-11 08:00',   │
│   end_time: '2026-04-11 10:00'      │
│ )                                   │
└─────────────────────────────────────┘
              │
              ▼
Step 3: DATABASE STORES
┌─────────────────────────────────────┐
│ time_slots record created with      │
│ class_id = 1                        │
│                                     │
│ (Links to classes table:            │
│  classes.id = 1 → 'GIINFO1')       │
└─────────────────────────────────────┘
              │
              ▼
Step 4: TEACHER VIEWS
┌─────────────────────────────────────┐
│ GET /api/timeslots                  │
│                                     │
│ Backend queries:                    │
│ SELECT ts.*, c.name as course_name, │
│   u.name as teacher_name,           │
│   cl.name as classroom_name,        │
│   cs.name as class_name ◄─── NEW   │
│ FROM time_slots ts                  │
│ JOIN courses c ON ts.course_id      │
│ JOIN users u ON ts.teacher_id       │
│ JOIN classrooms cl ON ts.room_id    │
│ JOIN classes cs ON ts.class_id      │◄─── NEW JOIN
└─────────────────────────────────────┘
              │
              ▼
Step 5: FRONTEND DISPLAYS
┌─────────────────────────────────────┐
│ Display on Classes Module:          │
│                                     │
│ 🎓 Cours en cours                  │
│ 📚 Course: Maintenance et Admin     │
│ 👨‍🏫 Teacher: Pr. Paune Felix       │◄─── NEW
│ 🏛️  Room: Amphi 100                 │◄─── NEW
│ 👥 Class: GIINFO1                  │◄─── NEW
│ ⏰ Time: 08:00 - 10:00              │
└─────────────────────────────────────┘
```

---

## Class Selection Hierarchy

```
┌──────────────────────────┐
│   Department Filter      │
│  (GI, ASR, GL, GRT)      │
└──────────────────────────┘
            │
            ▼
┌──────────────────────────┐
│  GI Department Classes   │
├──────────────────────────┤
│ ✓ GIINFO1 (35 students)  │
│ ✓ GIINFO2 (32 students)  │
│ ✓ GIINFO3 (30 students)  │
│ ✓ GIINFO4 (28 students)  │
│   ...                    │
└──────────────────────────┘
            │
            ▼
┌──────────────────────────┐
│ Teacher can only see:    │
│ Classes from their dept  │
└──────────────────────────┘
```

---

## API Endpoints Hierarchy

```
/api/classes/
    │
    ├── GET  /               ← Get all classes
    │
    ├── GET  /:id            ← Get single class
    │
    ├── GET  /department/:dept ← Get classes by dept
    │
    ├── POST /               ← Create new class
    │
    ├── PUT  /:id            ← Update class
    │
    └── DELETE /:id          ← Delete class

Example Responses:

GET /api/classes
[
  { id: 1, name: "GIINFO1", department: "GI", student_count: 35 },
  { id: 2, name: "GIINFO2", department: "GI", student_count: 32 },
  { id: 3, name: "GIINFO3", department: "GI", student_count: 30 }
]

GET /api/timeslots
[
  {
    id: 1,
    title: "Maintenance et Admin",
    course_name: "Maintenance et Administration des Reseaux",
    teacher_name: "Pr. Paune Felix",        ◄── Already existed
    classroom_name: "Amphi 100",            ◄── Already existed
    class_name: "GIINFO1",                  ◄── NEW
    start_time: "2026-04-11T08:00:00",
    end_time: "2026-04-11T10:00:00",
    teacher_confirmed: false,
    class_id: 1                             ◄── NEW
  }
]
```

---

## State Management - React

```
CreateTimeSlotForm Component

State:
┌─────────────────────────────┐
│ formData = {                │
│   date: string              │
│   startTime: string         │
│   endTime: string           │
│   courseId: string          │
│   teacherId: string         │
│   classroomId: string       │
│   classId: string  ◄─── NEW │
│   color: string             │
│ }                           │
│                             │
│ courses: Course[]           │
│ teachers: Teacher[]         │
│ classrooms: Classroom[]     │
│ classes: Class[]  ◄─── NEW  │
└─────────────────────────────┘

Handler Flow:
onChange → setFormData
          ↓
        formData.classId = selected value
          ↓
onSubmit → useClassId in API call
          ↓
POST /api/timeslots with classId
```

---

## Comparison: Before vs After

### Before Implementation
```
Time Slot Info:
- Course: Maintenance et Admin ✓
- Teacher: (stored but not displayed)
- Room: Amphi 100 ✓
- Time: 08:00-10:00 ✓
```

### After Implementation
```
Time Slot Info:
- Course: Maintenance et Admin ✓
- Teacher: Pr. Paune Felix ✓ (displayed)
- Room: Amphi 100 ✓
- Class: GIINFO1 ✓ (NEW!)
- Time: 08:00-10:00 ✓
```

---

## Summary Statistics

```
New Database Table:      1 (classes)
New Backend Models:      1 (classesModels.js)
New Backend Controllers: 1 (classesControllers.js)
New Backend Routes:      1 (classesRoutes.js)
Updated Backend Models:  1 (timeSlotModels.js)
Updated Frontend Types:  1 (index.ts)
Updated Frontend API:    1 (api.ts)
Updated Frontend Forms:  1 (CreateTimeSlotForm.tsx)
Updated Frontend Pages:  1 (ClassesPage.tsx)

Total New Code:          ~280 lines
Total Modified Code:     ~80 lines
New Database Columns:    1 (class_id in time_slots)
Seed Records:            3 default classes

API Endpoints Added:     6 (/api/classes endpoints)
UI Components Added:     1 (Class dropdown selector)
```

---

This visual guide should help you understand the complete flow and architecture of the student classes feature!

# Testing & Deployment Guide

## Pre-Deployment Checklist

### Backend Setup
- [ ] Node.js v14+ installed
- [ ] PostgreSQL running and accessible
- [ ] Environment variables configured (.env file)
- [ ] Dependencies installed: `npm install`

### Frontend Setup
- [ ] Node.js v14+ installed
- [ ] npm or pnpm installed
- [ ] Dependencies installed: `npm install` or `pnpm install`
- [ ] API base URL configured (localhost:5000 for dev)

---

## Deployment Steps

### Step 1: Database Setup

#### Option A: Fresh Installation
```bash
cd backend
npm run seed
```

This will:
1. Create all tables including the new `classes` table
2. Seed the database with GIINFO1, GIINFO2, GIINFO3 classes
3. Create sample time slots with class associations

#### Option B: Existing Installation with Migration
```bash
# Run manual migration
psql -U your_user -d your_db -c "
CREATE TABLE IF NOT EXISTS classes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    department VARCHAR(10) NOT NULL CHECK (department IN ('GI', 'ASR', 'GL', 'GRT')),
    student_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE time_slots ADD COLUMN class_id INTEGER REFERENCES classes(id);

INSERT INTO classes (name, department, student_count) VALUES
('GIINFO1', 'GI', 35),
('GIINFO2', 'GI', 32),
('GIINFO3', 'GI', 30);
"
```

### Step 2: Backend Deployment

```bash
cd backend

# Install dependencies
npm install

# Start the server
npm start
# or for development with auto-reload
npm run dev
```

**Verify backend is running:**
```bash
curl http://localhost:5000/api/classes
# Should return: [{"id":1,"name":"GIINFO1",...}, ...]
```

### Step 3: Frontend Deployment

```bash
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or for production build
npm run build
```

**Verify frontend is running:**
- Open http://localhost:5173 (or configured port)
- You should see the dashboard login page

---

## Testing Procedures

### 1. API Endpoint Testing

#### Test Classes API

```bash
# Get all classes
curl -X GET http://localhost:5000/api/classes

# Expected response:
[
  {"id":1,"name":"GIINFO1","department":"GI","student_count":35,"created_at":"2026-04-11T..."},
  {"id":2,"name":"GIINFO2","department":"GI","student_count":32,"created_at":"2026-04-11T..."},
  {"id":3,"name":"GIINFO3","department":"GI","student_count":30,"created_at":"2026-04-11T..."}
]

# Get class by ID
curl -X GET http://localhost:5000/api/classes/1

# Get classes by department
curl -X GET http://localhost:5000/api/classes/department/GI

# Create new class
curl -X POST http://localhost:5000/api/classes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "ASRINFO1",
    "department": "ASR",
    "student_count": 28
  }'

# Update class
curl -X PUT http://localhost:5000/api/classes/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "GIINFO1",
    "department": "GI",
    "student_count": 36
  }'

# Delete class
curl -X DELETE http://localhost:5000/api/classes/1
```

#### Test Time Slots API (with class_id)

```bash
# Get all time slots (should include class_name)
curl -X GET http://localhost:5000/api/timeslots

# Expected response includes:
{
  "id": 1,
  "title": "Maintenance et Administration des Reseaux",
  "course_name": "Maintenance et Administration des Reseaux",
  "teacher_name": "Pr. Paune Felix",
  "classroom_name": "Amphi 100",
  "class_name": "GIINFO1",           ◄── NEW FIELD
  "class_id": 1,                      ◄── NEW FIELD
  "start_time": "2026-04-11T08:00:00",
  "end_time": "2026-04-11T18:00:00",
  "teacher_confirmed": false
}

# Create time slot with class
curl -X POST http://localhost:5000/api/timeslots \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Course Name",
    "startTime": "2026-04-11T08:00:00",
    "endTime": "2026-04-11T10:00:00",
    "courseId": 1,
    "teacherId": 2,
    "classroomId": 1,
    "classId": 1,                     ◄── NEW FIELD
    "color": "#3b82f6"
  }'
```

### 2. Frontend UI Testing

#### Create Time Slot Form

**Test Steps:**
1. Login as admin
2. Navigate to Timetable module
3. Click "Ajouter un cours au planning"
4. Verify form loads with all fields
5. **Verify "Classe" dropdown appears with:**
   - GIINFO1 (35 étudiants)
   - GIINFO2 (32 étudiants)
   - GIINFO3 (30 étudiants)
6. Fill form:
   - Date: Today
   - Start Time: 08:00
   - End Time: 10:00
   - Course: Select any
   - Teacher: Select any
   - Classroom: Select any
   - **Classe: GIINFO1** (NEW)
   - Color: Default
7. Click "Ajouter au planning"
8. **Verify success message** and form closes

**Expected Behavior:**
- Form validates all required fields including classe
- No console errors
- Time slot is created in database with class_id

#### Classes Module Display

**Test Steps:**
1. Login as admin or teacher
2. Navigate to "Gestion des Classes"
3. Verify classroom cards display
4. Create/trigger a time slot for current time with a classe
5. **Verify current class info box shows:**
   - ✓ Course name
   - ✓ **Teacher name** (NEW)
   - ✓ **Classroom name** (NEW)
   - ✓ **Classe name** (NEW) - e.g., "GIINFO1"
   - ✓ Time slot
   - ✓ Confirmation button

**Expected Display:**
```
Cours en cours
Maintenance et Administration des Reseaux
Enseignant: Pr. Paune Felix
Salle: Amphi 100
Classe: GIINFO1
08:00 - 10:00
[Confirmer ma Présence]
```

#### Next Class Preview

**Test Steps:**
1. Ensure no current class but a future class exists with classe
2. On Classes module, should show next class
3. **Verify next class displays:**
   - ✓ Course name
   - ✓ **Teacher name** (NEW)
   - ✓ **Classe name** (NEW)
   - ✓ Time slot

### 3. Database Testing

```sql
-- Verify classes table created
SELECT * FROM classes;
-- Should return 3 rows (GIINFO1, GIINFO2, GIINFO3)

-- Verify time_slots has class_id column
\d time_slots
-- Should show class_id column with Foreign Key to classes

-- Verify time slot associations
SELECT 
  ts.id,
  ts.title,
  c.name as class_name,
  ts.class_id
FROM time_slots ts
LEFT JOIN classes c ON ts.class_id = c.id;

-- Should return time slots with class associations
```

### 4. Integration Testing

**Full Workflow Test:**

```
1. Admin Login
   └─ Navigate to Timetable
      └─ Create Time Slot
         └─ Select:
            - Course: GI101
            - Teacher: Pr. Paune
            - Classroom: Amphi 100
            - Classe: GIINFO1 ◄── KEY TEST
         └─ Submit Form
            └─ Verify: "Time slot created successfully"
               └─ Database: Check time_slots.class_id = 1
                  
2. Teacher Login
   └─ Navigate to Classes Module
      └─ Verify Classroom Card displays
         └─ IF current: Show "Cours en cours" with:
            - Course name ✓
            - Teacher name ✓
            - Classroom name ✓
            - Classe: GIINFO1 ✓
            └─ Click "Confirmer ma Présence"
               └─ Verify: teacher_confirmed = TRUE
               
3. Admin Views Results
   └─ Check confirmation status
      └─ Verify all class info was stored and displayed
```

### 5. Error Testing

**Test Error Scenarios:**

1. **Missing Classe Selection**
   - Try to create time slot without selecting classe
   - Expected: Form validation prevents submission (if marked required)
   - Actual: classId will be null (acceptable - classe is optional)

2. **Invalid Classe ID**
   - POST with classId: 999 (non-existent)
   - Expected: Database constraint error
   - Actual: Foreign key constraint violation

3. **API Failures**
   - Stop backend server
   - Try to load form
   - Expected: Error message in form

4. **Database Disconnection**
   - Stop PostgreSQL
   - Try operations
   - Expected: Backend error responses

---

## Performance Testing

### Load Testing

```bash
# Test with Apache Bench (ab)
ab -n 1000 -c 10 http://localhost:5000/api/classes

# Test with wrk
wrk -t4 -c100 -d30s http://localhost:5000/api/timeslots
```

### Expected Results:
- Classes API: < 100ms response time
- Time slots API: < 200ms response time
- Database query time: < 50ms

---

## Monitoring & Logging

### Backend Logs

```bash
# Start with logs
npm run dev > server.log 2>&1

# Monitor logs
tail -f server.log

# Look for:
- Time slot creation success/failure
- API calls to /api/classes
- Database query errors
```

### Frontend Console

- Open DevTools (F12)
- Check Console tab for errors
- Verify network requests to /api/classes and /api/timeslots
- Check that responses include class_id and class_name

---

## Rollback Procedure

If issues occur:

### Revert Database Changes
```sql
-- Remove class_id column from time_slots
ALTER TABLE time_slots DROP COLUMN class_id;

-- Drop classes table
DROP TABLE IF EXISTS classes;
```

### Revert Code Changes
```bash
# Checkout previous version (if using git)
git checkout HEAD~1 -- backend/src/data/createTables.js
git checkout HEAD~1 -- backend/src/data/seedData.js
git checkout HEAD~1 -- backend/src/models/timeSlotModels.js
git checkout HEAD~1 -- frontend/src/components/Timetable/CreateTimeSlotForm.tsx
git checkout HEAD~1 -- frontend/src/pages/modules/ClassesPage.tsx
```

---

## Production Deployment

### Environment Configuration

Create `.env` file:
```
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production
PORT=5000
REACT_APP_API_URL=https://api.yourdomain.com
```

### Build Frontend
```bash
cd frontend
npm run build
# Output to dist/
```

### Deploy Frontend
```bash
# Using Docker
docker build -t school-management-frontend .
docker run -p 80:80 school-management-frontend

# Or using traditional server
cp -r dist/* /var/www/html/
```

### Deploy Backend
```bash
# Using Node process manager (PM2)
npm install -g pm2
pm2 start server.js --name "school-api"
pm2 save
pm2 startup

# Using Docker
docker build -t school-management-backend -f Dockerfile .
docker run -p 5000:5000 --env-file .env school-management-backend
```

### Database Backup
```bash
# Backup before deployment
pg_dump school_db > backup_$(date +%Y%m%d_%H%M%S).sql

# Test restore
pg_restore -d test_db backup_*.sql
```

---

## Post-Deployment Verification

- [ ] API endpoints respond correctly
- [ ] Frontend loads without errors
- [ ] Classes dropdown populates
- [ ] Time slot creation works
- [ ] Classes display in module
- [ ] Confirmation button works
- [ ] Database stores all information
- [ ] No console errors
- [ ] Performance acceptable
- [ ] Logging shows normal operation

---

## Support & Troubleshooting

### Common Issues

**Issue:** Classes dropdown empty
- Check: `/api/classes` returns data
- Check: Frontend is fetching from correct URL
- Check: CORS is enabled

**Issue:** Time slot created but no class displayed
- Check: class_id is being sent in POST request
- Check: Database has class_id value
- Check: Frontend is checking for class_name in response

**Issue:** Database errors on creation
- Check: PostgreSQL is running
- Check: Tables exist with correct schema
- Check: Foreign keys are properly configured

**Issue:** Frontend form validation fails
- Check: All required fields are filled
- Check: No browser console errors
- Check: API error response in Network tab

### Getting Help

1. Check `IMPLEMENTATION_SUMMARY.md` for detailed info
2. Review `QUICK_START_CLASSES.md` for feature usage
3. Check `VISUAL_GUIDE.md` for architecture
4. Review browser console and server logs
5. Verify database schema with `\d tables`

---

This guide covers complete deployment, testing, and production readiness for the Student Classes feature!

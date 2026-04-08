# Admin-Only Permissions Test Guide

## Overview
This document outlines the changes made to implement admin-only permissions for data modification in the ERP system.

## Changes Made

### Frontend Changes

1. **Updated Permission Checks**
   - `TimetablePage.tsx`: Only admins can add/delete time slots
   - `EquipmentPage.tsx`: Only admins can add/modify/delete equipment
   - `CoursesPage.tsx`: Only admins can add/modify/delete courses
   - `TeachersPage.tsx`: Only admins can add teachers (already implemented)

2. **Added Edit Functionality**
   - `EditCourseForm.tsx`: New component for editing courses (admin only)
   - `EditEquipmentForm.tsx`: New component for editing equipment (admin only)
   - Both forms pre-populate with existing data and allow full modification

3. **Added Visual Indicators**
   - Yellow notice boxes for non-admin users explaining they can only view data
   - Blue help boxes for admin users with modification tips

4. **Enhanced Authentication**
   - Updated `AuthContext.tsx` to initialize user state from localStorage
   - Updated `api.ts` to automatically include JWT token in all requests

### Backend Changes

1. **Created Authentication Middleware**
   - `authMiddleware.js`: JWT verification and role-based access control
   - `authenticateToken`: Verifies JWT tokens
   - `requireAdmin`: Ensures only admin users can access protected routes

2. **Protected All Modification Routes**
   - Equipment routes: POST, PUT, DELETE require admin
   - Course routes: POST, PUT, DELETE require admin
   - Teacher routes: POST, PUT, DELETE require admin
   - TimeSlot routes: POST, PUT, DELETE require admin
   - Classroom routes: POST, PUT, DELETE require admin
   - Book routes: POST, PUT, DELETE require admin
   - Exam routes: POST, PUT, DELETE require admin
   - Transaction routes: POST, PUT, DELETE require admin

## Testing the Implementation

### Test Cases

1. **Admin User (Should have full access)**
   - Login as admin user
   - Verify all "Add" buttons are visible
   - Verify all "Edit" and "Delete" buttons are visible
   - Verify modification operations work correctly
   - Test editing courses: click "Modifier" → form opens with pre-filled data → modify → save → verify changes
   - Test editing equipment: click "Modifier" → form opens with pre-filled data → modify → save → verify changes

2. **Teacher User (Should have read-only access)**
   - Login as teacher user
   - Verify "Add" buttons are NOT visible
   - Verify "Edit" and "Delete" buttons are NOT visible
   - Verify yellow notice boxes appear explaining admin-only access
   - Verify modification operations return 403 errors

3. **Student User (Should have read-only access)**
   - Login as student user
   - Verify "Add" buttons are NOT visible
   - Verify "Edit" and "Delete" buttons are NOT visible
   - Verify yellow notice boxes appear explaining admin-only access
   - Verify modification operations return 403 errors

### API Endpoints to Test

**Protected Endpoints (Admin Only):**
- POST /api/equipment
- PUT /api/equipment/:id
- DELETE /api/equipment/:id
- POST /api/courses
- PUT /api/courses/:id
- DELETE /api/courses/:id
- POST /api/teachers
- PUT /api/teachers/:id
- DELETE /api/teachers/:id
- POST /api/timeslots
- PUT /api/timeslots/:id
- DELETE /api/timeslots/:id
- POST /api/classrooms
- PUT /api/classrooms/:id
- DELETE /api/classrooms/:id
- POST /api/books
- PUT /api/books/:id
- DELETE /api/books/:id
- POST /api/exams
- PUT /api/exams/:id
- DELETE /api/exams/:id
- POST /api/transactions
- PUT /api/transactions/:id
- DELETE /api/transactions/:id

**Public Endpoints (All Users):**
- GET /api/equipment
- GET /api/equipment/:id
- GET /api/courses
- GET /api/courses/:id
- GET /api/teachers
- GET /api/teachers/:id
- GET /api/timeslots
- GET /api/timeslots/:id
- GET /api/classrooms
- GET /api/classrooms/:id
- GET /api/books
- GET /api/books/:id
- GET /api/exams
- GET /api/exams/:id
- GET /api/transactions
- GET /api/transactions/:id

## Expected Behavior

1. **Admin Users:**
   - Can view all data
   - Can add new records
   - Can modify existing records (via edit forms)
   - Can delete records
   - See blue help boxes with modification tips
   - Edit forms pre-populate with existing data
   - Success messages appear after successful modifications

2. **Non-Admin Users (Teachers/Students):**
   - Can view all data
   - Cannot add new records (buttons hidden)
   - Cannot modify existing records (buttons hidden)
   - Cannot delete records (buttons hidden)
   - See yellow notice boxes explaining admin-only access
   - API calls to modification endpoints return 403 Forbidden

## Security Notes

- JWT tokens are automatically included in all API requests
- Backend validates both authentication and authorization
- Frontend hides modification UI elements for non-admin users
- All modification operations require valid admin JWT token
- Unauthorized requests return proper HTTP status codes (401/403) 
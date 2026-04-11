const API_BASE_URL = 'http://localhost:5000/api';

// Generic API call function
const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    apiCall('/users/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (userData: any) =>
    apiCall('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
};

// Users API
export const usersAPI = {
  getAll: () => apiCall('/users'),
  getById: (id: number) => apiCall(`/users/${id}`),
  create: (userData: any) =>
    apiCall('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  update: (id: number, userData: any) =>
    apiCall(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),
  delete: (id: number) =>
    apiCall(`/users/${id}`, {
      method: 'DELETE',
    }),
};

// Teachers API
export const teachersAPI = {
  getAll: () => apiCall('/teachers'),
  getById: (id: number) => apiCall(`/teachers/${id}`),
  getWithCourses: () => apiCall('/teachers/with-courses'),
  create: (teacherData: any) => {
    const token = localStorage.getItem('token');
    return apiCall('/teachers', {
      method: 'POST',
      body: JSON.stringify(teacherData),
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
  },
  update: (id: number, teacherData: any) =>
    apiCall(`/teachers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(teacherData),
    }),
  delete: (id: number) =>
    apiCall(`/teachers/${id}`, {
      method: 'DELETE',
    }),
};

// Courses API
export const coursesAPI = {
  getAll: () => apiCall('/courses'),
  getById: (id: number) => apiCall(`/courses/${id}`),
  create: (courseData: any) =>
    apiCall('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    }),
  update: (id: number, courseData: any) =>
    apiCall(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    }),
  delete: (id: number) =>
    apiCall(`/courses/${id}`, {
      method: 'DELETE',
    }),
};

// Classrooms API
export const classroomsAPI = {
  getAll: () => apiCall('/classrooms'),
  getById: (id: number) => apiCall(`/classrooms/${id}`),
  create: (classroomData: any) =>
    apiCall('/classrooms', {
      method: 'POST',
      body: JSON.stringify(classroomData),
    }),
  update: (id: number, classroomData: any) =>
    apiCall(`/classrooms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classroomData),
    }),
  delete: (id: number) =>
    apiCall(`/classrooms/${id}`, {
      method: 'DELETE',
    }),
};

// Classes API
export const classesAPI = {
  getAll: () => apiCall('/classes'),
  getById: (id: number) => apiCall(`/classes/${id}`),
  getByDepartment: (department: string) => apiCall(`/classes/department/${department}`),
  create: (classData: any) =>
    apiCall('/classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    }),
  update: (id: number, classData: any) =>
    apiCall(`/classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    }),
  delete: (id: number) =>
    apiCall(`/classes/${id}`, {
      method: 'DELETE',
    }),
};

// Time Slots API
export const timeSlotsAPI = {
  getAll: () => apiCall('/timeslots'),
  getById: (id: number) => apiCall(`/timeslots/${id}`),
  create: (timeSlotData: any) =>
    apiCall('/timeslots', {
      method: 'POST',
      body: JSON.stringify(timeSlotData),
    }),
  update: (id: number, timeSlotData: any) =>
    apiCall(`/timeslots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(timeSlotData),
    }),
  delete: (id: number) =>
    apiCall(`/timeslots/${id}`, {
      method: 'DELETE',
    }),
  confirm: (id: number) => apiCall(`/timeslots/${id}/confirm`, { method: 'POST' }),
};

// Equipment API
export const equipmentAPI = {
  getAll: () => apiCall('/equipment'),
  getById: (id: number) => apiCall(`/equipment/${id}`),
  getByStatus: (status: string) => apiCall(`/equipment/status/${status}`),
  create: (equipmentData: any) =>
    apiCall('/equipment', {
      method: 'POST',
      body: JSON.stringify(equipmentData),
    }),
  update: (id: number, equipmentData: any) =>
    apiCall(`/equipment/${id}`, {
      method: 'PUT',
      body: JSON.stringify(equipmentData),
    }),
  delete: (id: number) =>
    apiCall(`/equipment/${id}`, {
      method: 'DELETE',
    }),
};

// Books API
export const booksAPI = {
  getAll: () => apiCall('/books'),
  getById: (id: number) => apiCall(`/books/${id}`),
  search: (query: string) => apiCall(`/books/search?q=${encodeURIComponent(query)}`),
  create: (bookData: any) =>
    apiCall('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    }),
  update: (id: number, bookData: any) =>
    apiCall(`/books/${id}`, {
      method: 'PUT',
      body: JSON.stringify(bookData),
    }),
  delete: (id: number) =>
    apiCall(`/books/${id}`, {
      method: 'DELETE',
    }),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => apiCall('/transactions'),
  getById: (id: number) => apiCall(`/transactions/${id}`),
  getByType: (type: string) => apiCall(`/transactions/type/${type}`),
  getSummary: () => apiCall('/transactions/summary'),
  create: (transactionData: any) =>
    apiCall('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    }),
  update: (id: number, transactionData: any) =>
    apiCall(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(transactionData),
    }),
  delete: (id: number) =>
    apiCall(`/transactions/${id}`, {
      method: 'DELETE',
    }),
};

// Exams API
export const examsAPI = {
  getAll: () => apiCall('/exams'),
  getById: (id: number) => apiCall(`/exams/${id}`),
  getByCourse: (courseId: number) => apiCall(`/exams/course/${courseId}`),
  create: (examData: any) =>
    apiCall('/exams', {
      method: 'POST',
      body: JSON.stringify(examData),
    }),
  update: (id: number, examData: any) =>
    apiCall(`/exams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(examData),
    }),
  delete: (id: number) =>
    apiCall(`/exams/${id}`, {
      method: 'DELETE',
    }),
}; 
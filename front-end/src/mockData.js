// src/mockData.js
export const USERS = [
  { id: 'S1', name: 'Arjun Reddy', email: 'student@college.edu', role: 'student', dept: 'CSE', sem: '6', section: 'A', points: 120 },
  { id: 'S2', name: 'Priya Sharma', email: 'priya@college.edu', role: 'student', dept: 'ECE', sem: '4', section: 'B', points: 85 },
  { id: 'S3', name: 'Rahul Verma', email: 'rahul@college.edu', role: 'student', dept: 'CSE', sem: '6', section: 'A', points: 150 },
  { id: 'M1', name: 'Dr. Sarah Wilson', email: 'mentor@college.edu', role: 'mentor', dept: 'CSE' },
  { id: 'H1', name: 'Prof. Alan Grant', email: 'hod@college.edu', role: 'hod', dept: 'CSE' },
];

export const EVENTS = [
  { id: 1, title: 'AI Workshop 2024', date: '2024-03-15', category: 'Technical', points: 20 },
  { id: 2, title: 'CodeHack Hackathon', date: '2024-04-10', category: 'Competition', points: 50 },
  { id: 3, title: 'Cultural Fest Volunteer', date: '2024-02-20', category: 'Extra-curricular', points: 10 },
  { id: 4, title: 'Web Dev Bootcamp', date: '2024-05-01', category: 'Technical', points: 30 },
];

export const INITIAL_CERTIFICATES = [
  { id: 101, studentId: 'S1', studentName: 'Arjun Reddy', eventId: 1, eventName: 'AI Workshop 2024', status: 'approved', dept: 'CSE', file: 'cert_1.pdf' },
  { id: 102, studentId: 'S2', studentName: 'Priya Sharma', eventId: 2, eventName: 'CodeHack Hackathon', status: 'pending_mentor', dept: 'ECE', file: 'cert_2.pdf' },
  { id: 103, studentId: 'S3', studentName: 'Rahul Verma', eventId: 1, eventName: 'AI Workshop 2024', status: 'pending_hod', dept: 'CSE', file: 'cert_3.pdf' },
];

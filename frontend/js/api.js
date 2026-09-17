/**
 * StudentHub API Client
 * Manages communication with Django REST Framework backend
 */

class StudentAPI {
    constructor() {
        this.storageKey = 'studenthub_api_base_url';
        this.baseUrl = localStorage.getItem(this.storageKey) || 'http://127.0.0.1:8000';
    }

    getBaseUrl() {
        return this.baseUrl;
    }

    setBaseUrl(url) {
        // Strip trailing slash
        this.baseUrl = url.replace(/\/+$/, '');
        localStorage.setItem(this.storageKey, this.baseUrl);
    }

    resetBaseUrl() {
        this.baseUrl = 'http://127.0.0.1:8000';
        localStorage.removeItem(this.storageKey);
    }

    async testConnection() {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 4000);
            
            const response = await fetch(`${this.baseUrl}/api/students/`, {
                method: 'GET',
                headers: { 'Accept': 'application/json' },
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response.ok;
        } catch (err) {
            return false;
        }
    }

    async getStudents() {
        const response = await fetch(`${this.baseUrl}/api/students/`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch students (Status: ${response.status})`);
        }
        return await response.json();
    }

    async getStudent(id) {
        const response = await fetch(`${this.baseUrl}/api/students/${id}/`, {
            headers: { 'Accept': 'application/json' }
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch student details (Status: ${response.status})`);
        }
        return await response.json();
    }

    async createStudent(studentData) {
        const response = await fetch(`${this.baseUrl}/api/students/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const message = errorBody ? Object.entries(errorBody).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ') : `Error ${response.status}`;
            throw new Error(message);
        }
        return await response.json();
    }

    async updateStudent(id, studentData) {
        const response = await fetch(`${this.baseUrl}/api/students/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(studentData)
        });
        if (!response.ok) {
            const errorBody = await response.json().catch(() => null);
            const message = errorBody ? Object.entries(errorBody).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`).join(' | ') : `Error ${response.status}`;
            throw new Error(message);
        }
        return await response.json();
    }

    async deleteStudent(id) {
        const response = await fetch(`${this.baseUrl}/api/students/${id}/`, {
            method: 'DELETE'
        });
        if (!response.ok && response.status !== 204) {
            throw new Error(`Failed to delete student (Status: ${response.status})`);
        }
        return true;
    }
}

// Mock fallback dataset in case backend is offline during initial demo view
const MOCK_STUDENTS = [
    { id: 1, student_id: "CS-2024-001", name: "Aarav Patel", email: "aarav.patel@univ.edu", department: "Computer Science", year: 3, phone: "+91 98765 43210" },
    { id: 2, student_id: "IT-2025-042", name: "Sophia Martinez", email: "sophia.m@univ.edu", department: "Information Technology", year: 2, phone: "+1 555-019-2834" },
    { id: 3, student_id: "EE-2023-108", name: "Chen Wei", email: "chen.wei@univ.edu", department: "Electrical Engineering", year: 4, phone: "+86 138 0013 8000" },
    { id: 4, student_id: "ME-2026-015", name: "Emma Johnson", email: "emma.j@univ.edu", department: "Mechanical Engineering", year: 1, phone: "+1 555-432-8765" },
    { id: 5, student_id: "DS-2024-088", name: "Rahul Sharma", email: "rahul.sharma@univ.edu", department: "Data Science", year: 3, phone: "+91 91234 56789" },
    { id: 6, student_id: "BA-2025-031", name: "Elena Rostova", email: "elena.r@univ.edu", department: "Business Administration", year: 2, phone: "+44 20 7946 0912" }
];

window.StudentAPI = new StudentAPI();
window.MOCK_STUDENTS = MOCK_STUDENTS;

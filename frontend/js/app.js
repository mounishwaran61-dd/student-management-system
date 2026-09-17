/**
 * StudentHub Application Controller
 * Handles UI interactions, state management, modal logic, and data synchronization.
 */

document.addEventListener('DOMContentLoaded', () => {
    // State
    const state = {
        students: [],
        filteredStudents: [],
        isMockMode: false,
        viewMode: 'table', // 'table' or 'grid'
        deleteTarget: null,
        searchTerm: '',
        selectedDepartment: '',
        selectedYear: '',
        sortBy: 'name-asc',
        theme: localStorage.getItem('studenthub_theme') || 'light'
    };

    // DOM Elements
    const elements = {
        // Theme & Navigation
        themeToggle: document.getElementById('theme-toggle'),
        themeIcon: document.getElementById('theme-icon'),
        sidebar: document.getElementById('sidebar'),
        btnToggleSidebar: document.getElementById('btn-toggle-sidebar'),
        serverStatus: document.getElementById('server-status'),
        statusDot: document.querySelector('#server-status .status-dot'),
        statusText: document.querySelector('#server-status .status-text'),
        
        // Stats
        statTotalStudents: document.getElementById('stat-total-students'),
        statTotalDepartments: document.getElementById('stat-total-departments'),
        statAvgYear: document.getElementById('stat-avg-year'),
        statApiStatus: document.getElementById('stat-api-status'),
        statApiEndpoint: document.getElementById('stat-api-endpoint'),
        badgeStudentCount: document.getElementById('badge-student-count'),
        footerRecordCount: document.getElementById('footer-record-count'),

        // Toolbar & Filters
        searchInput: document.getElementById('search-input'),
        btnClearSearch: document.getElementById('btn-clear-search'),
        filterDepartment: document.getElementById('filter-department'),
        filterYear: document.getElementById('filter-year'),
        sortBy: document.getElementById('sort-by'),
        viewTableBtn: document.getElementById('view-table-btn'),
        viewGridBtn: document.getElementById('view-grid-btn'),
        tableContainer: document.getElementById('table-container'),
        gridContainer: document.getElementById('grid-container'),
        tableBody: document.getElementById('students-table-body'),
        gridBody: document.getElementById('students-grid-body'),

        // Action Buttons
        btnAddStudentModal: document.getElementById('btn-add-student-modal'),
        btnEmptyAddStudent: document.getElementById('btn-empty-add-student'),
        btnRefreshData: document.getElementById('btn-refresh-data'),
        btnQuickSync: document.getElementById('btn-quick-sync'),
        btnExportCsv: document.getElementById('btn-export-csv'),
        btnOpenSettings: document.getElementById('btn-open-settings'),
        btnConfigureApi: document.getElementById('btn-configure-api'),

        // State Containers
        loadingState: document.getElementById('loading-state'),
        emptyState: document.getElementById('empty-state'),
        errorState: document.getElementById('error-state'),
        errorStateMessage: document.getElementById('error-state-message'),
        btnRetryConnection: document.getElementById('btn-retry-connection'),
        btnLoadDemoData: document.getElementById('btn-load-demo-data'),

        // Modals
        studentModal: document.getElementById('student-modal'),
        modalTitle: document.getElementById('modal-title'),
        studentForm: document.getElementById('student-form'),
        formStudentPk: document.getElementById('form-student-pk'),
        formStudentId: document.getElementById('form-student-id'),
        formName: document.getElementById('form-name'),
        formEmail: document.getElementById('form-email'),
        formDepartment: document.getElementById('form-department'),
        formYear: document.getElementById('form-year'),
        formPhone: document.getElementById('form-phone'),
        btnCloseStudentModal: document.getElementById('btn-close-student-modal'),
        btnCancelStudentModal: document.getElementById('btn-cancel-student-modal'),

        deleteModal: document.getElementById('delete-modal'),
        deleteStudentName: document.getElementById('delete-student-name'),
        btnCloseDeleteModal: document.getElementById('btn-close-delete-modal'),
        btnCancelDelete: document.getElementById('btn-cancel-delete'),
        btnConfirmDelete: document.getElementById('btn-confirm-delete'),

        settingsModal: document.getElementById('settings-modal'),
        settingsApiUrl: document.getElementById('settings-api-url'),
        btnCloseSettingsModal: document.getElementById('btn-close-settings-modal'),
        btnResetApiUrl: document.getElementById('btn-reset-api-url'),
        btnSaveApiUrl: document.getElementById('btn-save-api-url'),

        toastContainer: document.getElementById('toast-container')
    };

    // Initialize Application
    initApp();

    function initApp() {
        applyTheme(state.theme);
        elements.settingsApiUrl.value = window.StudentAPI.getBaseUrl();
        elements.statApiEndpoint.textContent = window.StudentAPI.getBaseUrl();
        bindEvents();
        fetchStudentData();
    }

    // Event Bindings
    function bindEvents() {
        // Theme Toggle
        elements.themeToggle.addEventListener('click', toggleTheme);

        // Sidebar Toggle for Mobile
        elements.btnToggleSidebar.addEventListener('click', () => {
            elements.sidebar.classList.toggle('open');
        });

        // Close mobile sidebar when clicking outside
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 992 && !elements.sidebar.contains(e.target) && !elements.btnToggleSidebar.contains(e.target)) {
                elements.sidebar.classList.remove('open');
            }
        });

        // Search & Filter Events
        elements.searchInput.addEventListener('input', handleSearchInput);
        elements.btnClearSearch.addEventListener('click', () => {
            elements.searchInput.value = '';
            handleSearchInput();
        });
        elements.filterDepartment.addEventListener('change', (e) => {
            state.selectedDepartment = e.target.value;
            applyFilters();
        });
        elements.filterYear.addEventListener('change', (e) => {
            state.selectedYear = e.target.value;
            applyFilters();
        });
        elements.sortBy.addEventListener('change', (e) => {
            state.sortBy = e.target.value;
            applyFilters();
        });

        // View Toggles
        elements.viewTableBtn.addEventListener('click', () => switchView('table'));
        elements.viewGridBtn.addEventListener('click', () => switchView('grid'));

        // Refresh & Sync
        elements.btnRefreshData.addEventListener('click', () => fetchStudentData(true));
        elements.btnQuickSync.addEventListener('click', () => fetchStudentData(true));
        elements.btnRetryConnection.addEventListener('click', () => fetchStudentData(true));

        // Demo Data Loader
        elements.btnLoadDemoData.addEventListener('click', () => {
            state.isMockMode = true;
            state.students = [...window.MOCK_STUDENTS];
            updateStatusIndicator('demo');
            showToast('Loaded demo dataset (Mock Mode)', 'warning');
            updateDepartmentOptions();
            applyFilters();
        });

        // Export CSV
        elements.btnExportCsv.addEventListener('click', exportToCsv);

        // Modal Open Triggers
        elements.btnAddStudentModal.addEventListener('click', () => openStudentModal());
        elements.btnEmptyAddStudent.addEventListener('click', () => openStudentModal());
        elements.btnOpenSettings.addEventListener('click', openSettingsModal);
        elements.btnConfigureApi.addEventListener('click', openSettingsModal);

        // Student Form Submit
        elements.studentForm.addEventListener('submit', handleStudentFormSubmit);

        // Modal Close Triggers
        elements.btnCloseStudentModal.addEventListener('click', closeStudentModal);
        elements.btnCancelStudentModal.addEventListener('click', closeStudentModal);
        elements.btnCloseDeleteModal.addEventListener('click', closeDeleteModal);
        elements.btnCancelDelete.addEventListener('click', closeDeleteModal);
        elements.btnConfirmDelete.addEventListener('click', handleConfirmDelete);
        elements.btnCloseSettingsModal.addEventListener('click', closeSettingsModal);

        // API Settings
        elements.btnResetApiUrl.addEventListener('click', () => {
            window.StudentAPI.resetBaseUrl();
            elements.settingsApiUrl.value = window.StudentAPI.getBaseUrl();
            showToast('API URL reset to default', 'info');
        });

        elements.btnSaveApiUrl.addEventListener('click', async () => {
            const newUrl = elements.settingsApiUrl.value.trim();
            if (!newUrl) {
                showToast('Please enter a valid URL', 'error');
                return;
            }
            window.StudentAPI.setBaseUrl(newUrl);
            elements.statApiEndpoint.textContent = window.StudentAPI.getBaseUrl();
            closeSettingsModal();
            showToast(`API URL updated: ${newUrl}`, 'success');
            await fetchStudentData(true);
        });

        // Close modals on Esc key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeStudentModal();
                closeDeleteModal();
                closeSettingsModal();
            }
        });
    }

    // Theme Logic
    function toggleTheme() {
        state.theme = state.theme === 'light' ? 'dark' : 'light';
        applyTheme(state.theme);
        localStorage.setItem('studenthub_theme', state.theme);
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        elements.themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }

    // View Switching
    function switchView(mode) {
        state.viewMode = mode;
        if (mode === 'table') {
            elements.viewTableBtn.classList.add('active');
            elements.viewGridBtn.classList.remove('active');
            elements.tableContainer.classList.remove('hidden');
            elements.gridContainer.classList.add('hidden');
        } else {
            elements.viewGridBtn.classList.add('active');
            elements.viewTableBtn.classList.remove('active');
            elements.gridContainer.classList.remove('hidden');
            elements.tableContainer.classList.add('hidden');
        }
    }

    // Data Fetching
    async function fetchStudentData(isManualRefresh = false) {
        showLoadingState();
        try {
            const isOnline = await window.StudentAPI.testConnection();
            if (!isOnline) {
                throw new Error('API server offline or unreachable');
            }

            const data = await window.StudentAPI.getStudents();
            state.students = Array.isArray(data) ? data : (data.results || []);
            state.isMockMode = false;
            updateStatusIndicator('online');
            
            if (isManualRefresh) {
                showToast(`Synced ${state.students.length} student records from API`, 'success');
            }

            updateDepartmentOptions();
            applyFilters();
        } catch (error) {
            console.warn('API Error:', error);
            updateStatusIndicator('offline');
            if (state.students.length === 0) {
                showErrorState(error.message);
            } else {
                showToast(`Server sync failed: ${error.message}`, 'error');
            }
        }
    }

    function updateStatusIndicator(status) {
        elements.statusDot.className = 'status-dot';
        if (status === 'online') {
            elements.statusDot.classList.add('online');
            elements.statusText.textContent = 'API Connected';
            elements.statApiStatus.textContent = 'Active (200)';
            elements.statApiStatus.style.color = 'var(--success)';
        } else if (status === 'demo') {
            elements.statusDot.classList.add('online');
            elements.statusText.textContent = 'Demo Mode';
            elements.statApiStatus.textContent = 'Mock Dataset';
            elements.statApiStatus.style.color = 'var(--warning)';
        } else {
            elements.statusDot.classList.add('offline');
            elements.statusText.textContent = 'API Offline';
            elements.statApiStatus.textContent = 'Offline';
            elements.statApiStatus.style.color = 'var(--danger)';
        }
    }

    // Filter & Search Logic
    function handleSearchInput() {
        state.searchTerm = elements.searchInput.value.trim().toLowerCase();
        elements.btnClearSearch.style.display = state.searchTerm ? 'block' : 'none';
        applyFilters();
    }

    function applyFilters() {
        let list = [...state.students];

        // Search Filter
        if (state.searchTerm) {
            list = list.filter(s =>
                (s.name && s.name.toLowerCase().includes(state.searchTerm)) ||
                (s.student_id && s.student_id.toLowerCase().includes(state.searchTerm)) ||
                (s.email && s.email.toLowerCase().includes(state.searchTerm)) ||
                (s.department && s.department.toLowerCase().includes(state.searchTerm)) ||
                (s.phone && s.phone.toLowerCase().includes(state.searchTerm))
            );
        }

        // Department Filter
        if (state.selectedDepartment) {
            list = list.filter(s => s.department === state.selectedDepartment);
        }

        // Year Filter
        if (state.selectedYear) {
            list = list.filter(s => String(s.year) === String(state.selectedYear));
        }

        // Sorting
        list.sort((a, b) => {
            switch (state.sortBy) {
                case 'name-asc':
                    return (a.name || '').localeCompare(b.name || '');
                case 'name-desc':
                    return (b.name || '').localeCompare(a.name || '');
                case 'id-asc':
                    return (a.id || 0) - (b.id || 0);
                case 'id-desc':
                    return (b.id || 0) - (a.id || 0);
                case 'year-asc':
                    return (a.year || 0) - (b.year || 0);
                case 'year-desc':
                    return (b.year || 0) - (a.year || 0);
                default:
                    return 0;
            }
        });

        state.filteredStudents = list;
        renderUI();
    }

    // Department Options Generator
    function updateDepartmentOptions() {
        const departments = [...new Set(state.students.map(s => s.department).filter(Boolean))].sort();
        const currentVal = elements.filterDepartment.value;
        
        elements.filterDepartment.innerHTML = '<option value="">All Departments</option>';
        departments.forEach(dept => {
            const opt = document.createElement('option');
            opt.value = dept;
            opt.textContent = dept;
            elements.filterDepartment.appendChild(opt);
        });

        if (departments.includes(currentVal)) {
            elements.filterDepartment.value = currentVal;
        }
    }

    // UI Rendering
    function renderUI() {
        updateStats();

        if (state.filteredStudents.length === 0) {
            if (state.students.length === 0) {
                showEmptyState("No student records exist yet. Click below to add your first student.");
            } else {
                showEmptyState("No students match your active search filters.");
            }
            return;
        }

        hideStateContainers();
        renderTableView();
        renderGridView();

        elements.footerRecordCount.textContent = `Showing ${state.filteredStudents.length} of ${state.students.length} students`;
    }

    function updateStats() {
        const total = state.students.length;
        elements.statTotalStudents.textContent = total;
        elements.badgeStudentCount.textContent = total;

        const uniqueDepts = new Set(state.students.map(s => s.department).filter(Boolean)).size;
        elements.statTotalDepartments.textContent = uniqueDepts;

        if (total > 0) {
            const sumYears = state.students.reduce((acc, s) => acc + (Number(s.year) || 1), 0);
            const avg = (sumYears / total).toFixed(1);
            elements.statAvgYear.textContent = `Year ${avg}`;
        } else {
            elements.statAvgYear.textContent = '-';
        }
    }

    function renderTableView() {
        elements.tableBody.innerHTML = '';

        state.filteredStudents.forEach(student => {
            const tr = document.createElement('tr');
            
            const initials = getInitials(student.name);

            tr.innerHTML = `
                <td><strong>#${student.id || student.pk || '-'}</strong></td>
                <td>
                    <div class="student-identity">
                        <div class="student-avatar">${escapeHtml(initials)}</div>
                        <div class="student-meta">
                            <span class="student-name">${escapeHtml(student.name)}</span>
                            <span class="student-roll">${escapeHtml(student.student_id)}</span>
                        </div>
                    </div>
                </td>
                <td><a href="mailto:${escapeHtml(student.email)}" class="text-muted">${escapeHtml(student.email)}</a></td>
                <td><span class="dept-pill">${escapeHtml(student.department)}</span></td>
                <td><span class="year-tag">Year ${escapeHtml(String(student.year))}</span></td>
                <td>${escapeHtml(student.phone || '-')}</td>
                <td class="text-right">
                    <div class="table-actions">
                        <button class="action-icon-btn btn-edit" title="Edit Student" data-id="${student.id}">✏️</button>
                        <button class="action-icon-btn delete btn-delete" title="Delete Student" data-id="${student.id}">🗑️</button>
                    </div>
                </td>
            `;

            // Action listeners
            tr.querySelector('.btn-edit').addEventListener('click', () => openStudentModal(student));
            tr.querySelector('.btn-delete').addEventListener('click', () => openDeleteModal(student));

            elements.tableBody.appendChild(tr);
        });
    }

    function renderGridView() {
        elements.gridBody.innerHTML = '';

        state.filteredStudents.forEach(student => {
            const card = document.createElement('div');
            card.className = 'student-card-item';
            const initials = getInitials(student.name);

            card.innerHTML = `
                <div class="card-item-top">
                    <div class="student-avatar">${escapeHtml(initials)}</div>
                    <div class="student-meta">
                        <h4 class="student-name">${escapeHtml(student.name)}</h4>
                        <span class="student-roll">${escapeHtml(student.student_id)}</span>
                    </div>
                </div>
                <div class="card-item-body">
                    <div class="card-detail-row">
                        <span>🏛️</span> <strong>${escapeHtml(student.department)}</strong>
                    </div>
                    <div class="card-detail-row">
                        <span>📅</span> Year ${escapeHtml(String(student.year))} Student
                    </div>
                    <div class="card-detail-row">
                        <span>✉️</span> ${escapeHtml(student.email)}
                    </div>
                    <div class="card-detail-row">
                        <span>📞</span> ${escapeHtml(student.phone || 'N/A')}
                    </div>
                </div>
                <div class="card-item-actions">
                    <button class="btn btn-sm btn-outline btn-edit" data-id="${student.id}">Edit</button>
                    <button class="btn btn-sm btn-danger btn-delete" data-id="${student.id}">Delete</button>
                </div>
            `;

            card.querySelector('.btn-edit').addEventListener('click', () => openStudentModal(student));
            card.querySelector('.btn-delete').addEventListener('click', () => openDeleteModal(student));

            elements.gridBody.appendChild(card);
        });
    }

    // Modal Operations
    function openStudentModal(student = null) {
        elements.studentForm.reset();
        clearFormErrors();

        if (student) {
            elements.modalTitle.textContent = 'Edit Student Details';
            elements.formStudentPk.value = student.id;
            elements.formStudentId.value = student.student_id || '';
            elements.formName.value = student.name || '';
            elements.formEmail.value = student.email || '';
            elements.formDepartment.value = student.department || '';
            elements.formYear.value = student.year || '';
            elements.formPhone.value = student.phone || '';
        } else {
            elements.modalTitle.textContent = 'Add New Student';
            elements.formStudentPk.value = '';
        }

        elements.studentModal.classList.remove('hidden');
        elements.formStudentId.focus();
    }

    function closeStudentModal() {
        elements.studentModal.classList.add('hidden');
        elements.studentForm.reset();
        clearFormErrors();
    }

    function openDeleteModal(student) {
        state.deleteTarget = student;
        elements.deleteStudentName.textContent = `"${student.name}" (${student.student_id})`;
        elements.deleteModal.classList.remove('hidden');
    }

    function closeDeleteModal() {
        state.deleteTarget = null;
        elements.deleteModal.classList.add('hidden');
    }

    function openSettingsModal() {
        elements.settingsApiUrl.value = window.StudentAPI.getBaseUrl();
        elements.settingsModal.classList.remove('hidden');
    }

    function closeSettingsModal() {
        elements.settingsModal.classList.add('hidden');
    }

    // Form Handling & Validation
    async function handleStudentFormSubmit(e) {
        e.preventDefault();
        clearFormErrors();

        const pk = elements.formStudentPk.value;
        const studentData = {
            student_id: elements.formStudentId.value.trim(),
            name: elements.formName.value.trim(),
            email: elements.formEmail.value.trim(),
            department: elements.formDepartment.value.trim(),
            year: parseInt(elements.formYear.value, 10),
            phone: elements.formPhone.value.trim()
        };

        // Form Validation
        let isValid = true;
        if (!studentData.student_id) { markFieldError(elements.formStudentId); isValid = false; }
        if (!studentData.name) { markFieldError(elements.formName); isValid = false; }
        if (!studentData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentData.email)) {
            markFieldError(elements.formEmail);
            isValid = false;
        }
        if (!studentData.department) { markFieldError(elements.formDepartment); isValid = false; }
        if (!studentData.year) { markFieldError(elements.formYear); isValid = false; }
        if (!studentData.phone) { markFieldError(elements.formPhone); isValid = false; }

        if (!isValid) return;

        const submitBtn = elements.studentForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.querySelector('.btn-text').textContent = 'Saving...';

        try {
            if (state.isMockMode) {
                // Mock local updates
                if (pk) {
                    const idx = state.students.findIndex(s => String(s.id) === String(pk));
                    if (idx !== -1) state.students[idx] = { ...state.students[idx], ...studentData };
                    showToast('Student updated successfully (Mock Mode)', 'success');
                } else {
                    const newId = Math.max(...state.students.map(s => s.id || 0), 0) + 1;
                    state.students.unshift({ id: newId, ...studentData });
                    showToast('Student added successfully (Mock Mode)', 'success');
                }
                closeStudentModal();
                updateDepartmentOptions();
                applyFilters();
            } else {
                // Backend API call
                if (pk) {
                    await window.StudentAPI.updateStudent(pk, studentData);
                    showToast('Student record updated successfully', 'success');
                } else {
                    await window.StudentAPI.createStudent(studentData);
                    showToast('New student created successfully', 'success');
                }
                closeStudentModal();
                await fetchStudentData();
            }
        } catch (error) {
            showToast(`Error saving student: ${error.message}`, 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Save Student';
        }
    }

    async function handleConfirmDelete() {
        if (!state.deleteTarget) return;
        const target = state.deleteTarget;
        elements.btnConfirmDelete.disabled = true;
        elements.btnConfirmDelete.textContent = 'Deleting...';

        try {
            if (state.isMockMode) {
                state.students = state.students.filter(s => s.id !== target.id);
                showToast(`Deleted ${target.name} (Mock Mode)`, 'success');
                closeDeleteModal();
                updateDepartmentOptions();
                applyFilters();
            } else {
                await window.StudentAPI.deleteStudent(target.id);
                showToast(`Deleted student record for ${target.name}`, 'success');
                closeDeleteModal();
                await fetchStudentData();
            }
        } catch (error) {
            showToast(`Error deleting record: ${error.message}`, 'error');
        } finally {
            elements.btnConfirmDelete.disabled = false;
            elements.btnConfirmDelete.textContent = 'Delete Record';
        }
    }

    // CSV Export
    function exportToCsv() {
        if (state.filteredStudents.length === 0) {
            showToast('No student records to export', 'warning');
            return;
        }

        const headers = ['ID', 'Student ID', 'Full Name', 'Email Address', 'Department', 'Academic Year', 'Phone'];
        const rows = state.filteredStudents.map(s => [
            s.id,
            `"${(s.student_id || '').replace(/"/g, '""')}"`,
            `"${(s.name || '').replace(/"/g, '""')}"`,
            `"${(s.email || '').replace(/"/g, '""')}"`,
            `"${(s.department || '').replace(/"/g, '""')}"`,
            s.year,
            `"${(s.phone || '').replace(/"/g, '""')}"`
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `student_records_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showToast(`Exported ${state.filteredStudents.length} records to CSV`, 'success');
    }

    // State View Helpers
    function showLoadingState() {
        elements.loadingState.classList.remove('hidden');
        elements.emptyState.classList.add('hidden');
        elements.errorState.classList.add('hidden');
        elements.tableContainer.classList.add('hidden');
        elements.gridContainer.classList.add('hidden');
    }

    function showEmptyState(msg) {
        elements.loadingState.classList.add('hidden');
        elements.errorState.classList.add('hidden');
        elements.tableContainer.classList.add('hidden');
        elements.gridContainer.classList.add('hidden');
        elements.emptyState.classList.remove('hidden');
        document.getElementById('empty-state-message').textContent = msg;
    }

    function showErrorState(msg) {
        elements.loadingState.classList.add('hidden');
        elements.emptyState.classList.add('hidden');
        elements.tableContainer.classList.add('hidden');
        elements.gridContainer.classList.add('hidden');
        elements.errorState.classList.remove('hidden');
        elements.errorStateMessage.textContent = `Could not communicate with ${window.StudentAPI.getBaseUrl()}/api/students/ (${msg}).`;
    }

    function hideStateContainers() {
        elements.loadingState.classList.add('hidden');
        elements.emptyState.classList.add('hidden');
        elements.errorState.classList.add('hidden');
        if (state.viewMode === 'table') {
            elements.tableContainer.classList.remove('hidden');
            elements.gridContainer.classList.add('hidden');
        } else {
            elements.gridContainer.classList.remove('hidden');
            elements.tableContainer.classList.add('hidden');
        }
    }

    function markFieldError(inputElement) {
        inputElement.closest('.form-group').classList.add('has-error');
    }

    function clearFormErrors() {
        document.querySelectorAll('.form-group.has-error').forEach(el => el.classList.remove('has-error'));
    }

    // Toast Notifications
    function showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'ℹ️';
        if (type === 'success') icon = '✅';
        if (type === 'error') icon = '❌';
        if (type === 'warning') icon = '⚠️';

        toast.innerHTML = `
            <span class="toast-icon">${icon}</span>
            <span class="toast-message">${escapeHtml(message)}</span>
        `;

        elements.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 250);
        }, 3500);
    }

    // Utilities
    function getInitials(name = '') {
        return name.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'ST';
    }

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
});

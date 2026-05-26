document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // [1] الثيم والخلفية (Particles)
    // ==========================================
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        initParticles('#64748b'); 
    } else {
        document.body.classList.remove('light-mode');
        initParticles('#ffffff'); 
    }

    const themeToggleCheckbox = document.getElementById('themeToggleCheckbox');
    const iconSpan = document.querySelector('.slider .icon');
    const textSpan = document.querySelector('.slider .text');

    if (themeToggleCheckbox) {
        if (savedTheme === 'light') {
            themeToggleCheckbox.checked = true;
            if (iconSpan) iconSpan.innerHTML = '☀️';
            if (textSpan) textSpan.innerHTML = 'Light';
        } else {
            themeToggleCheckbox.checked = false;
            if (iconSpan) iconSpan.innerHTML = '🌙';
            if (textSpan) textSpan.innerHTML = 'Dark';
        }

        themeToggleCheckbox.addEventListener('change', function () {
            if (this.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                if (iconSpan) iconSpan.innerHTML = '☀️';
                if (textSpan) textSpan.innerHTML = 'Light';
                initParticles('#64748b');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
                if (iconSpan) iconSpan.innerHTML = '🌙';
                if (textSpan) textSpan.innerHTML = 'Dark';
                initParticles('#ffffff');
            }
        });
    }

    function initParticles(color) {
        if (document.getElementById('particles-js')) {
            if (window.pJSDom && window.pJSDom.length > 0) {
                window.pJSDom[0].pJS.fn.vendors.destroypJS();
                window.pJSDom = [];
            }
            particlesJS("particles-js", {
                particles: {
                    number: { value: 120, density: { enable: true, value_area: 800 } },
                    color: { value: color },
                    shape: { type: "circle" },
                    opacity: { value: 0.5 },
                    size: { value: 3, random: true },
                    line_linked: { enable: true, distance: 150, color: color, opacity: 0.4, width: 1 },
                    move: { enable: true, speed: 2 }
                },
                interactivity: {
                    detect_on: "window",
                    events: {
                        onhover: { enable: true, mode: "repulse" },
                        onclick: { enable: true, mode: "push" }
                    },
                    modes: { repulse: { distance: 100, duration: 0.4 } }
                }
            });
        }
    }

    // ==========================================
    // [2] قاعدة البيانات وعرض المشاريع
    // ==========================================
    let database = JSON.parse(localStorage.getItem('projects')) || [];
    const todoList = document.getElementById('todoList');           // الصفحة الرئيسية
    const completedList = document.getElementById('completedList'); // صفحة Hall of Fame
    const bigProjectsList = document.getElementById('bigProjectsList'); // صفحة Big Projects

    function renderProjects() {
        // الصفحة الرئيسية (index.html)
        if (todoList) {
            todoList.innerHTML = '';
            const activeProjects = database.filter(p => p.status === 'todo');
            if (activeProjects.length === 0) {
                todoList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No active projects. Add one!</p>';
            } else {
                activeProjects.forEach(proj => createCard(proj, todoList, 'todo'));
            }
        }
        
        // صفحة المكتملين (hall-of-fame.html)
        if (completedList) {
            completedList.innerHTML = '';
            const finishedProjects = database.filter(p => p.status === 'completed');
            if (finishedProjects.length === 0) {
                completedList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No completed projects yet!</p>';
            } else {
                finishedProjects.forEach(proj => createCard(proj, completedList, 'completed'));
            }
        }

        // صفحة المشاريع الضخمة (big-projects.html)
        if (bigProjectsList) {
            bigProjectsList.innerHTML = '';
            // جلب المشاريع التي صعوبتها Hard (سواء قيد التنفيذ أو مكتملة)
            const bigProjects = database.filter(p => p.difficulty === 'Hard');
            if (bigProjects.length === 0) {
                bigProjectsList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No Big Projects yet! Time to dream bigger 🚀</p>';
            } else {
                bigProjects.forEach(proj => createCard(proj, bigProjectsList, proj.status));
            }
        }
    }

    function createCard(proj, container, contextType) {
        const card = document.createElement('div');
        card.className = 'project-card glass-card';
        
        let actionButton = '';
        if (contextType === 'completed') {
            // زر الحذف في صفحة Hall of fame
            actionButton = `<button class="btn-delete" onclick="deleteProject('${proj.id}', event)" title="Delete Permanently">X</button>`;
        } else {
            // زر الإكمال في باقي الصفحات
            actionButton = `<button class="check-btn" onclick="completeProject('${proj.id}', event)" title="Mark as Completed"></button>`;
        }

        card.innerHTML = `
            ${actionButton}
            <h3>${proj.name}</h3>
            <div class="tags">
                <span class="tag diff-${proj.difficulty}">${proj.difficulty}</span>
                <span class="tag">${proj.language}</span>
            </div>
            <p>${proj.description.substring(0, 60)}...</p>
            <div class="tags"><span class="tag" style="color: #8b5cf6;">Tech: ${proj.tech}</span></div>
        `;

        if (contextType !== 'completed') {
            card.onclick = (e) => { if(!e.target.classList.contains('check-btn')) openEditModal(proj.id); };
        }
        container.appendChild(card);
    }

    // ==========================================
    // [3] العمليات (إضافة، إكمال، حذف)
    // ==========================================
    
    const form = document.getElementById('projectForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('projectId').value;
            const projectData = {
                id: id || Date.now().toString(),
                name: document.getElementById('projName').value,
                language: document.getElementById('projLang').value,
                difficulty: document.getElementById('projDifficulty').value,
                tech: document.getElementById('projTech').value,
                description: document.getElementById('projDesc').value,
                repo: document.getElementById('projRepo').value,
                status: 'todo'
            };

            if (id) {
                const index = database.findIndex(p => p.id === id);
                if (index !== -1) {
                    projectData.status = database[index].status;
                    database[index] = projectData;
                }
            } else {
                database.push(projectData);
            }

            localStorage.setItem('projects', JSON.stringify(database));
            renderProjects();
            closeModal();
        });
    }

    window.completeProject = function(id, event) {
        event.stopPropagation();
        event.target.parentElement.style.transform = 'scale(0.8)';
        event.target.parentElement.style.opacity = '0';
        setTimeout(() => {
            const proj = database.find(p => p.id === id);
            if (proj) proj.status = 'completed';
            localStorage.setItem('projects', JSON.stringify(database));
            renderProjects();
        }, 300);
    };

    window.deleteProject = function(id, event) {
        event.stopPropagation();
        if (confirm("Are you sure you want to delete this project permanently?")) {
            event.target.parentElement.style.transform = 'scale(0.8)';
            event.target.parentElement.style.opacity = '0';
            setTimeout(() => {
                database = database.filter(p => p.id !== id);
                localStorage.setItem('projects', JSON.stringify(database));
                renderProjects();
            }, 300);
        }
    };

    const modal = document.getElementById('projectModal');
    const addNewBtn = document.getElementById('addNewBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');

    if (addNewBtn) addNewBtn.onclick = () => {
        form.reset(); document.getElementById('projectId').value = '';
        document.getElementById('modalTitle').innerText = 'Add New Project';
        modal.classList.remove('hidden');
    };
    if (closeModalBtn) closeModalBtn.onclick = closeModal;

    function closeModal() { if(modal) modal.classList.add('hidden'); }

    window.openEditModal = function(id) {
        const proj = database.find(p => p.id === id);
        if(proj && modal) {
            document.getElementById('projectId').value = proj.id;
            document.getElementById('projName').value = proj.name;
            document.getElementById('projLang').value = proj.language;
            document.getElementById('projDifficulty').value = proj.difficulty;
            document.getElementById('projTech').value = proj.tech;
            document.getElementById('projDesc').value = proj.description;
            document.getElementById('projRepo').value = proj.repo || '';
            document.getElementById('modalTitle').innerText = 'Edit Project Info';
            modal.classList.remove('hidden');
        }
    };

    renderProjects();
});
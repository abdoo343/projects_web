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
    const todoList = document.getElementById('todoList');           
    const completedList = document.getElementById('completedList'); 
    const bigProjectsList = document.getElementById('bigProjectsList'); 

    function renderProjects() {
        if (todoList) {
            todoList.innerHTML = '';
            const activeProjects = database.filter(p => p.status === 'todo');
            if (activeProjects.length === 0) {
                todoList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No active projects. Add one!</p>';
            } else {
                activeProjects.forEach(proj => createCard(proj, todoList, 'todo'));
            }
        }
        
        if (completedList) {
            completedList.innerHTML = '';
            const finishedProjects = database.filter(p => p.status === 'completed');
            if (finishedProjects.length === 0) {
                completedList.innerHTML = '<p style="text-align: center; grid-column: 1/-1;">No completed projects yet!</p>';
            } else {
                finishedProjects.forEach(proj => createCard(proj, completedList, 'completed'));
            }
        }

        if (bigProjectsList) {
            bigProjectsList.innerHTML = '';
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
            actionButton = `<button class="btn-delete" onclick="deleteProject('${proj.id}', event)" title="Delete Permanently">X</button>`;
        } else {
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

        // هنا خلينا الضغطة تفتح نافذة التفاصيل بدل التعديل المباشر
        card.onclick = (e) => { 
            // إذا دسنا على زر الصح أو الحذف، لا تفتح التفاصيل
            if(e.target.tagName.toLowerCase() === 'button' || e.target.closest('button')) return;
            openDetailsModal(proj.id); 
        };
        
        container.appendChild(card);
    }

    // ==========================================
    // [3] العمليات (إضافة، إكمال، حذف، وتفاصيل)
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

    // التحكم بنوافذ الـ Modal
    const modal = document.getElementById('projectModal'); // نافذة الإضافة/التعديل
    const detailsModal = document.getElementById('detailsModal'); // نافذة التفاصيل الجديدة
    const addNewBtn = document.getElementById('addNewBtn');
    
    // أزرار الإغلاق
    const closeModalBtn = document.getElementById('closeModalBtn');
    const closeDetailsBtn = document.getElementById('closeDetailsBtn');

    if (addNewBtn) addNewBtn.onclick = () => {
        form.reset(); document.getElementById('projectId').value = '';
        document.getElementById('modalTitle').innerText = 'Add New Project';
        modal.classList.remove('hidden');
    };
    
    if (closeModalBtn) closeModalBtn.onclick = closeModal;
    if (closeDetailsBtn) closeDetailsBtn.onclick = () => detailsModal.classList.add('hidden');

    function closeModal() { 
        if(modal) modal.classList.add('hidden'); 
        if(detailsModal) detailsModal.classList.add('hidden');
    }

    // فتح نافذة التفاصيل
    window.openDetailsModal = function(id) {
        const proj = database.find(p => p.id === id);
        if(proj && detailsModal) {
            document.getElementById('detName').innerText = proj.name;
            document.getElementById('detTech').innerText = proj.tech;
            document.getElementById('detDesc').innerText = proj.description;
            
            // إضافة التاجز (حالة المشروع، اللغة، الصعوبة)
            let statusColor = proj.status === 'completed' ? '#10b981' : '#f59e0b';
            let statusText = proj.status === 'completed' ? 'Completed' : 'In Progress';
            
            document.getElementById('detTags').innerHTML = `
                <span class="tag diff-${proj.difficulty}">${proj.difficulty}</span>
                <span class="tag">${proj.language}</span>
                <span class="tag" style="background: ${statusColor}; color: white; border: none;">${statusText}</span>
            `;

            // إظهار أو إخفاء زر الـ GitHub
            const repoBtn = document.getElementById('detRepo');
            if(proj.repo && proj.repo.trim() !== '') {
                repoBtn.href = proj.repo;
                repoBtn.classList.remove('hidden');
            } else {
                repoBtn.classList.add('hidden');
            }

            // برمجة زر التعديل بداخل نافذة التفاصيل
            const editBtn = document.getElementById('editFromDetailsBtn');
            if (editBtn) {
                editBtn.onclick = () => {
                    detailsModal.classList.add('hidden'); // سد التفاصيل
                    openEditModal(proj.id); // افتح نافذة التعديل
                };
            }

            detailsModal.classList.remove('hidden');
        }
    };

    // فتح نافذة التعديل
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
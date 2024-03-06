document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('add-task-btn');
    const inputField = document.getElementById('new-task-input');
    const inputDesc = document.getElementById('new-task-desc');
    const inputDate = document.getElementById('new-task-date');
    const containers = document.querySelectorAll('.task-container');

    addButton.addEventListener('click', addTask);
    setupDragAndDrop();

    function addTask() {
        const taskText = inputField.value.trim();
        const taskDesc = inputDesc.value.trim();
        const taskDate = inputDate.value;
        if (!taskText) return;

        const taskElement = createTaskElement(taskText, taskDesc, taskDate, 'not-started');
        document.querySelector('#not-started .task-container').appendChild(taskElement);
        saveTasksToLocalStorage();
    }

    function createTaskElement(text, desc, date, status) {
        const taskElement = document.createElement('div');
        taskElement.dataset.status = status;
        taskElement.classList.add('task');
        taskElement.setAttribute('draggable', true);
        taskElement.innerHTML = `
            <h1>${text}</h1>
            <p>${desc}</p>
            ${date ? `<span data-original-date="${date}">🕗 ${date}</span>` : ''}
            <button class="delete-btn"><p>Delete</p></button>
        `;

      
        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            taskElement.remove();
            saveTasksToLocalStorage();
        });

      
        taskElement.addEventListener('dblclick', function() {
            editTask(taskElement);
        });

        return taskElement;
    }

    function editTask(taskElement) {
        const title = prompt("Edit task title", taskElement.querySelector('h1').textContent);
        const desc = prompt("Edit task description", taskElement.querySelector('p').textContent);
        const date = prompt("Edit due date (YYYY-MM-DD)", taskElement.querySelector('span[data-original-date]').dataset.originalDate);

        if (title) taskElement.querySelector('h1').textContent = title;
        if (desc) taskElement.querySelector('p').textContent = desc;
        if (date) {
            taskElement.querySelector('span[data-original-date]').dataset.originalDate = date;
            taskElement.querySelector('span[data-original-date]').textContent = `🕗 ${date}`;
        }

        saveTasksToLocalStorage();
    }

    const changeTime = document.getElementById("change-time");

    changeTime.addEventListener('click', function() {
        const taskSpans = document.querySelectorAll('.task span');
        const now = new Date();
        taskSpans.forEach(function(span) {
            if (span.textContent.includes('🕗') && !span.dataset.originalDate) {
                span.dataset.originalDate = span.textContent.replace('🕗 ', '');
            }
    
            if (!span.dataset.isCountdown || span.dataset.isCountdown === "false") {
                const taskDate = new Date(span.dataset.originalDate);
                let diff = taskDate - now;
               
                diff = diff < 0 ? 0 : diff;
    
                const hours = Math.floor(diff / 3600000);
                const minutes = Math.floor((diff % 3600000) / 60000);
                const timeString = diff === 0 ? `<span id="overtime" style="color: red;">0:00</span>` : `${hours}h:${minutes}min`;
    
                span.innerHTML = `🕗 ${timeString}`;
                span.dataset.isCountdown = "true"; 
            } else {
                
                span.textContent = `🕗 ${span.dataset.originalDate}`;
                span.dataset.isCountdown = "false"; 
            }
        });
    });
    

    
    const createTaskbackground = document.getElementById("bg");
    const createTaskBox = document.getElementById("createTask-boxs");
    const makebtn = document.getElementById("add-task-btn");

    makebtn.addEventListener('click', function(){

        createTaskbackground.style.display = 'none';
        createTaskBox.style.display = 'none';
    })
    
    const closemorebox = document.getElementById("close-all-buttons");
    const morebox = document.getElementById("allbuttons-box")
    const moredots = document.getElementById("more")

    moredots.addEventListener('click', function(){

        morebox.style.display = 'block';
        
    })

    closemorebox.addEventListener('click', function(){

        morebox.style.display = 'none';
        
    })
    

    function saveTasksToLocalStorage() {
        const tasksData = [];
        containers.forEach(container => {
            container.querySelectorAll('.task').forEach(task => {
                const status = task.dataset.status;
                const title = task.querySelector('h1') ? task.querySelector('h1').textContent : ''; 
                const desc = task.querySelector('p') ? task.querySelector('p').textContent : '';
                const dateSpan = task.querySelector('span'); 
                const date = dateSpan ? dateSpan.textContent.replace('🕗 ', '') : '';
                tasksData.push({ title, desc, date, status });
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasksData));
    }
    
    
    const deleteall = document.getElementById("delete-all");

    deleteall.addEventListener('click', function(){
        localStorage.clear();
        window.location.reload()
    })

    function enableTaskEditing(taskElement) {
        const titleElement = taskElement.querySelector('h1');
        const descElement = taskElement.querySelector('p');
        const dateElement = taskElement.querySelector('span[data-original-date]');
    
      
        const title = titleElement.textContent;
        const desc = descElement.textContent;
        const date = dateElement.dataset.originalDate;
    
 
        titleElement.outerHTML = `<input type="text" class="edit-title" value="${title}">`;
        descElement.outerHTML = `<textarea class="edit-desc">${desc}</textarea>`;
        dateElement.outerHTML = `<input type="date" class="edit-date" value="${date}">`;
    
        
        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save';
        saveButton.classList.add('save-edit');
        taskElement.appendChild(saveButton);
    
       
        saveButton.addEventListener('click', function() {
            saveEditedTask(taskElement);
        });
    }

    function saveEditedTask(taskElement) {
        const titleInput = taskElement.querySelector('.edit-title');
        const descInput = taskElement.querySelector('.edit-desc');
        const dateInput = taskElement.querySelector('.edit-date');
    
 
        taskElement.innerHTML = `<h1>${titleInput.value}</h1><p>${descInput.value}</p><span data-original-date="${dateInput.value}">🕗 ${dateInput.value}</span><button class="delete-btn"><p>Delete</p></button>`;
    
        
        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            taskElement.remove();
            saveTasksToLocalStorage();
        });
    

    
        saveTasksToLocalStorage(); 
    }
    
    

    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            const containerSelector = `#${task.status} .task-container`;
            const container = document.querySelector(containerSelector);
            if (container) {
                
                const taskElement = createTaskElement(task.title, task.desc, task.date, task.status);
                container.appendChild(taskElement);
            }
        });
    }
    

    setupDragAndDrop();

    
    

    function setupDragAndDrop() {
        containers.forEach(container => {
            container.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(container, e.clientY);
                const draggable = document.querySelector('.dragging');
                if (afterElement == null) {
                    container.appendChild(draggable);
                } else {
                    container.insertBefore(draggable, afterElement);
                }
            });
        });

        document.addEventListener('dragstart', e => {
            if (e.target.classList.contains('task')) {
                e.target.classList.add('dragging');
            }
        });

        document.addEventListener('dragend', e => {
            if (e.target.classList.contains('task')) {
              
                const newStatus = e.target.closest('.task-list').id;
                e.target.dataset.status = newStatus; 
        
                saveTasksToLocalStorage();
                window.location.reload()
            }
        });
        
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    const currentDate = new Date().toLocaleDateString("de-DE");
    const currentDatePlaceholder = document.getElementById("currentdate"); 

    currentDatePlaceholder.innerHTML = currentDate;

    

    loadTasksFromLocalStorage();
});


const createTask = document.getElementById("add-a-new-task");
const createTaskbackground = document.getElementById("bg");
const createTaskBox = document.getElementById("createTask-boxs");
const cancelButton = document.getElementById("cancel-createtask");
const makebtn = document.getElementById("add-task-btn");

createTask.addEventListener('click', function(){

    createTaskbackground.style.display = 'block';
    createTaskBox.style.display = 'block';
})

cancelButton.addEventListener('click', function(){
    createTaskbackground.style.display = 'none';
    createTaskBox.style.display = 'none';
})


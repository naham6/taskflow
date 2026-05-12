const API_URL = 'http://127.0.0.1:8000/api/tasks';
const taskList = document.getElementById('task-list');
const errorMessage = document.getElementById('error-message');
const taskForm = document.getElementById('task-form');
const titleInput = document.getElementById('task-title');
const descInput = document.getElementById('task-desc');
const priorityInput = document.getElementById('task-priority');
const statusFilter = document.getElementById('filter-status');
const priorityFilter = document.getElementById('filter-priority');
const editModal = document.getElementById('edit-modal');
const editIdInput = document.getElementById('edit-task-id');
const editTitleInput = document.getElementById('edit-task-title');
const editDescInput = document.getElementById('edit-task-desc');
const editPriorityInput = document.getElementById('edit-task-priority');
const saveEditBtn = document.getElementById('save-edit-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const modalErrorMessage = document.getElementById('modal-error-message');
let allTasks = [];

statusFilter.addEventListener('change', renderTasks);
priorityFilter.addEventListener('change', renderTasks);

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        allTasks = await response.json();
        renderTasks();
    } catch (error) {
        showError("Could not connect to the server.");
    }
}

function renderTasks() {
    taskList.innerHTML = ''; 

    const statusVal = statusFilter.value;
    const priorityVal = priorityFilter.value;
    const filteredTasks = allTasks.filter(task => {
        const matchesStatus = (statusVal === 'all') || (task.status === statusVal);
        const matchesPriority = (priorityVal === 'all') || (task.priority === priorityVal);
        return matchesStatus && matchesPriority;
    });

    filteredTasks.forEach(task => {
        const li = document.createElement('li');
        const textStyle = task.status === 'completed' ? 'text-decoration: line-through; color: gray;' : '';
        //title is grey if task is completed
    
        let priorityIcon = '';
        if (task.priority === 'high') priorityIcon = '🔴 ';
        if (task.priority === 'medium') priorityIcon = '🟡 ';

        li.innerHTML = `
            <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; gap: 10px;">
                <div style="flex: 1; min-width: 0;">
                    <h3 style="margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; ${textStyle}" title="${task.title}">
                        ${priorityIcon}${task.title}
                    </h3>
                    <p style="margin: 5px 0; font-size: 14px; color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${task.description || ""}">
                        ${task.description || ""}
                    </p>
                    <small style="color: #999; font-size: 12px;">Created: ${new Date(task.created_at).toLocaleString()}</small>
                </div>
                
                <div style="flex-shrink: 0; display: flex; gap: 5px;">
                    <button onclick="toggleTask(${task.id})" style="background-color: #ffc107; color: black; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        ${task.status === 'completed' ? 'Undo' : 'Complete'}
                    </button>
                    <button onclick="editTask(${task.id}, '${task.title.replace(/'/g, "\\'")}', '${(task.description || "").replace(/'/g, "\\'")}', '${task.priority}')" style="background-color: #007bff; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        Edit
                    </button>
                    <button onclick="deleteTask(${task.id})" style="background-color: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                        Delete
                    </button>
                </div>
            </div>
        `;
        taskList.appendChild(li);
    });
}

taskForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    const newTask = {
        title: titleInput.value,
        description: descInput.value,
        priority: priorityInput.value
    };

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        });

        titleInput.value = '';
        descInput.value = '';
        priorityInput.value = 'low'; 
        fetchTasks();
    } catch (error) {
        showError("Failed to save task.");
    }
});

async function toggleTask(taskId) {
    try {
        await fetch(`${API_URL}/${taskId}/toggle`, { method: 'PATCH' });
        fetchTasks(); 
    } catch (error) {
        showError("Failed to update task.");
    }
}

async function deleteTask(taskId) {
    if (confirm("Are you sure you want to delete this task?")) {
        try {
            await fetch(`${API_URL}/${taskId}`, { method: 'DELETE' });
            fetchTasks(); 
        } catch (error) {
            showError("Failed to delete task.");
        }
    }
}

function editTask(taskId, currentTitle, currentDesc, currentPriority) {
    editIdInput.value = taskId;
    editTitleInput.value = currentTitle;
    editDescInput.value = currentDesc;
    editPriorityInput.value = currentPriority;
    editModal.classList.remove('hidden');
}
cancelEditBtn.addEventListener('click', () => {
    editModal.classList.add('hidden');
});

saveEditBtn.addEventListener('click', async () => {
    const taskId = editIdInput.value;
    const newTitle = editTitleInput.value;
    
    if (newTitle.trim() === "") {
        showModalError("Title cannot be empty!");
        return;
    }

    try {
        await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                title: newTitle, 
                description: editDescInput.value,
                priority: editPriorityInput.value 
            })
        });
        
        editModal.classList.add('hidden'); 
        fetchTasks(); 
    } catch (error) {
        showModalError("Failed to edit task.");
    }
});
function showError(msg) {
    errorMessage.textContent = msg;
    errorMessage.classList.remove('hidden');
    setTimeout(() => errorMessage.classList.add('hidden'), 4000);
}

function showModalError(msg) {
    modalErrorMessage.textContent = msg;
    modalErrorMessage.classList.remove('hidden');
    setTimeout(() => modalErrorMessage.classList.add('hidden'), 4000);
}







fetchTasks();
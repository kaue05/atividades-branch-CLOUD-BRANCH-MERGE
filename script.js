// Aplicação de Lista de Tarefas
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Função para adicionar tarefa
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = taskText;
    span.onclick = () => li.classList.toggle('completed');

    const removeBtn = document.createElement('button');
    removeBtn.textContent = '×';
    removeBtn.className = 'remove-btn';
    removeBtn.onclick = () => li.remove();

    li.appendChild(span);
    li.appendChild(removeBtn);
    taskList.appendChild(li);

    taskInput.value = '';
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

// Atualizar contadores
function updateCounters() {
    const total = taskList.children.length;
    const completed = taskList.querySelectorAll('.completed').length;

    document.getElementById('totalTasks').textContent = `Total: ${total}`;
    document.getElementById('completedTasks').textContent = `Concluídas: ${completed}`;
}

// Modificar função addTask para atualizar contador
const originalAddTask = addTask;
addTask = function () {
    originalAddTask();
    updateCounters();
};

// Observer para detectar mudanças
const observer = new MutationObserver(updateCounters);
observer.observe(taskList, { childList: true, subtree: true, attributes: true });

// Salvar tarefas no localStorage
function saveTasks() {
    const tasks = [];
    taskList.querySelectorAll('li').forEach(li => {
        tasks.push({
            text: li.querySelector('span').textContent,
            completed: li.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Modificar addTask para salvar
const finalAddTask = addTask;
addTask = function () {
    finalAddTask();
    saveTasks();
};

// Carregar tarefas salvas
function loadTasks() {
    const saved = localStorage.getItem('tasks');
    if (!saved) return;

    const tasks = JSON.parse(saved);
    tasks.forEach(task => {
        const li = document.createElement('li');

        const span = document.createElement('span');
        span.textContent = task.text;
        span.onclick = () => {
            li.classList.toggle('completed');
            saveTasks();
        };

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '×';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = () => {
            li.remove();
            saveTasks();
        };

        li.appendChild(span);
        li.appendChild(removeBtn);

        if (task.completed) {
            li.classList.add('completed');
        }

        taskList.appendChild(li);
    });

    updateCounters();
}

// Carregar ao iniciar
loadTasks();
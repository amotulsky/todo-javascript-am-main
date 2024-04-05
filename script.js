document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '3d53e1-902fd7-7ea452-7ea477-0cb5aa';
    const apiBaseUrl = 'https://cse204.work/todos';
    const addButton = document.getElementById('addTodoBtn');
    const inputField = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');

    addButton.addEventListener('click', () => addTodo(inputField.value));
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            addTodo(inputField.value);
        }
    });

    function addTodo(todoText) {
        const todo = { text: todoText };
        fetch(apiBaseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify(todo)
        })
        .then(response => response.json())
        .then(data => {
            console.log('ToDo Added:', data);
            inputField.value = '';
            fetchTodos(); 
        })
        .catch(error => console.error('Error:', error));
    }

    function fetchTodos() {
        todoList.innerHTML = ''; 
        fetch(apiBaseUrl, {
            method: 'GET',
            headers: { 'x-api-key': apiKey }
        })
        .then(response => response.json())
        .then(data => {
            data.forEach(todo => {
                createTodoElement(todo);
            });
        })
        .catch(error => console.error('Error:', error));
    }

    function deleteTodo(todoId) {
        fetch(`${apiBaseUrl}/${todoId}`, {
            method: 'DELETE',
            headers: { 'x-api-key': apiKey }
        })
        .then(() => fetchTodos())
        .catch(error => console.error('Error:', error));
    }

    function toggleTodoCompletion(todoId) {
        fetch(`${apiBaseUrl}/${todoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey
            },
            body: JSON.stringify({ completed: true })
        })
        .then(() => fetchTodos())
        .catch(error => console.error('Error:', error));
    }

    function createTodoElement(todo) {
        const li = document.createElement('li');
        li.textContent = todo.text;
        li.setAttribute('tabindex', '0'); 
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.addEventListener('click', () => toggleTodoCompletion(todo.id));


        li.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                toggleTodoCompletion(todo.id);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.setAttribute('type', 'button'); 
        deleteBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            deleteTodo(todo.id);
        });


        deleteBtn.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault(); 
                e.stopPropagation(); 
                deleteTodo(todo.id);
            }
        });

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    fetchTodos(); // fetch
});

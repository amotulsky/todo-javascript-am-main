const apiKey = '3d53e1-902fd7-7ea452-7ea477-0cb5aa';
const apiBaseUrl = 'http://cse204.work/todos';

document.addEventListener('DOMContentLoaded', () => {
    const addButton = document.getElementById('addTodoBtn');
    const inputField = document.getElementById('todoInput');
    const todoList = document.getElementById('todoList');

    addButton.addEventListener('click', () => addTodo(inputField.value));
    inputField.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
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
        .then(() => {
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
        .then(todos => {
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.textContent = todo.text;
                li.className = 'todo-item' + (todo.completed ? ' completed' : '');
                li.addEventListener('click', () => toggleTodoCompletion(todo.id));
                
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', (event) => {
                    event.stopPropagation();
                    deleteTodo(todo.id);
                });

                li.appendChild(deleteBtn);
                todoList.appendChild(li);
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

    fetchTodos(); 
});

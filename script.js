const todoInput = document.querySelector(".todo-input");
const todoDate = document.querySelector(".todo-date");
const todoButton = document.querySelector(".todo-button");
const todoList = document.querySelector(".todo-list");
const filterOption = document.querySelector(".filter-todo");

document.addEventListener("DOMContentLoaded", getLocalTodos);
todoButton.addEventListener("click", addTodo);
todoList.addEventListener("click", deleteCheck);
filterOption.addEventListener("change", filterTodo);

function addTodo(event) {
    event.preventDefault();
    const todoText = todoInput.value.trim();
    const dueDate = todoDate.value;

    if (todoText === "") {
        alert("Task cannot be empty!");
        return;
    }

    const now = new Date();
    const todoObj = {
        text: todoText,
        createdAt: now.toLocaleString(),
        due: dueDate
    };

    createTodoElement(todoObj);
    saveLocalTodos(todoObj);

    todoInput.value = "";
    todoDate.value = "";
}

function createTodoElement(todoObj) {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todo");

    const newTodo = document.createElement("li");
    newTodo.innerText = todoObj.text;
    newTodo.classList.add("todo-item");
    todoDiv.appendChild(newTodo);

    const timestamp = document.createElement("span");
    timestamp.classList.add("timestamp");
    timestamp.innerText = "Created: " + todoObj.createdAt;
    todoDiv.appendChild(timestamp);

    if (todoObj.due) {
        const due = document.createElement("span");
        due.classList.add("due-date");
        due.innerText = "Due: " + new Date(todoObj.due).toLocaleString();
        todoDiv.appendChild(due);
    }

    const completedButton = document.createElement("button");
    completedButton.innerHTML = '<i class="fas fa-check-circle"></i>';
    completedButton.classList.add("complete-btn");
    todoDiv.appendChild(completedButton);

    const trashButton = document.createElement("button");
    trashButton.innerHTML = '<i class="fas fa-trash"></i>';
    trashButton.classList.add("trash-btn");
    todoDiv.appendChild(trashButton);

    todoList.appendChild(todoDiv);
}

function deleteCheck(e) {
    const item = e.target;

    if (item.classList.contains("trash-btn")) {
        const todo = item.parentElement;
        todo.classList.add("slide");
        removeLocalTodos(todo);
        todo.addEventListener("transitionend", function () {
            todo.remove();
        });
    }

    if (item.classList.contains("complete-btn")) {
        const todo = item.parentElement;
        todo.classList.toggle("completed");
    }
}

function filterTodo(e) {
    const todos = todoList.childNodes;
    todos.forEach(function (todo) {
        switch (e.target.value) {
            case "all":
                todo.style.display = "flex";
                break;
            case "completed":
                if (todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
            case "incomplete":
                if (!todo.classList.contains("completed")) {
                    todo.style.display = "flex";
                } else {
                    todo.style.display = "none";
                }
                break;
        }
    });
}

function saveLocalTodos(todoObj) {
    let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    todos.push(todoObj);
    localStorage.setItem("todos", JSON.stringify(todos));
}

function getLocalTodos() {
    let todos = localStorage.getItem("todos") ? JSON.parse(localStorage.getItem("todos")) : [];
    todos.forEach(createTodoElement);
}

function removeLocalTodos(todoElement) {
    const todos = JSON.parse(localStorage.getItem("todos"));
    const text = todoElement.querySelector("li").innerText;
    const filteredTodos = todos.filter(t => t.text !== text);
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
}

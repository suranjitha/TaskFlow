// ============================
// Elements
// ============================

const taskInput = document.getElementById("taskInput");
const dueDate = document.getElementById("dueDate");
const priority = document.getElementById("priority");
const addTask = document.getElementById("addTask");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const pendingTasks = document.getElementById("pendingTasks");

// ============================
// Local Storage
// ============================

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// ============================
// Save Tasks
// ============================

function saveTasks(){

    localStorage.setItem("tasks",JSON.stringify(tasks));

}

// ============================
// Update Counters
// ============================

function updateCounters(){

    let total = tasks.length;

    let completed = tasks.filter(task => task.completed).length;

    let pending = total - completed;

    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    pendingTasks.textContent = pending;

}

// ============================
// Display Tasks
// ============================

function displayTasks(){

    taskList.innerHTML="";

    if(tasks.length===0){

        emptyMessage.style.display="block";

        updateCounters();

        return;

    }

    emptyMessage.style.display="none";

    tasks.forEach((task,index)=>{

        const li=document.createElement("li");

        li.className=`task ${task.completed ? "completed" : ""}`;

        li.innerHTML=`

        <div class="task-left">

            <div class="task-name">
                ${task.name}
            </div>

            <div class="task-date">
                📅 ${task.date || "No Due Date"}
            </div>

            <span class="priority ${task.priority.toLowerCase()}">
                ${task.priority}
            </span>

        </div>

        <div class="task-buttons">

            <button class="complete" onclick="completeTask(${index})">

                <i class="fa-solid fa-check"></i>

            </button>

            <button class="edit" onclick="editTask(${index})">

                <i class="fa-solid fa-pen"></i>

            </button>

            <button class="delete" onclick="deleteTask(${index})">

                <i class="fa-solid fa-trash"></i>

            </button>

        </div>

        `;

        taskList.appendChild(li);

    });

    updateCounters();

}

// ============================
// Add Task
// ============================

function addNewTask(){

    let taskName = taskInput.value.trim();

    if(taskName===""){

        alert("Please enter a task.");

        return;

    }

    let task={

        name:taskName,

        date:dueDate.value,

        priority:priority.value,

        completed:false

    };

    tasks.push(task);

    saveTasks();

    displayTasks();

    taskInput.value="";
    dueDate.value="";
    priority.value="Medium";

}

// ============================
// Complete Task
// ============================

function completeTask(index){

    tasks[index].completed=!tasks[index].completed;

    saveTasks();

    displayTasks();

}

// ============================
// Delete Task
// ============================

function deleteTask(index){

    if(confirm("Delete this task?")){

        tasks.splice(index,1);

        saveTasks();

        displayTasks();

    }

}

// ============================
// Edit Task
// ============================

function editTask(index){

    let newTask=prompt("Edit Task",tasks[index].name);

    if(newTask===null) return;

    if(newTask.trim()===""){

        alert("Task cannot be empty.");

        return;

    }

    tasks[index].name=newTask.trim();

    saveTasks();

    displayTasks();

}

// ============================
// Events
// ============================

addTask.addEventListener("click",addNewTask);

taskInput.addEventListener("keypress",function(e){

    if(e.key==="Enter"){

        addNewTask();

    }

});

// ============================
// Load Tasks
// ============================

displayTasks();
// ============================
// SEARCH TASKS
// ============================

const searchTask = document.getElementById("searchTask");

searchTask.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const taskCards = document.querySelectorAll(".task");

    taskCards.forEach(card => {

        const taskName = card.querySelector(".task-name").textContent.toLowerCase();

        if(taskName.includes(value)){
            card.style.display="flex";
        }
        else{
            card.style.display="none";
        }

    });

});


// ============================
// FILTER BUTTONS
// ============================

const filters = document.querySelectorAll(".filter");

filters.forEach(button=>{

    button.addEventListener("click",function(){

        filters.forEach(btn=>btn.classList.remove("active"));

        this.classList.add("active");

        let filter=this.dataset.filter;

        filterTasks(filter);

    });

});


// ============================
// FILTER FUNCTION
// ============================

function filterTasks(filter){

    const cards = document.querySelectorAll(".task");

    cards.forEach((card,index)=>{

        if(filter==="all"){

            card.style.display="flex";

        }
        else if(filter==="completed"){

            if(tasks[index].completed){
                card.style.display="flex";
            }else{
                card.style.display="none";
            }

        }
        else if(filter==="pending"){

            if(!tasks[index].completed){
                card.style.display="flex";
            }else{
                card.style.display="none";
            }

        }

    });

}

// ============================
// HIGHLIGHT OVERDUE TASKS
// ============================

function highlightOverdue(){

    const today=new Date();

    const cards=document.querySelectorAll(".task");

    cards.forEach((card,index)=>{

        if(tasks[index].date=="") return;

        let due=new Date(tasks[index].date);

        if(due<today && !tasks[index].completed){

            card.style.borderLeft="8px solid red";

        }

    });

}


// ============================
// UPDATE DISPLAY
// ============================

const oldDisplay=displayTasks;

displayTasks=function(){

    oldDisplay();

    highlightOverdue();

}


// ============================
// INITIAL LOAD
// ============================

displayTasks();
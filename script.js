const input = document.getElementById("todo-input");
const Submit = document.getElementById("submit");
const list = document.getElementById("todo-list");
const progressFill = document.getElementById("progress-fill");
const progressText = document.getElementById("progress-text");
const progressPercentage = document.getElementById("progress-percentage");
const searchInput = document.getElementById("search-input"); // لازم يبقى هنا الأول
const filterButtons = document.querySelectorAll(".filter-buttons button");
const clearCompletedBtn = document.getElementById("clear-completed");
const darkModeToggle = document.getElementById("darkModeToggle");

 //reterive data from local storage
let ArrayofData = [];
if (localStorage.product != null) {
    ArrayofData = JSON.parse(localStorage.product);
}
//draw item in page   
function renderTask(taskText, completed = false) {
    const li = document.createElement("li");

    li.innerHTML = `
        <div class="task-checkbox ${completed ? "checked" : ""}"></div>
        <span class="task-text" style="${completed ? 'text-decoration: line-through;' : ''}">${taskText}</span>
        <div class="task-actions">
             <i class="fa-solid fa-pen" onclick="editTask(this)" ${completed ? 'style="opacity: 0.3; cursor: not-allowed; pointer-events: none;"' : ''}></i>
            <i class="fa-solid fa-trash" onclick="deleteTask(this)"></i>
        </div>
    `;

    const checkbox = li.querySelector(".task-checkbox");

    // حدث تغيير الحالة
    checkbox.addEventListener("click", function() {
        const span = li.querySelector(".task-text");
        const editIcon = li.querySelector(".fa-pen");
        checkbox.classList.toggle("checked"); // toggle علامة ✓
        span.style.textDecoration = checkbox.classList.contains("checked") ? "line-through" : "none";

        // ⚠️ تعطيل أو تفعيل أيقونة التعديل حسب الحالة
        if (checkbox.classList.contains("checked")) {
            editIcon.style.opacity = "0.3";
            editIcon.style.cursor = "not-allowed";
            editIcon.style.pointerEvents = "none";
        } else {
            editIcon.style.opacity = "1";
            editIcon.style.cursor = "pointer";
            editIcon.style.pointerEvents = "auto";
        }

        // تحديث Array و LocalStorage
        const index = Array.from(list.children).indexOf(li);
        ArrayofData[index].completed = checkbox.classList.contains("checked");
        localStorage.setItem("product", JSON.stringify(ArrayofData));

         updateProgress();
    });

    list.appendChild(li);
}


//add task
Submit.addEventListener("click", addTask);
function addTask() {
    const text = input.value.trim();
    // 🍭 استبدال alert بـ SweetAlert2
    if (text === "") {
        Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Please enter a task!',
            confirmButtonColor: '#ff6f91'
        });
        return;
    }    
    renderTask(text);
    AddTaskToArray(text) ;

    input.value = "";
    updateProgress();
 }
function AddTaskToArray(taskText) {
    const task = {
        id: Date.now(),
        title: taskText,
        completed: false
    };

    ArrayofData.push(task);
    localStorage.setItem("product", JSON.stringify(ArrayofData));
}
// عرض كل التاسكات من localStorage عند تحميل الصفحة
for (let i = 0; i < ArrayofData.length; i++) {
    renderTask(ArrayofData[i].title, ArrayofData[i].completed); // خلي completed ينعكس على الكلاس
}

 updateProgress();


 
  //updata task
function editTask(icon) {
    const li = icon.parentElement.parentElement;
    const checkbox = li.querySelector(".task-checkbox");
    
    // ⚠️ منع التعديل إذا كانت التاسك مكتملة
    if (checkbox.classList.contains("checked")) {
        return;
    }
    
    const span = li.querySelector(".task-text");  
    span.contentEditable = true;   
    span.focus();  
    span.addEventListener("keydown", function(e) {
        if (e.key === "Enter") {
            // 🍭 استبدال alert بـ SweetAlert2
            const newText = span.innerText.trim();
            if (newText === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid!',
                    text: 'Task cannot be empty!',
                    confirmButtonColor: '#ff6f91'
                });
                span.innerText = ArrayofData[Array.from(list.children).indexOf(li)].title;
                span.contentEditable = false;
                return;
            }
            span.contentEditable = false;  
             const index = Array.from(list.children).indexOf(li);
            ArrayofData[index].title = span.innerText;
            localStorage.setItem("product", JSON.stringify(ArrayofData));
        }
    });
    // اختياري: لو خرجتي من span بالماوس
    span.addEventListener("blur", function() {
        // 🍭 استبدال alert بـ SweetAlert2
        const newText = span.innerText.trim();
        if (newText === "") {
            Swal.fire({
                icon: 'error',
                title: 'Invalid!',
                text: 'Task cannot be empty!',
                confirmButtonColor: '#ff6f91'
            });
            span.innerText = ArrayofData[Array.from(list.children).indexOf(li)].title;
            span.contentEditable = false;
            return;
        }
        span.contentEditable = false; 
        const index = Array.from(list.children).indexOf(li);
        ArrayofData[index].title = span.innerText;
        localStorage.setItem("product", JSON.stringify(ArrayofData));
    });
}



//delete task
function deleteTask(icon) {
    const li = icon.parentElement.parentElement;  
    const index = Array.from(list.children).indexOf(li);  
    ArrayofData.splice(index, 1);
     localStorage.setItem("product", JSON.stringify(ArrayofData));
     li.remove();
     updateProgress();
}

// تحديث شريط التقدم
 function updateProgress() {
    const total = ArrayofData.length;
    const completed = ArrayofData.filter(task => task.completed).length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressText.textContent = `${completed} of ${total} completed`;
    progressPercentage.textContent = `${percentage}%`;
    progressFill.style.width = `${percentage}%`;

    // 🎉 رسالة تشجيع لما يخلص كل التاسكات
    if (total > 0 && completed === total) {
        Swal.fire({
            icon: 'success',
            title: '🎉 Congratulations!',
            html: '<b>You completed all your tasks!</b><br>Keep up the amazing work! 💪✨',
            confirmButtonColor: '#ff6f91',
            timer: 4000,
            timerProgressBar: true
        });
    }
}


darkModeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")) {
        localStorage.darkMode = "enabled";
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.darkMode = "disabled";
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});
 
// 🔍 البحث عن التاسكات
searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderAllTasks();
});

 
let currentFilter = "all";
let searchQuery = "";

function renderAllTasks() {
    list.innerHTML = "";
    
    let filteredTasks = ArrayofData;
    
    // 🎯 تطبيق الفلتر
    if (currentFilter === "active") {
        filteredTasks = ArrayofData.filter(task => !task.completed);
    } else if (currentFilter === "completed") {
        filteredTasks = ArrayofData.filter(task => task.completed);
    }
    
    // 🔍 تطبيق البحث
    if (searchQuery) {
        filteredTasks = filteredTasks.filter(task => 
            task.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }
    
    if (filteredTasks.length === 0) {
        list.innerHTML = '<li class="empty-message">No tasks found</li>';
    } else {
        filteredTasks.forEach(task => {
    renderTask(task.title, task.completed);
});

    }
    
    updateProgress();
}
// 🎯 أزرار الفلترة
filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        filterButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderAllTasks();
    });
});
// 🗑️ حذف كل التاسكات المكتملة
clearCompletedBtn.addEventListener("click", () => {
    const completedCount = ArrayofData.filter(task => task.completed).length;
    
    // 🍭 استبدال alert بـ SweetAlert2
    if (completedCount === 0) {
        Swal.fire({
            icon: 'info',
            title: 'No Tasks',
            text: 'No completed tasks to clear!',
            confirmButtonColor: '#ff6f91'
        });
        return;
    }
    
    // 🍭 استبدال confirm بـ SweetAlert2
    Swal.fire({
        title: 'Are you sure?',
        text: `Delete ${completedCount} completed task(s)?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ff6f91',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            ArrayofData = ArrayofData.filter(task => !task.completed);
            localStorage.setItem("product", JSON.stringify(ArrayofData));
            renderAllTasks();
            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Completed tasks have been deleted.',
                confirmButtonColor: '#ff6f91',
                timer: 2000
            });
        }
    });
});
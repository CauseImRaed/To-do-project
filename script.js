// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const clearAllBtn = document.getElementById("clearAll");
  const themeToggle = document.getElementById("themeToggle");
  const resetTasks = document.getElementById("resetTasks");
  const filterButtons = document.querySelectorAll(".filter");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let filter = "all";

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function renderTasks() {
    taskList.innerHTML = "";
    let filtered = tasks.filter(task => {
      if (filter === "completed") return task.completed;
      if (filter === "active") return !task.completed;
      return true;
    });

    filtered.forEach((task, index) => {
      const li = document.createElement("li");
      li.className = `task ${task.completed ? "completed" : ""}`;

      const span = document.createElement("span");
      span.textContent = task.text;
      span.onclick = () => toggleTask(index);

      const actions = document.createElement("div");
      actions.className = "actions";

      const editBtn = document.createElement("button");
      editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
      editBtn.onclick = () => editTask(index);

      const deleteBtn = document.createElement("button");
      deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      deleteBtn.onclick = () => deleteTask(index);

      actions.append(editBtn, deleteBtn);
      li.append(span, actions);
      taskList.appendChild(li);
    });
  }

  function addTask() {
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ text, completed: false });
      taskInput.value = "";
      saveTasks();
      renderTasks();
    }
  }

  function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
  }

  function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
  }

  function editTask(index) {
    const newText = prompt("تعديل المهمة:", tasks[index].text);
    if (newText !== null && newText.trim()) {
      tasks[index].text = newText.trim();
      saveTasks();
      renderTasks();
    }
  }

  function clearAllTasks() {
    if (confirm("هل أنت متأكد من حذف كل المهام؟")) {
      tasks = [];
      saveTasks();
      renderTasks();
    }
  }

  function resetUI() {
    document.body.classList.remove("dark");
    localStorage.removeItem("tasks");
    tasks = [];
    saveTasks();
    renderTasks();
  }

  function toggleTheme() {
    document.body.classList.toggle("dark");
  }

  function setFilter(type) {
    filter = type;
    document.querySelectorAll(".filter").forEach(btn => btn.classList.remove("active"));
    document.querySelector(`.filter[data-filter="${type}"]`).classList.add("active");
    renderTasks();
  }

  // Event listeners
  addTaskBtn.onclick = addTask;
  taskInput.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
  });

  clearAllBtn.onclick = clearAllTasks;
  themeToggle.onclick = toggleTheme;
  resetTasks.onclick = resetUI;

  filterButtons.forEach(btn => {
    btn.onclick = () => setFilter(btn.dataset.filter);
  });

  // Init
  renderTasks();
});
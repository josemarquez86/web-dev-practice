const button = document.getElementById("myButton");
const message = document.getElementById("message");
let count = 0;

button.addEventListener("click", function () {
  count = count + 1;
  message.textContent = "Clicked " + count + " times";
  document.body.style.backgroundColor = "lightblue";
});

const taskInput = document.getElementById("taskInput");
const AddButton = document.getElementById("AddButton");
const taskList = document.getElementById("taskList");
const clearButton = document.getElementById("clearButton");

function addTask(text) {
  const item = document.createElement("li");
  item.textContent = text;

  item.addEventListener("click", function () {
    item.remove();
    saveTasks();
  });

  taskList.appendChild(item);
}

function saveTasks() {
  const items = taskList.querySelectorAll("li");
  const tasks = [];
  items.forEach(function (item) {
    tasks.push(item.textContent);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function handleAdd() {
  const text = taskInput.value.trim();
  if (text === "") {
    return;
  }
  addTask(text);
  taskInput.value = "";
  saveTasks();
}

AddButton.addEventListener("click", handleAdd);

taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleAdd();
  }
});

clearButton.addEventListener("click", function () {
  taskList.replaceChildren();
  saveTasks();
});

const saved = localStorage.getItem("tasks");
if (saved) {
  JSON.parse(saved).forEach(function (text) {
    addTask(text);
  });
}

const userInput = document.getElementById("userInput");
const lookupButton = document.getElementById("lookupButton");
const result = document.getElementById("result");

async function lookupUser() {
  const username = userInput.value.trim();
  if (username === "") {
    return;
  }

  result.textContent = "Loading...";

  try {
    const response = await fetch(
      "https://api.github.com/users/" + encodeURIComponent(username),
    );

    if (!response.ok) {
      result.textContent =
        "Couldn't load that user (error " + response.status + ")";
      return;
    }

    const data = await response.json();

    const avatar = document.createElement("img");
    avatar.src = data.avatar_url;
    avatar.alt = data.login;

    const heading = document.createElement("h3");
    heading.textContent = data.name || data.login;

    const stats = document.createElement("p");
    stats.textContent =
      data.public_repos + " public repos, " + data.followers + " followers";

    result.replaceChildren(avatar, heading, stats);
  } catch (error) {
    console.error(error);
    result.textContent =
      "Couldn't reach GitHub. Check your connection and try again.";
  }
}

lookupButton.addEventListener("click", lookupUser);

userInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    lookupUser();
  }
});

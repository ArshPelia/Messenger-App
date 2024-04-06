const messageForm = document.querySelector(".chatbox form");
const messageList = document.querySelector("#messagelist");
const userList = document.querySelector("#users");
const chatboxInput = document.querySelector(".chatbox input");
const socket = io("http://localhost:3000");
const currentUsername = document.currentScript.getAttribute("curUser");

let users = [];
let messages = [];
let isUser = "";

socket.on("message", message => {
  messages.push(message);
  updateMessages();
});

socket.on("private", data => {
  isUser = data.name;
});

socket.on("users", function (_users) {
  users = _users;
  updateUsers();
});

messageForm.addEventListener("submit", messageSubmitHandler);

function updateUsers() {
  userList.innerHTML = "";
  users.forEach(user => {
    const li = document.createElement("li");
    li.textContent = user;
    userList.appendChild(li);
  });
}

function updateMessages() {
  messageList.innerHTML = "";
  messages.forEach(message => {
    const show = isUser === message.user;
    const li = document.createElement("li");
    li.className = show ? "private" : "";
    li.innerHTML = `
      <p>${message.user}</p>
      <p>${message.message}</p>
    `;
    messageList.appendChild(li);
  });
}

function messageSubmitHandler(e) {
  e.preventDefault();
  const message = chatboxInput.value;
  socket.emit("message", message);
  chatboxInput.value = "";
}

function userAddHandler() {
  const userName = currentUsername;
  socket.emit("adduser", userName);
}

userAddHandler();

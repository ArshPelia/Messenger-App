const socket = io("http://localhost:3000");
const roomList = document.getElementById('roomList');
const createRoomForm = document.getElementById('createRoomForm');
const roomNameInput = document.getElementById('roomName');
let localRooms = []; // Array to store the rooms locally on the client side

// Function to update the list of rooms displayed to the user
function updateRooms(rooms) {
    localRooms = rooms; // Update the local rooms array
    roomList.innerHTML = "";

    localRooms.forEach(room => {
        const li = document.createElement("li");
        li.textContent = room;
        li.classList.add("list-group-item", "cursor-pointer");

        // Add event listener to join room when clicked
        li.addEventListener('click', () => {
            socket.emit('joinRoom', room);
        });

        roomList.appendChild(li);
    });
}

// Event listener for submitting the create room form
createRoomForm.addEventListener('submit', e => {
    e.preventDefault();
    const roomName = roomNameInput.value.trim();
    if (roomName) {
        socket.emit('createRoom', roomName, () => {
            // Callback function to update rooms after creating a new room
            socket.emit("getRooms");
            // Call updateRooms directly to avoid waiting for getRooms response
            updateRooms([...localRooms, roomName]);
        });
        roomNameInput.value = '';
    }
});

// Listen for room list updates
socket.on('updateRooms', rooms => {
    updateRooms(rooms);
});

// Initial setup
socket.emit("getRooms");

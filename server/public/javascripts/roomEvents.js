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
        const a = document.createElement("a");
        a.textContent = room;
        a.href = "#"; // Set href to '#' for now, you can replace it with appropriate URL
        a.classList.add("list-group-item", "cursor-pointer");

        // Add event listener to join room when clicked
        a.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default anchor behavior
            const roomName = event.target.textContent; // Get the room name from the anchor text
            socket.emit('joinRoom', roomName); // Emit joinRoom event to server
        });


        roomList.appendChild(a);
    });
}

// Event listener for submitting the create room form
createRoomForm.addEventListener('submit', e => {
    e.preventDefault();
    console.log('create room');
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

socket.on('redirect', function(destination) {
    window.location.href = destination;
});

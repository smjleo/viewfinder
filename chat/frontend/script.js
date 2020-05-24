const messageSendButton = document.getElementById('send-button');
const messageTextarea = document.getElementById('message-area');
const sendButtonSvg = document.querySelector("svg");
socket = io();

let usernameDisplays = [...document.getElementsByClassName('user-username')];

const potentialUsernames = ['Armadillo', 'Platypus', 'Cat', 'Dog', 'Elephant', 'Ferret', 'Lion', 'Cheetah', 'Senpai'];

let username = 'Anonymous' + potentialUsernames[Math.floor(Math.random() * potentialUsernames.length)];
let room = '';

window.onload = () => {
    room = location.href.slice(location.href.lastIndexOf('?') + 'room='.length + 1);
    document.getElementById('room-header').innerText = room;
    joinRoom();
    updateUsername();
    getAndAddPastMessages();

    const joinInfo = {
        "room": room,
        "username": username,
        "jointime": Date.now()
    }
    socket.emit('join', joinInfo);
}

messageSendButton.addEventListener('click', () => {
    const messageInfo = {
        "room": room,
        "author": username,
        "message": messageTextarea.value,
        "time": Date.now()
    }
    if (messageTextarea.value == 0) return;
    messageTextarea.value = "";
    sendButtonSvg.style.fill = "rgba(0, 0, 0, 0.3)";
    socket.emit('msg', messageInfo);
});

const updateUsername = () => {
    usernameDisplays.forEach((elem) => {
        elem.innerHTML = username;
    });
};

const joinRoom = () => {
    const url = `http://localhost:4000/api/room/${room}/join?username=${username}`;
    console.log('Joined room');
    console.log(`Sending post request to ${url}`);
    fetch(url, {
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    });
};

const addNewMessage = (message) => {
    const chats = document.getElementsByClassName('chat-container')[0];
    const d = (new Date(message.time)).toString();
    chats.innerHTML += 
        `<div class="chat-entry">
            <div class="chat-details">
                <p class="username">${message.author}</p>
                <date>${d}</date>
            </div>
            <p class="message">${message.message}</p>
        </div>`;
};

const addUserJoined = (username, jointime) => {
    const chats = document.getElementsByClassName('chat-container')[0];
    const d = (new Date(message.time)).toString();
    chats.innerHTML += 
        `<div class="chat-entry">
            <div class="chat-details">
                <p class="username">${username}</p>
                <date>${jointime}</date>
            </div>
            <p class="message">${username} joined the room!</p>
        </div>`;
};

const getAndAddPastMessages = () => {
    const url = 'https://localhost:4000/api/room/${room}/history';
    const history = fetch(url);
    const arr = history.data;
    arr.forEach((message) => {
        addNewMessage(message);
    });
}

socket.on('msg', msg => {
    addNewMessage(msg);
});

socket.on('join', (joinInfo) => {
    addUserJoined(joinInfo.username, joinInfo.jointime);
});

// fancy chat textarea button colour change
messageTextarea.addEventListener('keyup', e => {
    if (messageTextarea.value === "") sendButtonSvg.style.fill = "rgba(0, 0, 0, 0.3)";
    else sendButtonSvg.style.fill = "#0288D1";
});

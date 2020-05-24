const messageSendButton = document.getElementById('send-button');
const messageTextarea = document.getElementById('message-area');
const sendButtonSvg = document.querySelector("svg");
socket = io();

let usernameDisplays = [...document.getElementsByClassName('user-username')];

const potentialUsernames = ['Armadillo', 'Platypus', 'Cat', 'Dog', 'Elephant', 'Ferret', 'Lion', 'Cheetah', 'Senpai'];

let username = 'Anonymous' + potentialUsernames[Math.floor(Math.random() * potentialUsernames.length)];
let room = document.getElementById('room-header').innerHTML.replace(/\s/g, '');

window.onload = () => {
    room = location.href.slice(location.href.lastIndexOf('?') + 'room='.length + 1);
    document.getElementById('room-header').innerText = room;
    joinRoom();
    usernameDisplays.forEach((elem) => {
        elem.innerHTML = username;
    });
    console.log(room);
}

messageSendButton.addEventListener('click', () => {
    const messageInfo = {
        "author": username,
        "message": messageTextarea.value,
        "time": Date.now()
    }
    const url = `http://localhost:4000/api/room/${room}/message`;
    if (messageTextarea.value == 0) return;
    console.log('Clicked');
    console.log(`Sending post request to ${url}`);
    messageTextarea.value = "";
    sendButtonSvg.style.fill = "rgba(0, 0, 0, 0.3)";
    socket.emit('msg', messageInfo);
});

const joinRoom = () => {
    const url = `http://localhost:4000/api/room/${room}/join?username=${username}`;
    console.log('Joined room');
    console.log(`Sending post request to ${url}`);
    fetch(url, {
        method: 'post'
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

socket.on('msg', msg => {
    addNewMessage(msg);
});

// fancy chat textarea button colour change
messageTextarea.addEventListener('keyup', e => {
    if (messageTextarea.value === "") sendButtonSvg.style.fill = "rgba(0, 0, 0, 0.3)";
    else sendButtonSvg.style.fill = "#0288D1";
});

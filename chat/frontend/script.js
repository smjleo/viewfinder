const messageSendButton = document.getElementById('send-button');
const messageTextarea = document.getElementById('message-area');
const sendButtonSvg = document.querySelector("svg");

let usernameDisplays = [...document.getElementsByClassName('user-username')];

const potentialUsernames = ['Armadillo', 'Platypus', 'Cat', 'Dog', 'Elephant', 'Ferret', 'Lion', 'Cheetah', 'Senpai'];

let username = 'Anonymous' + potentialUsernames[Math.floor(Math.random() * potentialUsernames.length)];
const room = document.getElementById('room-header').innerHTML.replace(/\s/g, '');

window.onload = () => {
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
    if (messageTextarea.value == 0) break;
    console.log('Clicked');
    console.log(`Sending post request to ${url}`);
    messageTextarea.value = "";
    sendButtonSvg.style.fill = "rgba(0, 0, 0, 0.3)";
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageInfo),
    }).then((response) => {
        return response.status;
    }).catch((error) => {
        console.error(error);
    });
});

const joinRoom = () => {
    const url = `http://localhost:4000/api/room/${room}/join?username=${username}`;
    console.log('Joined room');
    console.log(`Sending post request to ${url}`);
    fetch(url, {
        method: 'post'
    });
};

let lastCheck = Date.now() - 1000;
const FREQUENCY_CHECK = 100;
const getNewMessages = () => {
    lastCheck += FREQUENCY_CHECK;
    console.log('Checking for new messages');
    const url = `http://localhost:4000/api/room/${name}/getmessages?time=${lastCheck}`;
    fetch(url, {
        method: 'post'
    }).then((response) => {
        console.log(response.json());
        return response.json();
    });
};

//setInterval(FREQUENCY_CHECK, getNewMessages);


// fancy chat textarea button colour change
messageTextarea.addEventListener('keypress', e => {
    if (messageTextarea.value === "") sendButtonSvg.style.fill = "rgba(0, 0, 0, 0.3)";
    else sendButtonSvg.style.fill = "#0288D1";
});
setInterval(FREQUENCY_CHECK, getNewMessages);

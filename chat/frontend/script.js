const messageSendButton = document.getElementById('send-button');
const messageTextarea = document.getElementById('message-area');

let usernameDisplays = [...document.getElementsByClassName('user-username')];

const potentialUsernames = ['Armadillo', 'Platypus', 'Cat', 'Dog', 'Elephant', 'Ferret', 'Lion', 'Cheetah', 'Senpai'];

let username = 'Anonymous' + potentialUsernames[Math.floor(Math.random() * potentialUsernames.length)];
const room = document.getElementById('room-header').innerHTML;

window.onload = () => {
    joinRoom();
    usernameDisplays.foreach((elem) => {
        elem.innerHTML = username;
    });
}

messageSendButton.addEventListener('click', () => {
    const messageInfo = {
        "author": username,
        "message": messageTextarea.value,
        "time": Date.now()
    }
    const url = `http://localhost:4000/api/room/${room}/message`;
    console.log('Clicked');
    console.log(`Sending post request to ${url}`);
    fetch(url, {
        method: 'post',
        body: JSON.stringify(messageInfo)
    }).then((response) => {
        return response.status;
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

setInterval(FREQUENCY_CHECK, getNewMessages);

const messageSendButton = document.getElementById('send-button');
const messageTextarea = document.getElementById('message-area');

let usernameDisplays = [...document.getElementsByClassName('user-username')];

const potentialUsernames = ['Armadillo', 'Platypus', 'Cat', 'Dog', 'Elephant', 'Ferret', 'Lion', 'Cheetah', 'Senpai'];

let username = 'Anonymous' + potentialUsernames[Math.floor(Math.random() * potentialUsernames.length)];
const room = document.getElementById('room-header').innerHTML;

messageSendButton.addEventListener('load', () => {
    usernameDisplays.forEach((elem) => {
        elem.innerHTML = username;
    });
});

messageSendButton.addEventListener('click', () => {
    const messageInfo = {
        "author": username,
        "message": messageTextarea.value,
        "time": Date.now()
    }
    const url = `http://localhost:4000/api/room/${room}/message`;
    fetch(url, {
        method: 'post',
        body: JSON.stringify(messageInfo)
    }).then((response) => {
        return response.status;
    });
});

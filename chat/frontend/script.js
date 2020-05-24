const usernameButton = document.getElementById('username-change');
const usernameTextarea = document.getElementById('username');
const errorArea = document.getElementById('error-mess');

let usernameDisplays = [...document.getElementsByClassName('username')];

const potentialUsernames = ['Armadillo', 'Platypus', 'Cat', 'Dog', 'Elephant', 'Ferret', 'Lion', 'Cheetah', 'Senpai'];

let username = 'Anonymous' + potentialUsernames[Math.floor(Math.random() * potentialUsernames.length)];

usernameButton.addEventListener('click', () => {
    const change = usernameTextarea.value;
    const MAX_CHARACTERS = 30;
    if (change.length > MAX_CHARACTERS) {
        errorArea.innerHTML = `Too many characters! Max ${MAX_CHARACTERS}`;
    }
    else {
        errorArea.innerHTML = '';
        username = change;
        
        usernameDisplays.forEach((elem) => {
            elem.innerHTML = username;
        });
    }
});

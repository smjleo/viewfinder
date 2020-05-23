const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const CHAT_PORT = 4000;
const VERBOSE_MODE = true;

// Hacked a json database, since it's a hackathon
const DATABASE = 
    {
        "rooms": {
            "example": {
                "users": [],
                "messages": []
            }
        }
    }

// Support handling of POST request data
app.use(bodyParser.json());

// Support handling of application/x-www-form-urlencoded POST request data
app.use(bodyParser.urlencoded({extended: true}));

/* Handle the GET request for seeing a chat room
 * @param name - the name of the room (named after the controversy)
 */
app.get('/api/room/:name', (req, res) => {
    if (VERBOSE_MODE) 
        console.log(`GET at /api/room/${req.params.name}`);
    res.send(JSON.stringify(req.params));
});

/* Handle the POST request for joining a chat room
 * @param name - the name of the room (named after the controversy)
 */
app.post('/api/room/:name/join', (req, res) => {
    const USER_NAME = req.query.username;
    const ROOM_NAME = req.params.name;

    if (VERBOSE_MODE)
        console.log(`POST at /api/room/${ROOM_NAME}/join?username=${USER_NAME}`);

    const joinTime = Date.now();
    const user = {
        username: USER_NAME,
        jointime: joinTime
    }

    if (!roomExists(ROOM_NAME)) {
        createRoom(ROOM_NAME);
    }
    addUserToRoom(user, ROOM_NAME);

    res.sendStatus(200);
});

/* Handle the POST request for leaving a chat room
 * @param name - the name of the room (named after the controversy)
 */
app.post('/api/room/:name/leave', (req, res) => {

});

app.listen(CHAT_PORT, () => {
    console.log(`Chat server now listening on port ${CHAT_PORT}`);
});

/* Check if a room exists in the DATABASE
 * @param roomName the name of the room
 * @return if the room exists with the DATABASE
 */
const roomExists = (roomName) => {
    return DATABASE["rooms"].hasOwnProperty(roomName);
}

/* Create a room within the DATABASE
 * @param roomName the name of a room, which shouldn't exist beforehand
 * @effect create a room template for the given roomName
 */
const createRoom = (roomName) => {
    DATABASE["rooms"][roomName] = {
        "users": [],
        "messages": []
    }
    if (VERBOSE_MODE) 
        console.log(`Creating room ${roomName}.`);
}

/* Add a user to a room within the DATABASE
 * @param user the user to be added to the room
 * @param roomName the name of the room
 * @effect adds the user to the array of users in the room of the DATABASE
 */
const addUserToRoom = (user, roomName) => {
    DATABASE["rooms"][roomName]["users"].push(user);
    if (VERBOSE_MODE) 
        console.log(`Added user ${user} to room ${roomName}`);
}

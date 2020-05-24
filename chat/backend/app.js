const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

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

// Enable CORS for ALL origins.
// TODO: safety
app.use(cors());

// Support static files
app.use(express.static('../frontend'));

/* Handle the GET request for seeing a chat room
 * @param name - the name of the room (named after the controversy)
 */
app.get('/api/room/:name', (req, res) => {
    const ROOM_NAME = req.params.name;
    if (VERBOSE_MODE) 
        console.log(`GET at /api/room/${ROOM_NAME}`);
    res.sendFile(path.join(__dirname, '/../frontend/index.html'));
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
    const ROOM_NAME = req.params.name;
    const USER_NAME = req.query.username;

    if (VERBOSE_MODE)
        console.log(`POST at /api/room/${ROOM_NAME}/leave?username=${USER_NAME}`);

    deleteUserFromRoom(USER_NAME, ROOM_NAME);
    if (!roomExists(ROOM_NAME)) {
        res.sendStatus(404);
    }
    else {
        deleteRoom(ROOM_NAME);
        res.sendStatus(200);
    }
});

/* Handle new messages sent
 * @param name - the name of the room (named after the controversy)
 */
app.post('/api/room/:name/message', (req, res) => {
    const ROOM_NAME = req.params.name;

    if (VERBOSE_MODE)
        console.log(`POST at /api/room/${ROOM_NAME}/message with contents ${JSON.stringify(req.body)}`);

    if (!roomExists(ROOM_NAME)) {
        res.sendStatus(404);
    }
    else {
        addMessageToRoom(req.body, ROOM_NAME);
        res.sendStatus(200);
    }
});

/* Get messages after a given time
 * @param name - the name of the room (named after the controversy)
 */
app.post('/api/room/:name/getmessages', (req, res) => {
    const ROOM_NAME = req.params.name;
    const TIME = req.query.time;

    if (VERBOSE_MODE)
        console.log(`POST at /api/room/${ROOM_NAME}/getmessages?time=${TIME}`);

    if (!roomExists(ROOM_NAME)) {
        res.sendStatus(404);
    }
    else {
        const messages = getMessageFromTimeFromRoom(TIME, ROOM_NAME);
        res.send(messages);
    }
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

/* Delete a room within the DATABASE
 * @param roomName the name of the existing room to be deleted from the database
 * @effect deletes the room from the database
 */
const deleteRoom = (roomName) => {
    delete DATABASE["rooms"][roomName];
    if (VERBOSE_MODE)
        console.log(`Deleted room ${roomName}`);
}

/* Add a user to a room within the DATABASE
 * @param user the user to be added to the room
 * @param roomName the name of the room
 * @effect adds the user to the array of users in the room of the DATABASE
 */
const addUserToRoom = (user, roomName) => {
    DATABASE["rooms"][roomName]["users"].push(user);
    if (VERBOSE_MODE) 
        console.log(`Added user ${JSON.stringify(user)} to room ${roomName}`);
}

/* Remove a user from a room within the DATABASE
 * @param userName username of the user to be deleted from the room
 * @param roomName name of the existing room the user is to be removed from
 * @effect deletes the user for the given from from the DATABASE
 */
const deleteUserFromRoom = (userName, roomName) => {
    DATABASE["rooms"][roomName]["users"].forEach((user, index) => {
        if (user.username === userName)
            DATABASE["rooms"][roomName]["users"].splice(index, 1);
    });
    if (VERBOSE_MODE) 
        console.log(`Deleted user ${userName} from room ${roomName}`);
}

/* Add a message to a room within the DATABASE
 * @param body a json with keys for "author", "message", and "time"
 * @param roomName the name of the room which the message should be added to
 * @effect adds the message to the room
 */
const addMessageToRoom = (body, roomName) => {
    DATABASE["rooms"][roomName]["messages"].push(JSON.stringify(body));
}

/* Gets all messages after the given time within a room of the DATABASE
 * @param time get all the messages sent after this time
 * @param roomName the name of the room to get the messages from
 * @return filtered an Array with the filtered messages
 */
const getMessageFromTimeFromRoom = (time, roomName) => {
    const filtered = DATABASE["rooms"][roomName]["messages"].filter(message => message.time >= time);
    return filtered;
}

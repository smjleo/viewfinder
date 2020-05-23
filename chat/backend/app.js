const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const CHAT_PORT = 4000;

// Hacked a json database, since it's a hackathon
const DATABASE = 
    {
        "rooms": {
            "example": {
                "users": {

                },
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
    console.log(`GET at /api/room/${req.params.name}`);
    res.send(JSON.stringify(req.params));
});

/* Handle the POST request for joining a chat room
 * @param name - the name of the room (named after the controversy)
 */
app.post('/api/room/:name/join', (req, res) => {
    const joinTime = Date.now();
    const user = {
        username: req.query.username,
        jointime: joinTime
    }
    res.send(user);
});

/* Handle the POST request for leaving a chat room
 * @param name - the name of the room (named after the controversy)
 */
app.post('/api/room/:name/leave', (req, res) => {

});

app.listen(CHAT_PORT, () => {
    console.log(`Chat server now listening on port ${CHAT_PORT}`);
});

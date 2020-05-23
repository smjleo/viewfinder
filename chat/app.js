const express = require('express');
const app = express();

const CHAT_PORT = 4000;

/* Handle the GET request for joining a chat room
 * @param name - the name of the room (named after the controversy)
 */
app.get('/api/room/:name', (req, res) => {
    res.send(req.params);
});

app.listen(CHAT_PORT, () => {
    console.log(`Chat server now listening on port ${CHAT_PORT}`);
});

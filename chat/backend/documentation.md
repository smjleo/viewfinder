# Chat Room Documentation

## Accessing Room

**requires**: **name** the name of the room (named after the controversy)
**effects**: returns a json containing the room information
${url}/api/room/:name

## Joining Room

**requires**: **name** the name of the room (named after the controversy)
**requires**: **username** query of the username of the user joining
**effects**: if there is no room with that name, create the room
**effects**: adds a user to the room's database
${url}/api/room/:name/join?username=${username}

## Leaving Room
**requires**: **name** the name of the room (named after the controversy)
**requires**: **username** query of the username of the user leaving
**effects**: if there are no more users in the room, remove the room
**effects**: removes a user from the room's database
${url}/api/room/:name/leave?username=${username}

## Sending Message
**requires**: **name** the name of the room (named after the controversy)
**requires**: **message** a json sent through the POST request with the keys "author", "message", and "time"
**effects**: if there is a room, adds the message to the database of the room
${url}/api/room/:name/message
POST { "author": "admin", "message": "hello world", "time": 69696969 }

## Getting Messages
**requires**: **name** the name of the room (named after the controversy)
**requires**: **time** a query of the time of which messages after should be get
**effects**: if there is a room, filters through the messages of the room, getting ones sent after that time
${url}/api/room/:name/getmessages?time=${time}

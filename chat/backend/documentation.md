# Chat Room Documentation

## Accessing Room

**requires**: **name** the name of the room (named after the controversy)
**effects**: returns a json containing the room information
${url}/api/room/:name

## Joining Room

**requires**: **name** the name of the room (named after the controversy)
**effects**: if there is no room with that name, create the room
**effects**: adds a user to the room's database

## Leaving Room
**requires**: **name** the name of the room (named after the controversy)
**effects**: if there are no more users in the room, remove the room
**effects**: removes a user from the room's database
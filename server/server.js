// const port = 3001
// const express = require('express')
// const app = express()
//
// // ===================== Socket.io =====================
// const http = require('http');
// const server = http.createServer(app);
// const { Server } = require("socket.io");
// const io = new Server(server);
//
//
// io.on('connection', (socket) => {
//     console.log('a user connected');
// });
//
// app.get('/', (req, res) => {
//     res.send('Hello World!1')
// })
//
// app.listen(port, () => {
//     console.log(`Example app listening on port ${port}`)
// })







require('dotenv').config({path: '../.env'})
const port = process.env.SERVER_PORT;

const express = require("express");
const http = require("http");
const cors = require('cors');
const socketIo = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {cors: {origin: "*"}});

app.use(cors());

// Classes
const Rooms_C = require('./Rooms');
const Users_C = require('./Users');
const ValidateData_C = require('./Helpers/ValidateData');

let interval;
io.on("connection", (socket) => {
    console.log("New client connected1");
    if (interval) {
        clearInterval(interval);
    }
    interval = setInterval(() => getApiAndEmit(socket), 1000);
    socket.on("disconnect", () => {
        console.log("Client disconnected");
        clearInterval(interval);

        // Remove user from all rooms
        Rooms_C.remove_user_from_all_room(socket.id)
    });

    // Check if user has joined a room
    socket.on('check_if_user_joined_room', (data, cb) => {
        const response = {
            state: null,
            name: null
        }
        const has_joined = Rooms_C.if_user_in_queue_room(socket.id)

        if (has_joined) {
            // Get user data
            const user_found = Users_C.get_user_data(socket.id)
            if (user_found['state']) {
                response['state'] = true
                response['name'] = user_found['data']['socket_name']
            }
        }

        cb(response)
    })

    socket.on('join', (data, cb) => {
        // Store response
        const response = {
            state: null,
            msg: null
        }

        // Validate name
        const name = data['name']
        const valid_name = ValidateData_C.check_name_upon_join(name)

        // Valid name
        if (valid_name) {
            response['state'] = true

            // Set user's socket name
            socket.name = name

            // Put user into queue room
            const user_data = Rooms_C.put_user_into_queue_room(socket.id, socket.name)

            // Save user into users
            Users_C.save_user(socket.id, socket.name, user_data['room_id'], 'queue')
        }

        // Invalid name
        else if (!valid_name) {
            response['state'] = false
            response['msg'] = 'Name cannot be empty!'
        }

        console.log(response)

        cb(response);
    })
});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

const getApiAndEmit = socket => {
    const response = new Date();
    // Emitting a new message. Will be consumed by the client
    socket.emit("FromAPI", response);
};

server.listen(port, () => console.log(`Listening on port ${port}`));

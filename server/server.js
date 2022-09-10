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
    console.log("New client connected");


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
    socket.on('check_if_user_in_queue', (data, cb) => {
        const response = {
            in_queue: false,
            name: null
        }

        // const has_joined = Rooms_C.if_user_in_queue_room(socket.id)

        // Check if user found
        const result = Users_C.get_user_data(socket.id)
        console.log(result)
        if (result['found']) {
            // Check if user is in queue
            if (result['data']['room_type'] === 'queue') {
                response['in_queue'] = true
                response['name'] = result['data']['socket_name']
            }
        }

        cb(response)
    })

    // User sent a message
    socket.on('send_message', (data, cb) => {
        // let sender_name = null

        console.log('request: send_message')

        // Get user data
        const user_data = Users_C.get_user_data(socket.id)
        if (user_data['found']) {
            // const sender_name = data['sender_name']
            // const sender_name = user_data['data']['socket_name']
            // const room_id = user_data['data']['room_id']
            const message = data['message']

            io.to(socket.roomid).emit('receive_message', {
                sender_name: socket.name,
                message: message
            });

        } else {
            return 0
        }
    })

    socket.on('get_my_socket_roomid', () => {
        console.log(socket.roomid)
    })

    // User actually join a room id
    socket.on('actually_join_roomid', (_data) => {
        const new_roomid = _data['new_roomid']
        socket.roomid = new_roomid
        socket.join(new_roomid)

        // Change user room type
        Users_C.update_user_room_type(socket.id, 'chat')

        console.log(`User ${socket.name} has joined the room ${new_roomid}`)
    })

    // Find someone to chat with
    socket.on('find_someone_to_chat_with', () => {
        // Find someone
        const result = Users_C.find_user_in_queue(socket.id)

        // If found someone to chat with
        if (result['found']) {
            console.log('Found someone to chat with', result)

            const someone_data = result['data']

            // Update user's room type
            // Users_C.update_user_room_type(socket.id, 'chat')

            const new_roomid = 5

            // Let user join room
            io.to(socket.id).emit('do_join_roomid', {
                new_roomid: new_roomid,
            });

            // Let someone join room
            io.to(someone_data['socket_id']).emit('do_join_roomid', {
                new_roomid: new_roomid,
            });
        }

        // If did not find someone to chat with
        else {
            console.log('Did not find someone to chat with')
        }
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

            socket.name = name // Set user's socket name
            socket.roomid = null // Set user's socket room id

            Users_C.save_user(socket.id, socket.name, socket.roomid, 'queue')

            // Check if there are available queue rooms
            // const available_queue_room = Rooms_C.fid_available_queue_rooms()

            // // Find a match of a user in a queue
            // const user_in_queue = Users_C.find_user_in_queue()
            //
            // // Queue user found
            // if (user_in_queue['found']) {
            //
            //     // Generate chat room id
            //     const chat_room_id = Rooms_C.chat_rooms.length
            //
            //     // Set new user socket's room id
            //     socket.roomid = chat_room_id
            //
            //     // Join new user room
            //     socket.join(chat_room_id)
            //
            //     // Save new user into users
            //     Users_C.save_user(socket.id, socket.name, chat_room_id, 'chat')
            //
            //     // Get queue user socket id
            //     const queue_user_socket_id = user_in_queue['data']['socket_id']
            //
            //     // Let queue user join the room
            //     io.to(queue_user_socket_id).emit('do_join_roomid', {
            //         new_roomid: chat_room_id,
            //     });
            //
            //     // io.sockets.connected[queue_user_socket_id].roomid = chat_room_id
            //
            //     //
            //     // // Get queue room id
            //     // const queue_room_id = available_queue_room['room_data']['room_id']
            //     //
            //     // // Put new user into a new chat room
            //     // const result = Rooms_C.put_user_into_chat_room(socket.id, socket.name, socket.roomid)
            //     //
            //     // // Put queue user into chat room with new user
            //     // Rooms_C.put_user_into_chat_room(socket.id, socket.name, socket.roomid)
            //     //
            //     // // Join two users together
            //     console.log('available_queue_room found', user_in_queue)
            //
            // }
            // // No queue rooms found
            // else {
            //     console.log('No queue rooms found')
            //
            //     // Save user into users
            //     socket.roomid = null
            //     Users_C.save_user(socket.id, socket.name, socket.roomid, 'queue')
            //
            //     // socket.roomid = Rooms_C.queue_rooms.length // Set user's socket room id
            //     //
            //     // // Put user into queue room
            //     // const result = Rooms_C.put_user_into_queue_room(socket.id, socket.name, socket.roomid)
            //     //
            //     // // If user added to queue room
            //     // if (result['state']) {
            //     //     // Socket join room
            //     //     socket.join(socket.roomid)
            //     //
            //     //     // Save user into users
            //     //     Users_C.save_user(socket.id, socket.name, socket.roomid, 'queue')
            //     // }
            //     // else {
            //     //     response['state'] = false
            //     // }
            // }
        }

        // Invalid name
        else if (!valid_name) {
            response['state'] = false
            response['msg'] = 'Name cannot be empty!'
        }

        // console.log('User joined room:', socket.roomid)

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

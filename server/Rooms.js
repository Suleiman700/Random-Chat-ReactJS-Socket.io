
class Rooms {
    constructor() {
        console.log('[Info] Rooms class loaded')
        this.chat_rooms = []
        this.queue_rooms = []
    }

    /**
     * Put user into a queue room
     * @param _socket_id {String}
     * @param _socket_name {String}
     * @param _room_id {Number}
     */
    put_user_into_queue_room(_socket_id, _socket_name, _room_id) {
        const response = {
            state: null
        }

        // Check if user is in queue room
        const already_in_queue = this.if_user_in_queue_room(_socket_id)

        if (!already_in_queue) {
            const user_data = {
                socket_id: _socket_id,
                socket_name: _socket_name,
                room_id: _room_id
            }

            this.queue_rooms.push(user_data)

            response['state'] = true
        }

        return response
    }

    /**
     * Put user into a chat room
     * @param _socket_id {String}
     * @param _socket_name {String}
     * @param _room_id {Number}
     */
    put_user_into_chat_room(_socket_id, _socket_name, _room_id) {
        const response = {
            state: null
        }

        // Check if user is in queue room
        const already_in_chat = this.if_user_in_chat_room(_socket_id)

        if (!already_in_chat) {
            const user_data = {
                socket_id: _socket_id,
                socket_name: _socket_name,
                room_id: _room_id
            }

            this.chat_rooms.push(user_data)

            response['state'] = true
        }

        return response
    }

    /**
     * Remove user from queue room
     * @param _socket_id {String}
     */
    remove_user_from_all_room(_socket_id) {
        this.queue_rooms = this.queue_rooms.filter((room) => {
            return room['socket_id'] !== _socket_id
        });

        this.chat_rooms = this.chat_rooms.filter((room) => {
            return room['socket_id'] !== _socket_id
        });
    }

    /**
     * Check if user is in queue room
     * @param _socket_id {String}
     */
    if_user_in_queue_room(_socket_id) {
        let found = false
        const data = this.queue_rooms.find(queue_room => {
            return queue_room['socket_id'] === _socket_id
        })
        if (data) found = true

        return found
    }

    /**
     * Check if user is in chat room
     * @param _socket_id {String}
     */
    if_user_in_chat_room(_socket_id) {
        let found = false
        const data = this.chat_rooms.find(chat_room => {
            return chat_room['socket_id'] === _socket_id
        })
        if (data) found = true

        return found
    }

    /**
     * Get user info based on his socket id
     * @param _socket_id {String}
     */
    get_user_info(_socket_id) {

    }

    // Find if there are available queue rooms
    fid_available_queue_rooms() {
        const response = {
            found: null,
            room_data: null
        }

        // Count queue rooms
        const count = this.queue_rooms.length
        if (count) {
            // Get first queue room
            const room = this.queue_rooms[0]

            response['found'] = true
            response['room_data'] = room
        }

        return response
    }

}

const Rooms_C = new Rooms()
module.exports = Rooms_C

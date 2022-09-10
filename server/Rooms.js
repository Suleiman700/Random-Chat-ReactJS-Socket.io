
class Rooms {
    constructor() {
        console.log('[Info] Rooms class loaded')
        this.chat_rooms = []
        this.queue_rooms = []
    }

    /**
     * Put user into a room
     * @param _socket_id {String}
     * @param _socket_name {String}
     */
    put_user_into_queue_room(_socket_id, _socket_name) {
        // Check if user is in queue room
        const already_in_queue = this.if_user_in_queue_room(_socket_id)

        if (!already_in_queue) {
            const user_data = {
                socket_id: _socket_id,
                socket_name: _socket_name,
                room_id: this.queue_rooms.length
            }

            this.queue_rooms.push(user_data)

            return user_data
        }

        console.log(this.queue_rooms)
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
     * Get user info based on his socket id
     * @param _socket_id {String}
     */
    get_user_info(_socket_id) {

    }
}

const Rooms_C = new Rooms()
module.exports = Rooms_C

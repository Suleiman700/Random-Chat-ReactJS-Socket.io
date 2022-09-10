
class Users {
    constructor() {
        console.log('[Info] Users class loaded')
        this.users = []
    }

    /**
     * Save user into users object
     * @param _socket_id {String}
     * @param _socket_name {String}
     * @param _room_id {Number}
     * @param _room_type {String} > chat|queue
     */
    save_user(_socket_id, _socket_name, _room_id, _room_type) {
        this.users.push({
            socket_id: _socket_id,
            socket_name: _socket_name,
            room_id: _room_id,
            room_type: _room_type
        })

        console.log(this.users)
    }

    get_user_data(_socket_id) {
        const response = {
            found: null,
            data: null
        }

        const user_data = this.users.find(user => {
            return user['socket_id'] === _socket_id
        })

        if (user_data) {
            response['found'] = true
            response['data'] = user_data
        }
        else {
            response['found'] = false
        }

        return response
    }

    /**
     * Find a user in a queue (Exclude _socket_id)
     * @param _socket_id {String}
     */
    find_user_in_queue(_socket_id) {
        const response = {
            found: null,
            data: null
        }

        const user_data = this.users.find(user => {
            return (user['room_type'] === 'queue' && user['socket_id'] !== _socket_id)
        })

        if (user_data) {
            response['found'] = true
            response['data'] = user_data
        }
        else {
            response['found'] = false
        }

        return response
    }

    /**
     * Update user room type
     * @param _socket_id {String}
     * @param _room_type {String}
     */
    update_user_room_type(_socket_id, _room_type) {
        this.users.map(user => {
            if (user['socket_id'] === _socket_id) {
                user['room_type'] = _room_type
            }
        })
    }


}

const Users_C = new Users()
module.exports = Users_C

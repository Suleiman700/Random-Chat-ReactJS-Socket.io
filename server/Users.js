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
    }

    get_user_data(_socket_id) {
        const response = {
            state: null,
            data: null
        }

        const user_data = this.users.find(user => {
            return user['socket_id'] === _socket_id
        })

        if (user_data) {
            response['state'] = true
            response['data'] = user_data
        }
        else {
            response['state'] = false
        }

        return response
    }
}

const Users_C = new Users()
module.exports = Users_C

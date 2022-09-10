import socketIOClient from 'socket.io-client';
const SOCKETIO_ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT
const socket = socketIOClient(SOCKETIO_ENDPOINT);

export default socket

// socket.js
import io from 'socket.io-client';

// Replace 'http://localhost:3000' with your server's URL
const socket = io('http://localhost:3000');

export default socket;

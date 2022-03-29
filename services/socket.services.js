const io = require("socket.io")();
const socket = {
    io: io
};
module.exports = { socket: socket };
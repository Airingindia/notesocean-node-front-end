const socketServices = require("../services/socket.services");
const io = socketServices.socket.io;

var liveusers = {};
io.on("connection", (socket) => {
    // console.log("a user is conncted");
    // join a user
    var roomId;
    socket.on("join", async (data) => {
        roomId = data.noteId;
        const userdata = data.userdata;
        await socket.join(roomId);

        // send all user except this user
        socket.broadcast.to(roomId).emit("joined", userdata);
        liveusers[socket.id] = userdata;
        io.to(roomId).emit("live", socket.adapter.rooms.get(roomId));


        if (socket.adapter.rooms.get(roomId) !== undefined) {
            const clients = await socket.adapter.rooms.get(roomId);
            var roomuser = [];
            clients.forEach(function (data, counter) {
                var socketId = data;
                roomuser.push(liveusers[socketId]);

            });
            await io.to(roomId).emit("liveusers", roomuser);
            roomuser = [];
        }

        io.emit("liveNotes", liveusers);
    });

    socket.on("disconnect", async () => {
        await socket.leave(roomId);
        await socket.broadcast.to(roomId).emit("left", liveusers[socket.id]);
        delete liveusers[socket.id];
        await io.to(socket).emit("live", socket.adapter.rooms.get(roomId));

        if (socket.adapter.rooms.get(roomId) !== undefined) {
            const clients = await socket.adapter.rooms.get(roomId);
            var roomuser = [];
            clients.forEach(function (data, counter) {
                var socketId = data;
                roomuser.push(liveusers[socketId]);
            });
            await io.to(roomId).emit("liveusers", roomuser);
            roomuser = [];
        }

        io.emit("liveNotes", liveusers);

    });
    io.emit("liveNotes", liveusers);
});
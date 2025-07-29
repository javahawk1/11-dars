const http = require("http")
const express = require("express")
const app = express()
const server = http.createServer(app)
const cors = require("cors")

const { Server } = require("socket.io")

const io = new Server(server, {
    cors: {
        origin: "*"
    }
})

io.on("connection", socket => {
    socket.on("message", (msg) => {
        if (msg.group) {
            io.to(msg.group).emit("message", { text: msg.text, from: socket.id })
        } else {
            io.emit("message", { text: msg.text, from: socket.id })
        }
    })

    socket.on("join-gr", (roomName) => {
        socket.join(roomName);
    });

    socket.on("leave-gr", (roomName) => {
        socket.leave(roomName);
    });

})

app.use(cors())

app.get("/", (req, res) => {
    res.send({text: "server started"})
})

server.listen(3000, () => {
    console.log("Server started")
})